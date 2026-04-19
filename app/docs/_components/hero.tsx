"use client"

import Link from "next/link"
import { useState } from "react"
import { Icons } from "./icons"
import { useManifest } from "./manifest-provider"

const HERO_CMD = "brew install getsentry/xcodebuildmcp/xcodebuildmcp"

export function Hero() {
  const manifest = useManifest()
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(HERO_CMD).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    })
  }
  return (
    <div className="hero">
      <div className="eyebrow">
        <span className="dot" />
        Shipping v{manifest.version} · {manifest.tools.length} tools · Requires Xcode 16+
      </div>
      <h1>
        Xcode, the way your <em>agent</em> wants to use it.
      </h1>
      <p className="lede">
        An MCP server and CLI that gives AI agents full control over Xcode. Build, test, debug, and deploy your iOS and macOS apps without leaving your agent.
      </p>
      <div className="btn-row">
        <Link className="cta-install" href="/docs/quickstart">
          Get started <Icons.Chev size={14} />
        </Link>
        <a
          className="btn-secondary"
          href="https://github.com/getsentry/XcodeBuildMCP"
          target="_blank"
          rel="noreferrer"
        >
          <Icons.Github size={14} /> Star on GitHub
        </a>
      </div>
      <div className="hero-install">
        <span className="prompt">$</span>
        <span className="cmd">{HERO_CMD}</span>
        <button className="cb" type="button" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  )
}
