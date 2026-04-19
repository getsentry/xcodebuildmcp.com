import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { DocsThemeScript } from "./_components/theme-script"
import { ManifestProvider } from "./_components/manifest-provider"
import { fetchLiveManifest } from "./_data/fetch-manifest"
import "./_styles/scraps.css"

export const metadata: Metadata = {
  title: {
    default: "XcodeBuildMCP Docs",
    template: "%s · XcodeBuildMCP Docs",
  },
  description:
    "Documentation for XcodeBuildMCP: a Model Context Protocol server and CLI that gives AI agents safe, predictable tools for iOS and macOS development.",
  openGraph: {
    title: "XcodeBuildMCP Docs",
    description:
      "Documentation for XcodeBuildMCP: a Model Context Protocol server and CLI for AI-driven iOS and macOS development.",
    type: "website",
    url: "https://xcodebuildmcp.com/docs",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0b17" },
  ],
}

// Revalidate the whole docs subtree hourly so generated pages pick up new
// tool/workflow data automatically. Keep this in sync with the `next.revalidate`
// passed to `fetch()` in app/docs/_data/fetch-manifest.ts (MANIFEST_REVALIDATE_SECONDS).
export const revalidate = 3600

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const manifest = await fetchLiveManifest()
  return (
    <>
      <DocsThemeScript />
      <ManifestProvider manifest={manifest}>{children}</ManifestProvider>
    </>
  )
}
