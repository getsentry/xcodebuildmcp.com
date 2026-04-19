import "server-only"

const REPO = "getsentry/XcodeBuildMCP"
const GH_API = "https://api.github.com"

export const RELEASES_REVALIDATE_SECONDS = 60 * 60 // 1 hour

export interface GhRelease {
  tagName: string
  name: string | null
  publishedAt: string
  htmlUrl: string
  body: string
  prerelease: boolean
  draft: boolean
}

function ghHeaders(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "xcodebuildmcp-docs",
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

interface RawRelease {
  tag_name: string
  name: string | null
  published_at: string
  html_url: string
  body: string | null
  prerelease: boolean
  draft: boolean
}

/**
 * Fetch up to `limit` published, non-draft GitHub releases for the
 * XcodeBuildMCP repo, newest first. Cached at the Next.js fetch layer.
 * Returns an empty array on any error so callers can gracefully fall back
 * to a bundled snapshot or a "view on GitHub" link.
 */
export async function fetchLiveReleases(limit = 10): Promise<GhRelease[]> {
  try {
    const res = await fetch(
      `${GH_API}/repos/${REPO}/releases?per_page=${Math.min(limit, 30)}`,
      {
        headers: ghHeaders(),
        next: { revalidate: RELEASES_REVALIDATE_SECONDS, tags: ["xcodebuildmcp-releases"] },
      }
    )
    if (!res.ok) throw new Error(`GET releases -> ${res.status} ${res.statusText}`)
    const raw = (await res.json()) as RawRelease[]
    return raw
      .filter((r) => !r.draft)
      .map((r) => ({
        tagName: r.tag_name,
        name: r.name,
        publishedAt: r.published_at,
        htmlUrl: r.html_url,
        body: r.body ?? "",
        prerelease: r.prerelease,
        draft: r.draft,
      }))
  } catch (err) {
    console.warn(
      `[xcodebuildmcp-docs] releases fetch failed (${(err as Error).message}); ` +
        `changelog page will render a fallback`
    )
    return []
  }
}
