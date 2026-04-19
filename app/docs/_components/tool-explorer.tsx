"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Icons } from "./icons"
import { primaryWorkflowFor, type ToolEntry } from "../_data/manifests"
import { useManifest } from "./manifest-provider"

const WORKFLOW_ORDER = [
  "all",
  "simulator",
  "device",
  "macos",
  "debugging",
  "ui-automation",
  "swift-package",
  "coverage",
  "project-discovery",
  "project-scaffolding",
  "session-management",
  "simulator-management",
  "logging",
  "xcode-ide",
  "doctor",
  "utilities",
  "workflow-discovery",
]

export function ToolExplorer() {
  const manifest = useManifest()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get("q") ?? "")
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const next = searchParams.get("q")
    if (next !== null && next !== q) setQ(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const groupByMcp = useMemo(() => {
    const map = new Map<string, string>()
    for (const tool of manifest.tools) {
      const wf = primaryWorkflowFor(manifest, tool)
      map.set(tool.mcpName, wf?.id ?? "other")
    }
    return map
  }, [manifest])

  const visibleGroups = useMemo(
    () =>
      WORKFLOW_ORDER.filter(
        (id) =>
          id === "all" ||
          manifest.workflows.some((w) => w.id === id && w.tools.length > 0)
      ),
    [manifest]
  )

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return manifest.tools.filter((t) => {
      if (filter !== "all") {
        const owning = manifest.workflows.find(
          (w) => w.id === filter && w.tools.includes(t.mcpName)
        )
        if (!owning) return false
      }
      if (!query) return true
      return (
        t.mcpName.toLowerCase().includes(query) ||
        (t.cliName ?? "").toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        (t.title ?? "").toLowerCase().includes(query)
      )
    })
  }, [q, filter, manifest])

  const primaryGroups = visibleGroups.slice(0, 6)
  const secondaryGroups = visibleGroups.slice(6)

  return (
    <>
      <div className="tools-controls">
        <div className="search-wrap">
          <div className="si">
            <Icons.Search size={14} />
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Filter ${manifest.tools.length} tools…`}
          />
        </div>
        <div className="seg">
          {primaryGroups.map((g) => (
            <button
              key={g}
              className={filter === g ? "active" : ""}
              type="button"
              onClick={() => setFilter(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="seg" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        {secondaryGroups.map((g) => (
          <button
            key={g}
            className={filter === g ? "active" : ""}
            type="button"
            onClick={() => setFilter(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="tool-grid">
        {filtered.map((t) => (
          <ToolCard key={t.mcpName} tool={t} group={groupByMcp.get(t.mcpName) ?? "other"} />
        ))}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "24px 14px",
              color: "var(--fg-muted)",
              textAlign: "center",
              border: "1px dashed var(--border-primary)",
              borderRadius: 6,
            }}
          >
            No tools match the current filter.
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: "var(--fg-muted)" }}>
        Live from <code>{manifest.source}</code>, refreshed{" "}
        {new Date(manifest.syncedAt).toISOString().replace("T", " ").slice(0, 16)} UTC ·{" "}
        {manifest.tools.length} tools · {manifest.workflows.length} workflows
      </div>
    </>
  )
}

function ToolCard({ tool, group }: { tool: ToolEntry; group: string }) {
  const badge = tool.readOnly ? "read-only" : tool.destructive ? "destructive" : null
  return (
    <div className="tool-card">
      <div>
        <div className="tc-name">{tool.mcpName}</div>
        {tool.cliName ? (
          <div style={{ fontSize: 10, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
            cli: {tool.cliName}
          </div>
        ) : null}
      </div>
      <div className="tc-desc">{tool.description || tool.title || "—"}</div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {badge ? <span className={`tc-badge ${badge === "read-only" ? "" : "beta"}`}>{badge}</span> : null}
        <span className="tc-badge">{group}</span>
      </div>
    </div>
  )
}
