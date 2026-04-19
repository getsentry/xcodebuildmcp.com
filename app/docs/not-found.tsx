import Link from "next/link"
import { DocsShell } from "./_components/docs-shell"
import { PageHeader } from "./_components/page-header"

export default function DocsNotFound() {
  return (
    <DocsShell activeSlug="introduction">
      <div className="prose">
        <PageHeader
          breadcrumbs={["Docs", "404"]}
          title="We lost the trail."
          lede="The page you were looking for doesn't exist, yet. Try the sidebar, or head back home."
        />
        <p>
          Start at the <Link href="/docs">Introduction</Link>, skim the{" "}
          <Link href="/docs/tools">Tools Reference</Link>, or open an{" "}
          <a
            href="https://github.com/getsentry/XcodeBuildMCP/issues"
            target="_blank"
            rel="noreferrer"
          >
            issue
          </a>{" "}
          if you think this page should exist.
        </p>
      </div>
    </DocsShell>
  )
}
