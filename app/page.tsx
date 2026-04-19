"use client"

import {
  Github,
  Star,
  GitFork,
  Download,
  Terminal,
  Zap,
  Shield,
  Users,
  Code,
  BookOpen,
  Copy,
  CheckCircle,
  Menu,
  X,
  MonitorSmartphone,
  Bug,
  Layers,
  ArrowRight,
  Smartphone,
  Cpu,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

interface GitHubStats {
  stars: number
  forks: number
}

export default function XcodeBuildMCPLanding() {
  const [githubStats, setGithubStats] = useState<GitHubStats>({ stars: 1900, forks: 77 })
  const [npmVersion, setNpmVersion] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [activeInstallTab, setActiveInstallTab] = useState<"npx" | "homebrew">("npx")
  const [lightboxVideo, setLightboxVideo] = useState<string | null>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxVideo(null)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  useEffect(() => {
    async function fetchStats() {
      try {
        const githubResponse = await fetch("/api/github-stats")
        if (githubResponse.ok) {
          const stats = await githubResponse.json()
          setGithubStats(stats)
        }
        const npmResponse = await fetch("/api/npm-version")
        if (npmResponse.ok) {
          const version = await npmResponse.json()
          setNpmVersion(version.version)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    fetchStats()
  }, [])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const npxConfig = `{
  "mcpServers": {
    "XcodeBuildMCP": {
      "command": "npx",
      "args": ["-y", "xcodebuildmcp@latest", "mcp"]
    }
  }
}`

  const homebrewConfig = `{
  "mcpServers": {
    "XcodeBuildMCP": {
      "command": "xcodebuildmcp",
      "args": ["mcp"]
    }
  }
}`

  const npmGlobalInstall = "npm install -g xcodebuildmcp@latest"

  return (
    <div className="min-h-screen bg-sentry-dark-100 text-sentry-text-primary">
      {/* Header */}
      <header className="border-b border-sentry-dark-600/50 bg-sentry-dark-100/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="#" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="XcodeBuildMCP" width={28} height={28} className="w-7 h-7" />
              <span className="text-lg font-semibold tracking-tight">XcodeBuildMCP</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {["Features", "See it in Action", "Xcode Integration"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-sentry-text-secondary hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
              <Link
                href="/docs"
                className="text-sm text-sentry-text-secondary hover:text-white transition-colors"
              >
                Docs
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/getsentry/XcodeBuildMCP"
                className="hidden sm:flex items-center gap-2 text-sm text-sentry-text-secondary hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>{githubStats.stars.toLocaleString()}</span>
              </Link>
              <a
                href="#get-started"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-sentry-purple hover:bg-sentry-purple-deep text-white transition-colors"
              >
                Get Started
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-sentry-text-secondary hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden pb-6 border-t border-sentry-dark-600/50 pt-4">
              <nav className="flex flex-col gap-4">
                {["Features", "See it in Action", "Xcode Integration"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sentry-text-secondary hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <Link
                  href="/docs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sentry-text-secondary hover:text-white transition-colors"
                >
                  Docs
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-sentry-purple/10 blur-[120px] animate-glow-pulse" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-sentry-pink/5 blur-[100px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-sentry-dark-600 bg-sentry-dark-400/50 text-sm text-sentry-text-secondary">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {npmVersion ? `${npmVersion.startsWith("v") ? npmVersion : `v${npmVersion}`} ` : ""}available now
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            AI-powered
            <br />
            <span className="bg-gradient-to-r from-sentry-purple via-sentry-purple-light to-sentry-pink bg-clip-text text-transparent">
              Xcode automation
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-sentry-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            An MCP server and CLI that gives AI agents full control over Xcode. Build, test, debug,
            and deploy your iOS and macOS apps without leaving your agent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sentry-purple hover:bg-sentry-purple-deep text-white font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Get Started
            </a>
            <Link
              href="https://github.com/getsentry/XcodeBuildMCP"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-sentry-dark-600 hover:border-sentry-dark-700 text-sentry-text-primary hover:bg-sentry-dark-400/50 transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <span className="text-sentry-text-muted text-sm">
                {githubStats.stars.toLocaleString()}
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-sentry-text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              MIT Licensed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              Open Source
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              Active Development
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need for
              <span className="text-sentry-purple"> AI-driven development</span>
            </h2>
            <p className="text-sentry-text-secondary text-lg max-w-2xl mx-auto">
              A complete toolkit for integrating Xcode workflows with AI assistants and automation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: "Autonomous Development",
                desc: "AI agents independently build projects, fix compilation errors, and iterate on solutions without human intervention.",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
              },
              {
                icon: Terminal,
                title: "Complete Workflow",
                desc: "From project creation to device deployment. Manage the entire iOS/macOS development lifecycle through AI commands.",
                color: "text-sentry-purple-light",
                bg: "bg-sentry-purple/10",
              },
              {
                icon: Bug,
                title: "LLDB Debugging",
                desc: "Attach the debugger, set breakpoints, inspect variables, and execute LLDB commands directly from your AI agent.",
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
              {
                icon: MonitorSmartphone,
                title: "UI Automation",
                desc: "Interact with simulator UI elements, capture screenshots, and automate user interface testing workflows.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                icon: Smartphone,
                title: "Real Device Testing",
                desc: "Deploy and test on physical devices over USB or Wi-Fi with comprehensive log capture and debugging support.",
                color: "text-orange-400",
                bg: "bg-orange-400/10",
              },
              {
                icon: Layers,
                title: "Multi-Client Support",
                desc: "Works with Cursor, Claude Code, VS Code, Windsurf, Xcode, and any MCP-compatible client.",
                color: "text-sentry-pink",
                bg: "bg-sentry-pink/10",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl border border-sentry-dark-600/50 bg-sentry-dark-200/50 hover:bg-sentry-dark-300/50 hover:border-sentry-dark-700 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-sentry-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section id="see-it-in-action" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sentry-dark-200/50 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">See it in action</h2>
            <p className="text-sentry-text-secondary text-lg max-w-2xl mx-auto">
              Watch XcodeBuildMCP handle real development workflows end to end.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                src: "/videos/agentic.mp4",
                title: "Agentic Development",
                desc: "AI agents autonomously building, testing, and iterating on iOS projects.",
              },
              {
                src: "/videos/Debugging.mp4",
                title: "Debugging",
                desc: "LLDB integration for setting breakpoints, inspecting state, and fixing issues.",
              },
              {
                src: "/videos/XcodeIDE.mp4",
                title: "Xcode IDE Integration",
                desc: "Seamless integration with Xcode's coding agents and development tools.",
              },
            ].map((video) => (
              <div key={video.title} className="group">
                <button
                  onClick={() => setLightboxVideo(video.src)}
                  onMouseEnter={(e) => {
                    const vid = e.currentTarget.querySelector("video")
                    vid?.play()
                  }}
                  onMouseLeave={(e) => {
                    const vid = e.currentTarget.querySelector("video")
                    if (vid) { vid.pause(); vid.currentTime = 0 }
                  }}
                  className="relative rounded-xl overflow-hidden border border-sentry-dark-600/50 bg-sentry-dark-300 mb-4 w-full cursor-pointer block"
                >
                  <video
                    className="w-full aspect-video object-cover pointer-events-none"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src={`${video.src}#t=0.001`} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>
                <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
                <p className="text-sm text-sentry-text-secondary">{video.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLI Section */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20">
                New in v2.0
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                First-class <span className="text-sentry-purple">CLI</span>
              </h2>
              <p className="text-sentry-text-secondary text-lg mb-6 leading-relaxed">
                Every MCP tool is also available from the command line. Use it for scripting, CI workflows,
                or direct terminal usage alongside your AI agents.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "All MCP tools accessible from the terminal",
                  "Background process for stateful operations (log capture, debugging, video recording)",
                  "Works great in CI/CD pipelines and scripting",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-sentry-text-secondary">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-sentry-dark-600/50 bg-sentry-dark-200/80 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-sentry-dark-600/50 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-sentry-dark-600" />
                    <div className="w-3 h-3 rounded-full bg-sentry-dark-600" />
                    <div className="w-3 h-3 rounded-full bg-sentry-dark-600" />
                  </div>
                  <span className="text-xs text-sentry-text-muted ml-2 font-mono">Terminal</span>
                </div>
                <div className="p-5 font-mono text-sm space-y-3">
                  <div>
                    <span className="text-sentry-text-muted">$</span>{" "}
                    <span className="text-sentry-text-primary">xcodebuildmcp tools</span>
                  </div>
                  <div className="text-sentry-text-muted text-xs leading-relaxed">
                    Available tools (59):{"\n"}
                    simulator/build, simulator/build-and-run,{"\n"}
                    simulator/test, simulator/screenshot,{"\n"}
                    debugging/attach, debugging/breakpoint,{"\n"}
                    ui-automation/tap, ui-automation/swipe ...
                  </div>
                  <div className="pt-2 border-t border-sentry-dark-600/30">
                    <span className="text-sentry-text-muted">$</span>{" "}
                    <span className="text-sentry-text-primary">xcodebuildmcp simulator build-and-run \</span>
                    {"\n"}
                    <span className="text-sentry-text-primary">{"    "}--scheme MyApp --project-path ./MyApp.xcodeproj</span>
                  </div>
                  <div className="text-green-400 text-xs">
                    Build succeeded. Launching on iPhone 16...
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Xcode Interoperability */}
      <section id="xcode-integration" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Deep <span className="text-sentry-purple">Xcode</span> interoperability
            </h2>
            <p className="text-sentry-text-secondary text-lg max-w-2xl mx-auto">
              Two-way integration that works inside Xcode and from external tools.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Inside Xcode */}
            <div className="relative rounded-2xl border border-sentry-dark-600/50 bg-gradient-to-br from-sentry-dark-300/80 to-sentry-dark-200/50 p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sentry-purple/5 rounded-full blur-[60px]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-medium bg-sentry-purple/10 text-sentry-purple-light border border-sentry-purple/20">
                  Inside Xcode
                </div>
                <h3 className="text-2xl font-bold mb-4">Works with Xcode's coding agents</h3>
                <p className="text-sentry-text-secondary mb-6 leading-relaxed">
                  XcodeBuildMCP integrates natively with Xcode 26.3's Claude and Codex coding agents.
                  It automatically detects your selected scheme and simulator, using those values for all operations.
                </p>
                <ul className="space-y-3">
                  {[
                    "Auto-detects active scheme and simulator",
                    "Augments Xcode's agent with build, test, and deploy capabilities",
                    "Hides redundant tools already served by Xcode natively",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-sentry-text-secondary">
                      <CheckCircle className="w-4 h-4 text-sentry-purple-light mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* From External Agents */}
            <div className="relative rounded-2xl border border-sentry-dark-600/50 bg-gradient-to-br from-sentry-dark-300/80 to-sentry-dark-200/50 p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sentry-pink/5 rounded-full blur-[60px]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-medium bg-sentry-pink/10 text-sentry-pink border border-sentry-pink/20">
                  From External Agents
                </div>
                <h3 className="text-2xl font-bold mb-4">Proxy Xcode's MCP server</h3>
                <p className="text-sentry-text-secondary mb-6 leading-relaxed">
                  Xcode now has its own MCP server for external agents. XcodeBuildMCP proxies those tools
                  automatically, so you only need one server configured in your client.
                </p>
                <ul className="space-y-3">
                  {[
                    "Single server setup for all Xcode capabilities",
                    "Snapshot SwiftUI previews from external agents",
                    "Access Apple documentation and Issue Navigator data",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-sentry-text-secondary">
                      <CheckCircle className="w-4 h-4 text-sentry-pink mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Supported Clients */}
          <div className="mt-12 text-center">
            <p className="text-sm text-sentry-text-muted mb-6">Works with your favorite tools</p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sentry-text-muted">
              {["Cursor", "Claude Code", "VS Code", "Windsurf", "Xcode", "GitHub Copilot", "Codex", "Amp", "OpenCode"].map((client) => (
                <span key={client} className="text-sm font-medium text-sentry-text-secondary hover:text-white transition-colors">
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agent Configuration */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <div className="rounded-xl border border-sentry-dark-600/50 bg-sentry-dark-200/80 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-sentry-dark-600/50 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-sentry-dark-600" />
                    <div className="w-3 h-3 rounded-full bg-sentry-dark-600" />
                    <div className="w-3 h-3 rounded-full bg-sentry-dark-600" />
                  </div>
                  <span className="text-xs text-sentry-text-muted ml-2 font-mono">Claude Code</span>
                </div>
                <div className="p-5 text-sm space-y-4">
                  <div className="font-mono">
                    <span className="text-sentry-text-muted">&gt;</span>{" "}
                    <span className="text-sentry-text-primary">Add dark mode support to my app.</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-sentry-text-secondary">
                      <span className="text-sentry-purple-light">Edited</span> Theme.swift
                    </div>
                    <div className="flex items-center gap-2 text-sentry-text-secondary">
                      <span className="text-sentry-purple-light">Edited</span> SettingsView.swift
                    </div>
                    <div className="flex items-center gap-2 text-sentry-text-secondary">
                      <span className="text-sentry-purple-light">Edited</span> ContentView.swift
                    </div>
                    <div className="h-px bg-sentry-dark-600/50 my-1" />
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3 shrink-0" /> Built and launched on iPhone 16
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3 shrink-0" /> Navigated to Settings
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3 shrink-0" /> Toggled dark mode switch
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3 shrink-0" /> Captured screenshot
                    </div>
                    <div className="h-px bg-sentry-dark-600/50 my-1" />
                    <div className="text-sentry-text-primary text-xs">
                      I've added dark mode support and verified it works in the simulator. The toggle is in Settings and persists across launches.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-sentry-dark-600/50 bg-sentry-dark-200/80 p-5">
                <p className="text-xs text-sentry-text-muted mb-3">.xcodebuildmcp/config.yaml</p>
                <pre className="font-mono text-xs text-sentry-text-primary leading-relaxed">{`schemaVersion: 1
enabledWorkflows:
  - simulator
  - ui-automation
  - debugging
sessionDefaults:
  scheme: MyApp
  projectPath: ./MyApp.xcodeproj
  simulatorName: iPhone 16`}</pre>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-medium bg-sentry-purple/10 text-sentry-purple-light border border-sentry-purple/20">
                Agent-ready
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Built for <span className="text-sentry-purple">AI agents</span>
              </h2>
              <p className="text-sentry-text-secondary text-lg mb-6 leading-relaxed">
                Configure your project once and let AI agents handle the rest. XcodeBuildMCP gives agents
                full autonomy over the build, test, and deploy cycle.
              </p>
              <ul className="space-y-3">
                {[
                  "Project-level config so agents know your scheme, simulator, and workflows",
                  "Agents independently fix build errors and iterate on solutions",
                  "Selective workflow loading to reduce agent context window usage",
                  "Agent skill files to prime your AI with usage instructions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-sentry-text-secondary">
                    <CheckCircle className="w-4 h-4 text-sentry-purple-light mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="get-started" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sentry-dark-200/50 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get started in seconds</h2>
            <p className="text-sentry-text-secondary text-lg">
              Install XcodeBuildMCP as an MCP server for AI coding agents, or globally for CLI use.
            </p>
          </div>

          {/* Install Tabs */}
          <div className="rounded-xl border border-sentry-dark-600/50 bg-sentry-dark-200/80 overflow-hidden">
            <div className="flex border-b border-sentry-dark-600/50">
              {(["npx", "homebrew"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveInstallTab(tab)}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeInstallTab === tab
                      ? "text-white bg-sentry-dark-400/50 border-b-2 border-sentry-purple"
                      : "text-sentry-text-secondary hover:text-white"
                  }`}
                >
                  {tab === "npx" ? "NPX (recommended)" : "Homebrew"}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {activeInstallTab === "homebrew" && (
                <div>
                  <p className="text-sm text-sentry-text-secondary mb-3">Install via Homebrew:</p>
                  <div className="flex items-center gap-2 bg-sentry-dark-100 rounded-lg p-3 font-mono text-sm">
                    <code className="text-green-400 flex-1">
                      brew tap getsentry/xcodebuildmcp && brew install xcodebuildmcp
                    </code>
                    <button
                      onClick={() => copyToClipboard("brew tap getsentry/xcodebuildmcp && brew install xcodebuildmcp", "brew")}
                      className="p-1.5 rounded hover:bg-sentry-dark-400 transition-colors shrink-0"
                    >
                      {copiedText === "brew" ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-sentry-text-muted" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sentry-purple/10 text-sentry-purple-light border border-sentry-purple/20">
                    MCP server
                  </span>
                  <p className="text-sm text-sentry-text-secondary">
                    {activeInstallTab === "npx"
                      ? "Add to your MCP client configuration:"
                      : "Then add to your MCP client configuration:"}
                  </p>
                </div>
                <div className="relative bg-sentry-dark-100 rounded-lg p-4 font-mono text-sm">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        activeInstallTab === "npx" ? npxConfig : homebrewConfig,
                        "config",
                      )
                    }
                    className="absolute top-3 right-3 p-1.5 rounded hover:bg-sentry-dark-400 transition-colors"
                  >
                    {copiedText === "config" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-sentry-text-muted" />
                    )}
                  </button>
                  <pre className="text-sentry-text-primary text-xs sm:text-sm overflow-x-auto">
                    {activeInstallTab === "npx" ? npxConfig : homebrewConfig}
                  </pre>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
                    CLI
                  </span>
                  <p className="text-sm text-sentry-text-secondary">
                    {activeInstallTab === "npx"
                      ? "Install globally for direct terminal use:"
                      : "The CLI is ready to use after installing:"}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-sentry-dark-100 rounded-lg p-3 font-mono text-sm">
                  <code className="text-green-400 flex-1">
                    {activeInstallTab === "npx" ? npmGlobalInstall : "xcodebuildmcp --help"}
                  </code>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        activeInstallTab === "npx" ? npmGlobalInstall : "xcodebuildmcp --help",
                        "cli",
                      )
                    }
                    className="p-1.5 rounded hover:bg-sentry-dark-400 transition-colors shrink-0"
                  >
                    {copiedText === "cli" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-sentry-text-muted" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 text-sm text-sentry-purple-light hover:text-sentry-purple transition-colors"
            >
              View full documentation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contributing */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-sentry-dark-600/50 bg-gradient-to-br from-sentry-dark-300/50 to-sentry-dark-200/30 p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full bg-sentry-purple/5 blur-[80px]" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Open source, community driven</h2>
              <p className="text-sentry-text-secondary text-lg max-w-xl mx-auto mb-8">
                XcodeBuildMCP is MIT licensed and welcomes contributions. Help shape the future of AI-powered Xcode development.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="https://github.com/getsentry/XcodeBuildMCP/issues"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sentry-purple hover:bg-sentry-purple-deep text-white font-medium transition-colors"
                >
                  <Github className="w-4 h-4" />
                  View Issues
                </Link>
                <Link
                  href="https://github.com/getsentry/XcodeBuildMCP/blob/main/docs/dev/CONTRIBUTING.md"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-sentry-dark-600 hover:border-sentry-dark-700 text-sentry-text-primary hover:bg-sentry-dark-400/50 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Contributing Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sentry-dark-600/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="XcodeBuildMCP" width={20} height={20} className="w-5 h-5" />
              <span className="text-sm font-medium">XcodeBuildMCP</span>
              <span className="text-sm text-sentry-text-muted">&copy; {new Date().getFullYear()} Sentry</span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="https://sentry.io"
                className="text-sm text-sentry-text-muted hover:text-white transition-colors"
              >
                Sentry
              </Link>
              <Link
                href="https://x.com/xcodebuildmcp"
                className="text-sm text-sentry-text-muted hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @xcodebuildmcp
              </Link>
              <Link
                href="https://github.com/getsentry/XcodeBuildMCP"
                className="text-sm text-sentry-text-muted hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Lightbox */}
      {lightboxVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxVideo(null)}
        >
          <button
            onClick={() => setLightboxVideo(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div
            className="w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className="w-full rounded-xl"
              autoPlay
              controls
              playsInline
              key={lightboxVideo}
            >
              <source src={lightboxVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  )
}
