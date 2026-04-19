import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { fetchLiveReleases, type GhRelease } from "../_data/fetch-releases"

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

export async function LiveChangelog({ limit = 10 }: { limit?: number }) {
  const releases = await fetchLiveReleases(limit)

  if (releases.length === 0) {
    return <ChangelogFallback />
  }

  return (
    <>
      {releases.map((r, i) => (
        <ReleaseEntry key={r.tagName} release={r} isLatest={i === 0} />
      ))}
      <div className="release-entry">
        <a
          href={`https://github.com/getsentry/XcodeBuildMCP/releases`}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 13 }}
        >
          See every release on GitHub →
        </a>
      </div>
    </>
  )
}

function ReleaseEntry({ release, isLatest }: { release: GhRelease; isLatest: boolean }) {
  const heading = release.name ?? release.tagName
  return (
    <div className="release-entry">
      <div className="r-head">
        <h3 id={release.tagName.toLowerCase()}>{heading}</h3>
        <div className="r-date">{formatDate(release.publishedAt)}</div>
        {release.prerelease ? (
          <span className="tc-badge beta" style={{ marginLeft: 4 }}>
            pre-release
          </span>
        ) : null}
        {isLatest ? (
          <span className="tc-badge new" style={{ marginLeft: 4 }}>
            latest
          </span>
        ) : null}
        <a
          href={release.htmlUrl}
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-muted)" }}
        >
          View on GitHub ↗
        </a>
      </div>
      <ReleaseBody body={release.body} />
    </div>
  )
}

function ReleaseBody({ body }: { body: string }): ReactNode {
  const cleaned = body.trim()
  if (!cleaned) {
    return <p style={{ color: "var(--fg-muted)", fontSize: 13 }}>No release notes provided.</p>
  }
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h4 style={{ marginTop: 18 }}>{children}</h4>,
        h2: ({ children }) => <h4 style={{ marginTop: 18 }}>{children}</h4>,
        h3: ({ children }) => <h5 style={{ marginTop: 14 }}>{children}</h5>,
        h4: ({ children }) => <h5 style={{ marginTop: 14 }}>{children}</h5>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {cleaned}
    </ReactMarkdown>
  )
}

function ChangelogFallback() {
  return (
    <>
      <div className="callout info">
        <div className="cl-body">
          <div className="cl-title">GitHub releases couldn&apos;t be reached</div>
          <div>
            The live changelog feed couldn&apos;t be loaded right now. See every release at{" "}
            <a
              href="https://github.com/getsentry/XcodeBuildMCP/releases"
              target="_blank"
              rel="noreferrer"
            >
              github.com/getsentry/XcodeBuildMCP/releases
            </a>
            .
          </div>
        </div>
      </div>
    </>
  )
}
