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
  | "mcp-protocol-support"
  | "output-formats"
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
  | "contributing"
  | "architecture"
  | "architecture-runtime-boundaries"
  | "architecture-startup-config"
  | "architecture-manifest-visibility"
  | "architecture-tool-lifecycle"
  | "architecture-rendering-output"
  | "architecture-daemon"
  | "architecture-debugging"
  | "tool-authoring"
  | "schema-versioning"
  | "testing"

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
  "tools",
  "workflows",
  "mcp-protocol-support",
  "output-formats",
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
  "contributing",
  "architecture",
  "architecture-runtime-boundaries",
  "architecture-startup-config",
  "architecture-manifest-visibility",
  "architecture-tool-lifecycle",
  "architecture-rendering-output",
  "architecture-daemon",
  "architecture-debugging",
  "tool-authoring",
  "schema-versioning",
  "testing",
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
    group: "Reference",
    description: "The catalog of tool groups XcodeBuildMCP exposes through MCP, and what each one contains.",
  },
  tools: {
    slug: "tools",
    title: "Tools Reference",
    group: "Reference",
    description: "All tools XcodeBuildMCP advertises, synced live from the latest release.",
  },
  "mcp-protocol-support": {
    slug: "mcp-protocol-support",
    title: "MCP Protocol Support",
    group: "Reference",
    description: "Which features of the MCP protocol XcodeBuildMCP implements.",
  },
  "output-formats": {
    slug: "output-formats",
    title: "Output Formats",
    group: "Reference",
    description: "Machine-readable CLI output and MCP structuredContent envelopes.",
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
  contributing: {
    slug: "contributing",
    title: "Contributing",
    group: "Contributing",
    description: "How to set up, build, and submit changes to XcodeBuildMCP.",
  },
  architecture: {
    slug: "architecture",
    title: "Architecture Overview",
    group: "Contributing",
    description:
      "Why XcodeBuildMCP is split into manifests, runtime boundaries, tool handlers, rendering, and daemon transport.",
  },
  "architecture-runtime-boundaries": {
    slug: "architecture-runtime-boundaries",
    title: "Runtime Boundaries",
    group: "Contributing",
    description: "How MCP, CLI, direct invocation, and daemon-routed invocation share one tool layer.",
  },
  "architecture-startup-config": {
    slug: "architecture-startup-config",
    title: "Startup & Configuration",
    group: "Contributing",
    description: "How runtime bootstrap, config precedence, workflow inputs, and session defaults fit together.",
  },
  "architecture-manifest-visibility": {
    slug: "architecture-manifest-visibility",
    title: "Manifests & Visibility",
    group: "Contributing",
    description: "How manifests define tools, workflows, resources, availability, predicates, and lazy imports.",
  },
  "architecture-tool-lifecycle": {
    slug: "architecture-tool-lifecycle",
    title: "Tool Lifecycle",
    group: "Contributing",
    description: "The contract between tool modules, handlers, domain results, fragments, and next steps.",
  },
  "architecture-rendering-output": {
    slug: "architecture-rendering-output",
    title: "Rendering & Output",
    group: "Contributing",
    description: "How render sessions turn fragments and structured results into MCP and CLI output.",
  },
  "architecture-daemon": {
    slug: "architecture-daemon",
    title: "Daemon Lifecycle",
    group: "Contributing",
    description: "Why stateful CLI tools use a per-workspace daemon and how its transport lifecycle works.",
  },
  "architecture-debugging": {
    slug: "architecture-debugging",
    title: "Debugging",
    group: "Contributing",
    description: "How simulator debugging sessions, DAP, and LLDB CLI backends are wired.",
  },
  "tool-authoring": {
    slug: "tool-authoring",
    title: "Tool Authoring",
    group: "Contributing",
    description: "Add, modify, or remove a tool end to end.",
  },
  "schema-versioning": {
    slug: "schema-versioning",
    title: "Schema Versioning",
    group: "Contributing",
    description: "How structured output JSON Schemas are versioned and published.",
  },
  testing: {
    slug: "testing",
    title: "Testing",
    group: "Contributing",
    description: "How XcodeBuildMCP tests tools, fixtures, snapshots, and schema contracts.",
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
    items: [{ slug: "cli" }, { slug: "mcp-mode" }],
  },
  {
    label: "Reference",
    icon: "Book",
    items: [
      { slug: "tools" },
      { slug: "workflows" },
      { slug: "mcp-protocol-support" },
      { slug: "output-formats" },
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
  {
    label: "Contributing",
    icon: "Github",
    items: [
      { slug: "contributing" },
      {
        slug: "architecture",
        children: [
          "architecture-runtime-boundaries",
          "architecture-startup-config",
          "architecture-manifest-visibility",
          "architecture-tool-lifecycle",
          "architecture-rendering-output",
          "architecture-daemon",
          "architecture-debugging",
        ],
      },
      { slug: "tool-authoring" },
      { slug: "schema-versioning" },
      { slug: "testing" },
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
