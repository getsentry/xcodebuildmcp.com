import { NextResponse } from "next/server"
import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"
import { isDocSlug } from "../../_data/routes"

/**
 * Returns the rendered docs page as clean Markdown, for LLM context
 * ("Open in ChatGPT/Claude") and "View as Markdown" consumption.
 *
 * Implementation: we fetch the server-rendered HTML for the docs page from
 * the same origin, extract the `.prose` content (dropping the sidebar,
 * topbar, pager, and page actions), and convert to Markdown with Turndown.
 * This gives us the actual rendered content including live values (version,
 * tool counts, workflow table, release notes) rather than the raw MDX
 * source with `import` statements and JSX placeholders.
 */
export const revalidate = 3600

interface Params {
  params: Promise<{ slug: string }>
}

function resolveOrigin(req: Request): string {
  const reqOrigin = new URL(req.url).origin
  if (reqOrigin && !reqOrigin.includes("localhost") && !reqOrigin.includes("127.0.0.1")) {
    return reqOrigin
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return reqOrigin || "http://localhost:3000"
}

function buildTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    strongDelimiter: "**",
    bulletListMarker: "-",
    hr: "---",
    linkStyle: "inlined",
  })
  td.use(gfm)

  // Strip heading anchors appended by rehype-autolink-headings.
  td.addRule("heading-anchor", {
    filter: (node) =>
      node.nodeName === "A" && (node as HTMLElement).classList?.contains("heading-anchor"),
    replacement: () => "",
  })

  // Pass the language hint from our CodeBlock's `.lang` span into the fenced block.
  td.addRule("codeblock", {
    filter: (node) =>
      node.nodeName === "DIV" && (node as HTMLElement).classList?.contains("codeblock"),
    replacement: (_content, node) => {
      const el = node as HTMLElement
      const lang = el.querySelector(".lang")?.textContent?.trim() ?? ""
      const code = el.querySelector("pre code")?.textContent ?? ""
      return "\n\n```" + lang + "\n" + code.replace(/\n+$/, "") + "\n```\n\n"
    },
  })

  // Drop any "Copy"/"Copied" button text left over inside code blocks.
  td.addRule("cb-copy", {
    filter: (node) => {
      const el = node as HTMLElement
      return (
        node.nodeName === "BUTTON" &&
        (el.classList?.contains("cb-copy") || el.classList?.contains("cb"))
      )
    },
    replacement: () => "",
  })

  // Page headers render through a custom component that includes breadcrumbs
  // and meta pills; convert to a simple `# Title\n\nLede` block.
  td.addRule("page-meta", {
    filter: (node) => {
      const el = node as HTMLElement
      return (
        el.classList?.contains("breadcrumbs") ||
        el.classList?.contains("page-meta") ||
        el.classList?.contains("tweaks-panel") ||
        el.classList?.contains("pager") ||
        el.classList?.contains("tabs")
      )
    },
    replacement: () => "",
  })

  // Callouts -> blockquote-ish. Preserve the title as bold on the first line.
  td.addRule("callout", {
    filter: (node) => {
      const el = node as HTMLElement
      return node.nodeName === "DIV" && el.classList?.contains("callout")
    },
    replacement: (_c, node) => {
      const el = node as HTMLElement
      const title = el.querySelector(".cl-title")?.textContent?.trim() ?? ""
      const body = el.querySelector(".cl-body")
      if (!body) return ""
      // Drop the title so it isn't re-emitted when we serialize the body.
      body.querySelector(".cl-title")?.remove()
      const innerMd = td.turndown(body.innerHTML ?? "").trim()
      const lines = innerMd.split("\n")
      const quoted = lines.map((ln) => (ln.length ? `> ${ln}` : ">"))
      const headerLine = title ? `> **${title}**` : null
      const out = [headerLine, headerLine ? ">" : null, ...quoted].filter(Boolean)
      return "\n\n" + out.join("\n") + "\n\n"
    },
  })

  // Feature/client/tool cards convert poorly; flatten them to "Title — desc"
  // bullets so the semantic content is preserved.
  td.addRule("feature-card", {
    filter: (node) => {
      const el = node as HTMLElement
      return (
        node.nodeName === "DIV" &&
        (el.classList?.contains("feature") ||
          el.classList?.contains("client-card") ||
          el.classList?.contains("tool-card"))
      )
    },
    replacement: (_c, node) => {
      const el = node as HTMLElement
      const title =
        el.querySelector(".f-title, .ch-name, .tc-name")?.textContent?.trim() ?? ""
      const desc =
        el.querySelector(".f-desc, .ch-sub, .tc-desc")?.textContent?.trim() ?? ""
      if (!title && !desc) return ""
      return `\n- **${title}**${desc ? ` — ${desc}` : ""}`
    },
  })

  // Stat row -> bullet list of "value — label"
  td.addRule("stat", {
    filter: (node) => {
      const el = node as HTMLElement
      return node.nodeName === "DIV" && el.classList?.contains("stat")
    },
    replacement: (_c, node) => {
      const el = node as HTMLElement
      const v = el.querySelector(".stat-v")?.textContent?.trim() ?? ""
      const l = el.querySelector(".stat-l")?.textContent?.trim() ?? ""
      if (!v && !l) return ""
      return `\n- **${v}** ${l}`
    },
  })

  // Hero install: show the command on its own line.
  td.addRule("hero-install", {
    filter: (node) => {
      const el = node as HTMLElement
      return node.nodeName === "DIV" && el.classList?.contains("hero-install")
    },
    replacement: (_c, node) => {
      const cmd = (node as HTMLElement).querySelector(".cmd")?.textContent?.trim() ?? ""
      return cmd ? "\n\n```shell\n" + cmd + "\n```\n\n" : ""
    },
  })

  return td
}

function extractProseHtml(html: string): string | null {
  // The docs shell wraps MDX in <div class="prose">...</div> inside the page.
  // We use a non-greedy match anchored at the opening wrapper and ended by
  // the content/main boundary that follows.
  const start = html.indexOf('<div class="prose">')
  if (start < 0) return null
  const after = html.slice(start)

  // Walk matching div tags to find the end.
  let depth = 0
  const re = /<(\/?)div\b[^>]*>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(after)) !== null) {
    if (m[1]) {
      depth--
      if (depth === 0) {
        return after.slice(0, m.index + m[0].length)
      }
    } else {
      depth++
    }
  }
  return null
}

export async function GET(req: Request, { params }: Params) {
  const { slug } = await params
  const target = slug === "introduction" ? "introduction" : slug
  if (!isDocSlug(target)) {
    return new NextResponse("Not found", { status: 404 })
  }

  const origin = resolveOrigin(req)
  const pagePath = target === "introduction" ? "/docs" : `/docs/${target}`
  const pageUrl = `${origin}${pagePath}`

  try {
    const res = await fetch(pageUrl, {
      headers: { "x-docs-raw": "1" },
      next: { revalidate: 3600, tags: ["xcodebuildmcp-docs-raw"] },
    })
    if (!res.ok) throw new Error(`GET ${pageUrl} -> ${res.status}`)
    const html = await res.text()

    const prose = extractProseHtml(html)
    if (!prose) throw new Error("Could not locate prose content")

    const td = buildTurndown()
    const markdown = td
      .turndown(prose)
      .replace(/\n{3,}/g, "\n\n")
      .trim()

    return new NextResponse(markdown + "\n", {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (err) {
    return new NextResponse(
      `# Markdown view unavailable\n\nCouldn't render ${pagePath} to Markdown: ${(err as Error).message}\n`,
      {
        status: 500,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      }
    )
  }
}
