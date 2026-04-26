import snapshot from "./generated/manifests.json"

export interface ToolEntry {
  id: string
  mcpName: string
  cliName: string | null
  description: string
  title: string | null
  readOnly: boolean
  destructive: boolean
  openWorld: boolean
  module: string | null
  predicates: string[]
}

export const WORKFLOW_TARGET_PLATFORMS = [
  "iOS",
  "macOS",
  "tvOS",
  "watchOS",
  "visionOS",
] as const

export type WorkflowTargetPlatform = (typeof WORKFLOW_TARGET_PLATFORMS)[number]

export interface WorkflowEntry {
  id: string
  title: string
  description: string
  defaultEnabled: boolean
  targetPlatforms: WorkflowTargetPlatform[]
  tools: string[]
}

export interface ManifestSnapshot {
  source: string
  ref: string
  syncedAt: string
  version: string
  workflows: WorkflowEntry[]
  tools: ToolEntry[]
}

function normalizeBundledWorkflow(w: Record<string, unknown>): WorkflowEntry {
  const platforms = Array.isArray(w.targetPlatforms)
    ? (w.targetPlatforms as unknown[]).filter(
        (p): p is WorkflowTargetPlatform =>
          typeof p === "string" &&
          (WORKFLOW_TARGET_PLATFORMS as readonly string[]).includes(p)
      )
    : []
  return {
    id: String(w.id ?? ""),
    title: typeof w.title === "string" ? w.title : String(w.id ?? ""),
    description: typeof w.description === "string" ? w.description : "",
    defaultEnabled: Boolean(w.defaultEnabled),
    targetPlatforms: platforms,
    tools: Array.isArray(w.tools) ? (w.tools as string[]) : [],
  }
}

/**
 * Bundled snapshot from `pnpm run docs:sync`. Used as a fallback when the
 * GitHub API is unreachable or rate-limited at request time.
 *
 * Snapshots produced before workflows gained `targetPlatforms` are tolerated
 * by defaulting the field to an empty array.
 */
export const BUNDLED_MANIFEST: ManifestSnapshot = (() => {
  const raw = snapshot as Omit<ManifestSnapshot, "workflows"> & {
    workflows: Array<Record<string, unknown>>
  }
  return {
    ...raw,
    workflows: raw.workflows.map(normalizeBundledWorkflow),
  } as ManifestSnapshot
})()

/**
 * Default export for legacy imports that haven't migrated to the provider
 * yet. Prefer `useManifest()` in client components and `fetchLiveManifest()`
 * on the server.
 */
export const MANIFEST: ManifestSnapshot = BUNDLED_MANIFEST

export function toolsByWorkflow(
  manifest: ManifestSnapshot,
  workflowId: string
): ToolEntry[] {
  const wf = manifest.workflows.find((w) => w.id === workflowId)
  if (!wf) return []
  const byMcp = new Map(manifest.tools.map((t) => [t.mcpName, t]))
  return wf.tools.map((name) => byMcp.get(name)).filter(Boolean) as ToolEntry[]
}

export function primaryWorkflowFor(
  manifest: ManifestSnapshot,
  tool: ToolEntry
): WorkflowEntry | null {
  const owning = manifest.workflows.filter((w) => w.tools.includes(tool.mcpName))
  const specialized = owning.find(
    (w) =>
      w.id !== "simulator" &&
      w.id !== "session-management" &&
      w.id !== "project-discovery" &&
      w.id !== "utilities"
  )
  return specialized ?? owning[0] ?? null
}
