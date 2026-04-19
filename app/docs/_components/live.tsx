"use client"

import { useManifest } from "./manifest-provider"

/**
 * Inline bits of the live manifest for use inside MDX prose. Each component
 * reads from the same ManifestProvider context as the sidebar, hero, and tool
 * explorer, so edits to the upstream repo show up here within one
 * revalidation tick without a redeploy.
 *
 * Registered globally via mdx-components.tsx, no imports needed in MDX files.
 */

export function LiveToolCount() {
  return <>{useManifest().tools.length}</>
}

export function LiveWorkflowCount() {
  return <>{useManifest().workflows.length}</>
}

export function LiveVersion() {
  return <>{useManifest().version}</>
}

export function LiveRef() {
  return <>{useManifest().ref}</>
}

export function LiveWorkflowToolCount({ workflow }: { workflow: string }) {
  const wf = useManifest().workflows.find((w) => w.id === workflow)
  return <>{wf ? wf.tools.length : 0}</>
}

export function LiveWorkflowsTable() {
  const manifest = useManifest()
  return (
    <table className="docs-table">
      <thead>
        <tr>
          <th>Workflow</th>
          <th style={{ textAlign: "right" }}>Tools</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {manifest.workflows.map((w) => (
          <tr key={w.id}>
            <td className="mono">
              {w.id}
              {w.defaultEnabled ? (
                <span className="tc-badge new" style={{ marginLeft: 6 }}>
                  default
                </span>
              ) : null}
            </td>
            <td style={{ textAlign: "right" }}>{w.tools.length}</td>
            <td>{w.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
