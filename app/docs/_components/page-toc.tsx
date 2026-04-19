"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

function collectHeadings(): Heading[] {
  if (typeof document === "undefined") return []
  const prose = document.querySelector(".prose")
  if (!prose) return []
  const items: Heading[] = []
  prose.querySelectorAll("h2[id], h3[id]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    const anchor = node.querySelector(".heading-anchor")
    const text = (anchor
      ? node.textContent?.replace(anchor.textContent ?? "", "")
      : node.textContent
    )
      ?.trim()
      .replace(/#$/, "")
      .trim()
    if (!node.id || !text) return
    items.push({ id: node.id, text, level: node.tagName === "H2" ? 2 : 3 })
  })
  return items
}

export function PageToc() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    setHeadings(collectHeadings())
    // Re-scan after client-rendered content settles (ToolExplorer, Tabs, etc.).
    const t = window.setTimeout(() => setHeadings(collectHeadings()), 150)
    return () => window.clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    if (headings.length === 0) return
    const content = document.querySelector(".content") as HTMLElement | null
    if (!content) return

    const visible = new Set<string>()
    const ids = headings.map((h) => h.id)
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        if (visible.size > 0) {
          // Pick the first heading in document order that's currently visible.
          const first = ids.find((id) => visible.has(id))
          if (first) setActiveId(first)
          return
        }
        // No heading in the top band: fall back to the last heading scrolled past.
        const scrollTop = content.scrollTop
        let current: string | null = null
        for (const h of headings) {
          const el = document.getElementById(h.id)
          if (!el) continue
          const top = el.offsetTop - content.offsetTop
          if (top - 90 <= scrollTop) current = h.id
          else break
        }
        if (current) setActiveId(current)
      },
      {
        root: content,
        rootMargin: "-84px 0px -70% 0px",
        threshold: 0,
      }
    )
    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    history.replaceState(null, "", `#${id}`)
    setActiveId(id)
  }

  return (
    <aside className="page-toc" aria-label="On this page">
      <div className="toc-title">On this page</div>
      <ul className="toc-list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={
              "toc-entry toc-h" + h.level + (activeId === h.id ? " active" : "")
            }
          >
            <a href={"#" + h.id} onClick={(e) => go(e, h.id)}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
