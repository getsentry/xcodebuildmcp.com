"use client"

import { createContext, useContext, type ReactNode } from "react"
import {
  BUNDLED_MANIFEST,
  primaryWorkflowFor,
  type ManifestSnapshot,
  type ToolEntry,
  type WorkflowEntry,
} from "../_data/manifests"

const ManifestContext = createContext<ManifestSnapshot>(BUNDLED_MANIFEST)

export function ManifestProvider({
  manifest,
  children,
}: {
  manifest: ManifestSnapshot
  children: ReactNode
}) {
  return <ManifestContext.Provider value={manifest}>{children}</ManifestContext.Provider>
}

export function useManifest(): ManifestSnapshot {
  return useContext(ManifestContext)
}

export function usePrimaryWorkflow(tool: ToolEntry): WorkflowEntry | null {
  const manifest = useManifest()
  return primaryWorkflowFor(manifest, tool)
}
