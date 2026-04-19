"use client"

import { useEffect, useRef, useState } from "react"
import { Icons } from "./icons"
import type { DocSlug } from "../_data/routes"

const SITE_ORIGIN = "https://xcodebuildmcp.com"

function pagePath(slug: DocSlug): string {
  return slug === "introduction" ? "/docs" : `/docs/${slug}`
}

function pageUrl(slug: DocSlug, origin: string): string {
  return `${origin}${pagePath(slug)}`
}

function rawUrl(slug: DocSlug, origin: string): string {
  return `${origin}/docs/raw/${slug === "introduction" ? "introduction" : slug}`
}

export function PageActions({ activeSlug }: { activeSlug: DocSlug }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const pillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onEsc)
    }
  }, [open])

  const copyPageMarkdown = async () => {
    if (typeof window === "undefined") return
    try {
      const res = await fetch(rawUrl(activeSlug, window.location.origin))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const md = await res.text()
      await navigator.clipboard.writeText(md)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.warn("Copy page failed", e)
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : SITE_ORIGIN
  const fullUrl = pageUrl(activeSlug, origin)
  const llmPrompt = `Read from ${fullUrl} so I can ask questions about its contents`

  return (
    <div className="pa-pill" ref={pillRef}>
      <button
        type="button"
        className="pa-btn pa-btn-primary"
        onClick={copyPageMarkdown}
        aria-label="Copy page as Markdown"
      >
        {copied ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
        <span>{copied ? "Copied" : "Copy page"}</span>
      </button>
      <div className="pa-divider" />
      <button
        type="button"
        className="pa-btn pa-btn-menu"
        onClick={() => setOpen((v) => !v)}
        aria-label="More page actions"
        aria-expanded={open}
      >
        <Icons.ChevDown size={14} />
      </button>

      {open ? (
        <div className="pa-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className="pa-item"
            onClick={() => {
              setOpen(false)
              void copyPageMarkdown()
            }}
          >
            <div className="pa-item-icon"><Icons.Copy size={14} /></div>
            <div className="pa-item-body">
              <div className="pa-item-title">Copy page</div>
              <div className="pa-item-desc">Copy page as Markdown for LLMs</div>
            </div>
          </button>
          <a
            role="menuitem"
            className="pa-item"
            href={rawUrl(activeSlug, "")}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            <div className="pa-item-icon"><Icons.FileText size={14} /></div>
            <div className="pa-item-body">
              <div className="pa-item-title">View as Markdown</div>
              <div className="pa-item-desc">View this page as plain text</div>
            </div>
          </a>
          <a
            role="menuitem"
            className="pa-item"
            href={`https://chatgpt.com/?hint=search&q=${encodeURIComponent(llmPrompt)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            <div className="pa-item-icon"><Icons.Ext size={14} /></div>
            <div className="pa-item-body">
              <div className="pa-item-title">
                Open in ChatGPT <Icons.Ext size={11} />
              </div>
              <div className="pa-item-desc">Ask ChatGPT questions about this page</div>
            </div>
          </a>
          <a
            role="menuitem"
            className="pa-item"
            href={`https://claude.ai/new?q=${encodeURIComponent(llmPrompt)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            <div className="pa-item-icon"><Icons.Ext size={14} /></div>
            <div className="pa-item-body">
              <div className="pa-item-title">
                Open in Claude <Icons.Ext size={11} />
              </div>
              <div className="pa-item-desc">Ask Claude questions about this page</div>
            </div>
          </a>
        </div>
      ) : null}
    </div>
  )
}
