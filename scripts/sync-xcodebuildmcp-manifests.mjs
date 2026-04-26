#!/usr/bin/env node
/**
 * Fetch workflow and tool manifests from getsentry/XcodeBuildMCP at the
 * latest published tag (or a ref passed via `--ref=<ref>`), plus the
 * package.json version for display.
 *
 * Output: app/docs/_data/generated/manifests.json
 *
 * Run manually whenever a new XcodeBuildMCP release is out:
 *   pnpm run docs:sync
 */

import { writeFile, mkdir, readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { load as loadYaml } from "js-yaml"

const REPO = "getsentry/XcodeBuildMCP"
const GH_API = "https://api.github.com"
const RAW = "https://raw.githubusercontent.com"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const outDir = path.join(projectRoot, "app", "docs", "_data", "generated")
const outFile = path.join(outDir, "manifests.json")

const args = process.argv.slice(2)
const refArg = args.find((a) => a.startsWith("--ref="))?.slice("--ref=".length)
const LOCAL_FALLBACK = args.includes("--local") || process.env.XBMCP_LOCAL === "1"
const LOCAL_REPO = process.env.XBMCP_LOCAL_PATH ?? "/Volumes/Developer/XcodeBuildMCP-main"

function ghHeaders() {
  const h = { Accept: "application/vnd.github+json", "User-Agent": "xcodebuildmcp-docs-sync" }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: ghHeaders() })
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${res.statusText}`)
  return res.json()
}

async function fetchText(url) {
  const res = await fetch(url, { headers: ghHeaders() })
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${res.statusText}`)
  return res.text()
}

async function resolveRef() {
  if (refArg) return refArg
  try {
    const latest = await fetchJson(`${GH_API}/repos/${REPO}/releases/latest`)
    return latest.tag_name
  } catch {
    const tags = await fetchJson(`${GH_API}/repos/${REPO}/tags?per_page=1`)
    return tags[0]?.name ?? "main"
  }
}

async function listDir(ref, dir) {
  const url = `${GH_API}/repos/${REPO}/contents/${dir}?ref=${encodeURIComponent(ref)}`
  const items = await fetchJson(url)
  return items.filter((i) => i.type === "file" && i.name.endsWith(".yaml"))
}

async function fetchManifestsRemote(ref) {
  const [workflowEntries, toolEntries] = await Promise.all([
    listDir(ref, "manifests/workflows"),
    listDir(ref, "manifests/tools"),
  ])

  const workflows = await Promise.all(
    workflowEntries.map(async (e) => {
      const yaml = await fetchText(
        `${RAW}/${REPO}/${encodeURIComponent(ref)}/manifests/workflows/${e.name}`
      )
      return loadYaml(yaml)
    })
  )

  const tools = await Promise.all(
    toolEntries.map(async (e) => {
      const yaml = await fetchText(
        `${RAW}/${REPO}/${encodeURIComponent(ref)}/manifests/tools/${e.name}`
      )
      return loadYaml(yaml)
    })
  )

  const pkg = JSON.parse(
    await fetchText(`${RAW}/${REPO}/${encodeURIComponent(ref)}/package.json`)
  )

  return { workflows, tools, version: pkg.version }
}

async function fetchManifestsLocal() {
  const { readdir } = await import("node:fs/promises")
  const wfDir = path.join(LOCAL_REPO, "manifests", "workflows")
  const toolDir = path.join(LOCAL_REPO, "manifests", "tools")
  const wfFiles = (await readdir(wfDir)).filter((f) => f.endsWith(".yaml"))
  const toolFiles = (await readdir(toolDir)).filter((f) => f.endsWith(".yaml"))
  const workflows = await Promise.all(
    wfFiles.map(async (f) => loadYaml(await readFile(path.join(wfDir, f), "utf8")))
  )
  const tools = await Promise.all(
    toolFiles.map(async (f) => loadYaml(await readFile(path.join(toolDir, f), "utf8")))
  )
  const pkg = JSON.parse(await readFile(path.join(LOCAL_REPO, "package.json"), "utf8"))
  return { workflows, tools, version: pkg.version }
}

function normalizeTools(raw) {
  return raw
    .map((t) => ({
      id: t.id,
      mcpName: t.names?.mcp ?? t.id,
      cliName: t.names?.cli ?? null,
      description: t.description ?? "",
      title: t.annotations?.title ?? null,
      readOnly: Boolean(t.annotations?.readOnlyHint),
      destructive: Boolean(t.annotations?.destructiveHint),
      openWorld: Boolean(t.annotations?.openWorldHint),
      module: t.module ?? null,
      predicates: Array.isArray(t.predicates) ? t.predicates : [],
    }))
    .sort((a, b) => a.mcpName.localeCompare(b.mcpName))
}

const WORKFLOW_TARGET_PLATFORMS = new Set(["iOS", "macOS", "tvOS", "watchOS", "visionOS"])

function normalizeTargetPlatforms(value) {
  if (!Array.isArray(value)) return []
  return value.filter((p) => typeof p === "string" && WORKFLOW_TARGET_PLATFORMS.has(p))
}

function normalizeWorkflows(raw) {
  return raw
    .map((w) => ({
      id: w.id,
      title: w.title ?? w.id,
      description: w.description ?? "",
      defaultEnabled: Boolean(w.selection?.mcp?.defaultEnabled),
      targetPlatforms: normalizeTargetPlatforms(w.targetPlatforms),
      tools: Array.isArray(w.tools) ? w.tools : [],
    }))
    .sort((a, b) => a.id.localeCompare(b.id))
}

async function main() {
  let source, ref, data
  try {
    if (LOCAL_FALLBACK) throw new Error("forced local")
    ref = await resolveRef()
    data = await fetchManifestsRemote(ref)
    source = `github:${REPO}@${ref}`
  } catch (err) {
    if (!existsSync(LOCAL_REPO)) {
      console.error("Remote fetch failed and no local fallback available:", err.message)
      process.exitCode = 1
      return
    }
    console.warn(`Remote fetch failed (${err.message}); using local fallback at ${LOCAL_REPO}`)
    data = await fetchManifestsLocal()
    source = `local:${LOCAL_REPO}`
    ref = `v${data.version}`
  }

  const snapshot = {
    source,
    ref,
    syncedAt: new Date().toISOString(),
    version: data.version,
    workflows: normalizeWorkflows(data.workflows),
    tools: normalizeTools(data.tools),
  }

  await mkdir(outDir, { recursive: true })
  await writeFile(outFile, JSON.stringify(snapshot, null, 2) + "\n", "utf8")

  console.log(
    `Wrote ${outFile}\n  source: ${source}\n  version: ${snapshot.version}\n  workflows: ${snapshot.workflows.length}\n  tools: ${snapshot.tools.length}`
  )
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
