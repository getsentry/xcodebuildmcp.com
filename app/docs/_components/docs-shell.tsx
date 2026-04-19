"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Icons } from "./icons"
import { PageActions } from "./page-actions"
import { PageToc } from "./page-toc"
import { useManifest } from "./manifest-provider"
import {
  PAGE_META,
  SIDEBAR_GROUPS,
  isDocSlug,
  type DocSlug,
} from "../_data/routes"

type Theme = "light" | "dark"

const TOPBAR_LINKS: { slug: DocSlug; label: string; external?: string }[] = [
  { slug: "introduction", label: "Docs" },
  { slug: "tools", label: "Tools" },
  { slug: "changelog", label: "Changelog" },
]

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light"
  const attr = document.documentElement.getAttribute("data-docs-theme")
  return attr === "dark" ? "dark" : "light"
}

function readInitialSidebar(): boolean {
  if (typeof document === "undefined") return true
  const attr = document.documentElement.getAttribute("data-docs-sidebar")
  return attr !== "off"
}

export interface DocsShellProps {
  activeSlug: DocSlug
  children: ReactNode
}

export function DocsShell({ activeSlug, children }: DocsShellProps) {
  const manifest = useManifest()
  const router = useRouter()
  const pathname = usePathname()
  const [theme, setTheme] = useState<Theme>(() => readInitialTheme())
  const [sidebarOn, setSidebarOn] = useState<boolean>(() => readInitialSidebar())
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute("data-docs-theme", theme)
    try {
      localStorage.setItem("xcbmcp-docs-theme", theme)
    } catch {
      // ignore persistence failures
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-docs-sidebar",
      sidebarOn ? "on" : "off"
    )
    try {
      localStorage.setItem("xcbmcp-docs-sidebar", String(sidebarOn))
    } catch {
      // ignore persistence failures
    }
  }, [sidebarOn])

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0)
    setMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    document.body.style.overflow = "hidden"
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false)
    }
    document.addEventListener("keydown", onEsc)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onEsc)
    }
  }, [mobileNavOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const isActive = (slug: DocSlug) => slug === activeSlug
  const isTopbarActive = (slug: DocSlug) => activeSlug === slug

  return (
    <div
      className={
        "docs-root" +
        (sidebarOn ? "" : " no-sidebar") +
        (mobileNavOpen ? " mobile-nav-open" : "")
      }
    >
      <div className="topbar">
        <button
          className="tb-burger ic-btn"
          type="button"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((v) => !v)}
        >
          {mobileNavOpen ? <Icons.X size={18} /> : <Icons.List size={18} />}
        </button>
        <Link className="brand" href="/docs" onClick={() => setMobileNavOpen(false)}>
          <span className="brand-logo" aria-hidden>
            <Image src="/logo.png" alt="" width={28} height={28} priority />
          </span>
          <div className="brand-title">
            XcodeBuildMCP
            <span className="brand-chip">docs</span>
          </div>
        </Link>
        <div className="tb-divider" />
        <nav>
          <Link href="/" className="tb-home">
            ← xcodebuildmcp.com
          </Link>
          {TOPBAR_LINKS.map((item) => (
            <Link
              key={item.slug}
              href={`/docs/${item.slug === "introduction" ? "" : item.slug}`}
              className={isTopbarActive(item.slug) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/getsentry/XcodeBuildMCP"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </nav>
        <div className="grow" />
        <PageActions activeSlug={activeSlug} />
        <div className="search">
          <span className="si">
            <Icons.Search size={14} />
          </span>
          <input
            ref={searchInputRef}
            placeholder="Search docs, tools, env vars…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const q = (e.target as HTMLInputElement).value.trim().toLowerCase()
                if (!q) return
                if (isDocSlug(q)) {
                  router.push(q === "introduction" ? "/docs" : `/docs/${q}`)
                } else {
                  router.push(`/docs/tools?q=${encodeURIComponent(q)}`)
                }
              }
            }}
          />
          <kbd>⌘ K</kbd>
        </div>
        <button
          className="ic-btn"
          aria-label="Toggle theme"
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Icons.Moon size={14} /> : <Icons.Sun size={14} />}
        </button>
        <button
          className="ic-btn"
          aria-label="Toggle sidebar"
          type="button"
          onClick={() => setSidebarOn((v) => !v)}
        >
          <Icons.SidebarIc size={14} />
        </button>
        <Link className="cta-install" href="/docs/installation">
          <Icons.Download size={14} /> Install
        </Link>
      </div>

      <div className="docs-body">
        <div
          className="sidebar-backdrop"
          aria-hidden
          onClick={() => setMobileNavOpen(false)}
        />
        <aside
          className="sidebar"
          onClick={(e) => {
            const a = (e.target as HTMLElement).closest("a")
            if (a) setMobileNavOpen(false)
          }}
        >
          <div className="sb-search">
            <span className="si">
              <Icons.Search size={14} />
            </span>
            <input
              placeholder="Search docs, tools, env vars…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value.trim().toLowerCase()
                  if (!q) return
                  setMobileNavOpen(false)
                  if (isDocSlug(q)) {
                    router.push(q === "introduction" ? "/docs" : `/docs/${q}`)
                  } else {
                    router.push(`/docs/tools?q=${encodeURIComponent(q)}`)
                  }
                }
              }}
            />
          </div>
          {SIDEBAR_GROUPS.map((group) => {
            const GroupIcon = Icons[group.icon]
            return (
              <div key={group.label}>
                <div className="sb-group-label">{group.label}</div>
                {group.items.map((item, idx) => {
                  const route = PAGE_META[item.slug]
                  const childIsActive = !!item.children?.some((c) => c === activeSlug)
                  return (
                    <div key={item.slug}>
                      <Link
                        className={
                          "sb-item" +
                          (isActive(item.slug) || childIsActive ? " active" : "")
                        }
                        href={`/docs/${item.slug === "introduction" ? "" : item.slug}`}
                      >
                        <span className="sb-icon">
                          {idx === 0 ? (
                            <GroupIcon size={14} />
                          ) : (
                            <span style={{ width: 14, display: "inline-block" }} />
                          )}
                        </span>
                        {route.title}
                      </Link>
                      {item.children && (isActive(item.slug) || childIsActive) ? (
                        <div className="sb-sub">
                          {item.children.map((childSlug) => {
                            const child = PAGE_META[childSlug]
                            return (
                              <Link
                                key={childSlug}
                                className={
                                  "sb-item sb-sub-item" +
                                  (isActive(childSlug) ? " active" : "")
                                }
                                href={`/docs/${childSlug}`}
                              >
                                <span className="sb-icon">
                                  <span style={{ width: 14, display: "inline-block" }} />
                                </span>
                                {child.title}
                              </Link>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )
          })}
          <div className="sb-version">
            <div className="sb-version-title">v{manifest.version}</div>
            <div className="sb-version-sub">
              Live from <code style={{ fontSize: 10 }}>{manifest.ref}</code>
            </div>
          </div>
        </aside>

        <main className="content">
          <div className="page">
            <div className="prose">{children}</div>
          </div>
        </main>
        <PageToc />
      </div>
    </div>
  )
}
