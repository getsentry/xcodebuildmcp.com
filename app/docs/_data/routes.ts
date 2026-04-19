import type { IconName } from "../_components/icons"

export type DocSlug =
  | "introduction"
  | "installation"
  | "setup"
  | "clients"
  | "cli"
  | "mcp-mode"
  | "workflows"
  | "tools"
  | "configuration"
  | "session-defaults"
  | "env-vars"
  | "xcode-ide"
  | "device-signing"
  | "skills"
  | "demos"
  | "migration-v2"
  | "privacy"
  | "troubleshooting"
  | "changelog"

export interface DocRoute {
  slug: DocSlug
  title: string
  description: string
  group: string
}

export interface SidebarItem {
  slug: DocSlug
  /** Child slugs rendered indented below this item in the sidebar. */
  children?: DocSlug[]
}

export interface SidebarGroup {
  label: string
  icon: IconName
  items: SidebarItem[]
}

export const PAGES_ORDER: DocSlug[] = [
  "introduction",
  "installation",
  "setup",
  "clients",
  "cli",
  "mcp-mode",
  "workflows",
  "tools",
  "configuration",
  "session-defaults",
  "env-vars",
  "xcode-ide",
  "device-signing",
  "skills",
  "demos",
  "migration-v2",
  "privacy",
  "troubleshooting",
  "changelog",
]

export const PAGE_META: Record<DocSlug, DocRoute> = {
  introduction: {
    slug: "introduction",
    title: "Introduction",
    group: "Overview",
    description:
      "A Model Context Protocol server and CLI that gives coding agents safe, predictable Xcode tools.",
  },
  installation: {
    slug: "installation",
    title: "Installation",
    group: "Getting Started",
    description: "Install XcodeBuildMCP via Homebrew or npm.",
  },
  setup: {
    slug: "setup",
    title: "Setup",
    group: "Getting Started",
    description:
      "Wire XcodeBuildMCP into your editor, configure your project, and run your first build.",
  },
  clients: {
    slug: "clients",
    title: "MCP Clients",
    group: "Getting Started",
    description:
      "Drop-in config for Claude Code, Cursor, Codex, Claude Desktop, VS Code, Windsurf, Kiro, Trae, Xcode agents, and AdaL.",
  },
  cli: {
    slug: "cli",
    title: "CLI",
    group: "Usage",
    description: "Direct terminal access to every XcodeBuildMCP tool.",
  },
  "mcp-mode": {
    slug: "mcp-mode",
    title: "MCP Server Mode",
    group: "Usage",
    description: "What the MCP server exposes, how it behaves, and where the edges are.",
  },
  workflows: {
    slug: "workflows",
    title: "Workflows",
    group: "Usage",
    description: "Tools grouped into workflow packages. Load only what your agent needs.",
  },
  tools: {
    slug: "tools",
    title: "Tools Reference",
    group: "Reference",
    description: "All tools XcodeBuildMCP advertises, synced live from the latest release.",
  },
  configuration: {
    slug: "configuration",
    title: "Configuration",
    group: "Reference",
    description: "Everything XcodeBuildMCP reads on startup.",
  },
  "session-defaults": {
    slug: "session-defaults",
    title: "Session Defaults",
    group: "Reference",
    description:
      "Set shared workspace/scheme/simulator values once; every tool reuses them automatically.",
  },
  "env-vars": {
    slug: "env-vars",
    title: "Environment Variables",
    group: "Reference",
    description: "Every env var XcodeBuildMCP reads on startup.",
  },
  "xcode-ide": {
    slug: "xcode-ide",
    title: "Xcode IDE Bridge",
    group: "Reference",
    description:
      "Proxy Xcode 26's MCP service through XcodeBuildMCP to reach IDE-only tools.",
  },
  "device-signing": {
    slug: "device-signing",
    title: "Device Code Signing",
    group: "Guides",
    description: "Getting device tools to install and launch on real hardware.",
  },
  skills: {
    slug: "skills",
    title: "Agent Skills",
    group: "Guides",
    description: "Prime your agent with XcodeBuildMCP's conventions.",
  },
  demos: {
    slug: "demos",
    title: "Demos",
    group: "Guides",
    description: "Short clips of XcodeBuildMCP in action across different MCP clients.",
  },
  "migration-v2": {
    slug: "migration-v2",
    title: "Migration from v1",
    group: "Guides",
    description: "Upgrading from XcodeBuildMCP 1.x to 2.x.",
  },
  privacy: {
    slug: "privacy",
    title: "Privacy & Telemetry",
    group: "Guides",
    description: "What we collect, why, and how to turn it off.",
  },
  troubleshooting: {
    slug: "troubleshooting",
    title: "Troubleshooting",
    group: "Guides",
    description: "The problems people actually hit, with the fixes that actually work.",
  },
  changelog: {
    slug: "changelog",
    title: "Changelog",
    group: "Guides",
    description: "Notable changes in each release.",
  },
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    label: "Overview",
    icon: "Home",
    items: [{ slug: "introduction" }],
  },
  {
    label: "Getting Started",
    icon: "Rocket",
    items: [{ slug: "installation" }, { slug: "setup" }, { slug: "clients" }],
  },
  {
    label: "Usage",
    icon: "Terminal",
    items: [{ slug: "cli" }, { slug: "mcp-mode" }, { slug: "workflows" }],
  },
  {
    label: "Reference",
    icon: "Book",
    items: [
      { slug: "tools" },
      {
        slug: "configuration",
        children: ["session-defaults", "env-vars"],
      },
      { slug: "xcode-ide" },
    ],
  },
  {
    label: "Guides",
    icon: "FileText",
    items: [
      { slug: "device-signing" },
      { slug: "skills" },
      { slug: "demos" },
      { slug: "migration-v2" },
      { slug: "privacy" },
      { slug: "troubleshooting" },
      { slug: "changelog" },
    ],
  },
]

export function isDocSlug(value: string): value is DocSlug {
  return (PAGES_ORDER as string[]).includes(value)
}

export function neighbors(slug: DocSlug): {
  prev: DocRoute | null
  next: DocRoute | null
} {
  const idx = PAGES_ORDER.indexOf(slug)
  const prev = idx > 0 ? PAGE_META[PAGES_ORDER[idx - 1]] : null
  const next = idx < PAGES_ORDER.length - 1 ? PAGE_META[PAGES_ORDER[idx + 1]] : null
  return { prev, next }
}
