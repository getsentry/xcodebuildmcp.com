import "server-only"
import { load as loadYaml } from "js-yaml"
import {
  BUNDLED_MANIFEST,
  WORKFLOW_TARGET_PLATFORMS,
  type ManifestSnapshot,
  type ToolEntry,
  type WorkflowEntry,
  type WorkflowTargetPlatform,
} from "./manifests"

const REPO = "getsentry/XcodeBuildMCP"
const GH_API = "https://api.github.com"
const RAW = "https://raw.githubusercontent.com"

/**
 * Time (in seconds) to cache the live fetch before refetching. Page-level
 * `revalidate` in app/docs/layout.tsx should match or be a multiple of this.
 */
export const MANIFEST_REVALIDATE_SECONDS = 60 * 60 // 1 hour

function ghHeaders(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "xcodebuildmcp-docs",
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

async function ghJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: ghHeaders(),
    next: { revalidate: MANIFEST_REVALIDATE_SECONDS, tags: ["xcodebuildmcp-manifest"] },
  })
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

async function ghText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: ghHeaders(),
    next: { revalidate: MANIFEST_REVALIDATE_SECONDS, tags: ["xcodebuildmcp-manifest"] },
  })
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`)
  return res.text()
}

interface GhContentEntry {
  type: string
  name: string
}

async function resolveRef(): Promise<string> {
  try {
    const latest = await ghJson<{ tag_name: string }>(
      `${GH_API}/repos/${REPO}/releases/latest`
    )
    return latest.tag_name
  } catch {
    const tags = await ghJson<Array<{ name: string }>>(
      `${GH_API}/repos/${REPO}/tags?per_page=1`
    )
    return tags[0]?.name ?? "main"
  }
}

async function listManifestFiles(ref: string, dir: string): Promise<GhContentEntry[]> {
  const items = await ghJson<GhContentEntry[]>(
    `${GH_API}/repos/${REPO}/contents/${dir}?ref=${encodeURIComponent(ref)}`
  )
  return items.filter((i) => i.type === "file" && i.name.endsWith(".yaml"))
}

function normalizeTools(raw: Array<Record<string, unknown>>): ToolEntry[] {
  return raw
    .map((t) => {
      const names = (t.names as { mcp?: string; cli?: string } | undefined) ?? {}
      const annotations =
        (t.annotations as
          | { title?: string; readOnlyHint?: boolean; destructiveHint?: boolean; openWorldHint?: boolean }
          | undefined) ?? {}
      return {
        id: String(t.id ?? ""),
        mcpName: names.mcp ?? String(t.id ?? ""),
        cliName: names.cli ?? null,
        description: typeof t.description === "string" ? t.description : "",
        title: annotations.title ?? null,
        readOnly: Boolean(annotations.readOnlyHint),
        destructive: Boolean(annotations.destructiveHint),
        openWorld: Boolean(annotations.openWorldHint),
        module: (t.module as string | undefined) ?? null,
        predicates: Array.isArray(t.predicates) ? (t.predicates as string[]) : [],
      }
    })
    .sort((a, b) => a.mcpName.localeCompare(b.mcpName))
}

function normalizeTargetPlatforms(value: unknown): WorkflowTargetPlatform[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (p): p is WorkflowTargetPlatform =>
      typeof p === "string" && (WORKFLOW_TARGET_PLATFORMS as readonly string[]).includes(p)
  )
}

function normalizeWorkflows(raw: Array<Record<string, unknown>>): WorkflowEntry[] {
  return raw
    .map((w) => {
      const selection =
        (w.selection as { mcp?: { defaultEnabled?: boolean } } | undefined) ?? {}
      return {
        id: String(w.id ?? ""),
        title: (w.title as string | undefined) ?? String(w.id ?? ""),
        description: (w.description as string | undefined) ?? "",
        defaultEnabled: Boolean(selection.mcp?.defaultEnabled),
        targetPlatforms: normalizeTargetPlatforms(w.targetPlatforms),
        tools: Array.isArray(w.tools) ? (w.tools as string[]) : [],
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

async function fetchRemote(ref: string): Promise<ManifestSnapshot> {
  const [workflowFiles, toolFiles] = await Promise.all([
    listManifestFiles(ref, "manifests/workflows"),
    listManifestFiles(ref, "manifests/tools"),
  ])

  const [workflowsRaw, toolsRaw, pkgText] = await Promise.all([
    Promise.all(
      workflowFiles.map((f) =>
        ghText(`${RAW}/${REPO}/${encodeURIComponent(ref)}/manifests/workflows/${f.name}`).then(
          (y) => loadYaml(y) as Record<string, unknown>
        )
      )
    ),
    Promise.all(
      toolFiles.map((f) =>
        ghText(`${RAW}/${REPO}/${encodeURIComponent(ref)}/manifests/tools/${f.name}`).then(
          (y) => loadYaml(y) as Record<string, unknown>
        )
      )
    ),
    ghText(`${RAW}/${REPO}/${encodeURIComponent(ref)}/package.json`),
  ])

  const pkg = JSON.parse(pkgText) as { version: string }

  return {
    source: `github:${REPO}@${ref}`,
    ref,
    syncedAt: new Date().toISOString(),
    version: pkg.version,
    workflows: normalizeWorkflows(workflowsRaw),
    tools: normalizeTools(toolsRaw),
  }
}

/**
 * Fetch the XcodeBuildMCP manifest live from GitHub, normalized, cached at
 * the Next.js fetch layer for MANIFEST_REVALIDATE_SECONDS. Falls back to the
 * bundled snapshot on any error (network, rate limit, malformed YAML).
 *
 * Server-only. Call from server components and pass the result down to
 * client components via `<ManifestProvider>`.
 */
export async function fetchLiveManifest(): Promise<ManifestSnapshot> {
  try {
    const ref = await resolveRef()
    return await fetchRemote(ref)
  } catch (err) {
    // Swallow and fall back. A log line surfaces in server output for visibility.
    console.warn(
      `[xcodebuildmcp-docs] live manifest fetch failed (${(err as Error).message}); ` +
        `falling back to bundled snapshot from ${BUNDLED_MANIFEST.source} (${BUNDLED_MANIFEST.ref})`
    )
    return BUNDLED_MANIFEST
  }
}
