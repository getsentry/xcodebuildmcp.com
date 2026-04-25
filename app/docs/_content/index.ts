import type { ComponentType } from "react"
import type { DocSlug } from "../_data/routes"
import IntroductionPage from "./introduction.mdx"
import InstallationPage from "./installation.mdx"
import SetupPage from "./setup.mdx"
import ClientsPage from "./clients.mdx"
import CLIPage from "./cli.mdx"
import MCPModePage from "./mcp-mode.mdx"
import WorkflowsPage from "./workflows.mdx"
import ToolsPage from "./tools.mdx"
import MCPProtocolSupportPage from "./mcp-protocol-support.mdx"
import OutputFormatsPage from "./output-formats.mdx"
import ConfigurationPage from "./configuration.mdx"
import SessionDefaultsPage from "./session-defaults.mdx"
import EnvVarsPage from "./env-vars.mdx"
import XcodeIdePage from "./xcode-ide.mdx"
import DeviceSigningPage from "./device-signing.mdx"
import SkillsPage from "./skills.mdx"
import DemosPage from "./demos.mdx"
import MigrationV2Page from "./migration-v2.mdx"
import PrivacyPage from "./privacy.mdx"
import TroubleshootingPage from "./troubleshooting.mdx"
import ChangelogPage from "./changelog.mdx"
import ContributingPage from "./contributing.mdx"
import ArchitecturePage from "./architecture.mdx"
import ArchitectureRuntimeBoundariesPage from "./architecture-runtime-boundaries.mdx"
import ArchitectureStartupConfigPage from "./architecture-startup-config.mdx"
import ArchitectureManifestVisibilityPage from "./architecture-manifest-visibility.mdx"
import ArchitectureToolLifecyclePage from "./architecture-tool-lifecycle.mdx"
import ArchitectureRenderingOutputPage from "./architecture-rendering-output.mdx"
import ArchitectureDaemonPage from "./architecture-daemon.mdx"
import ArchitectureDebuggingPage from "./architecture-debugging.mdx"
import ToolAuthoringPage from "./tool-authoring.mdx"
import SchemaVersioningPage from "./schema-versioning.mdx"
import TestingPage from "./testing.mdx"

export const PAGE_COMPONENTS: Record<DocSlug, ComponentType> = {
  introduction: IntroductionPage,
  installation: InstallationPage,
  setup: SetupPage,
  clients: ClientsPage,
  cli: CLIPage,
  "mcp-mode": MCPModePage,
  workflows: WorkflowsPage,
  tools: ToolsPage,
  "mcp-protocol-support": MCPProtocolSupportPage,
  "output-formats": OutputFormatsPage,
  configuration: ConfigurationPage,
  "session-defaults": SessionDefaultsPage,
  "env-vars": EnvVarsPage,
  "xcode-ide": XcodeIdePage,
  "device-signing": DeviceSigningPage,
  skills: SkillsPage,
  demos: DemosPage,
  "migration-v2": MigrationV2Page,
  privacy: PrivacyPage,
  troubleshooting: TroubleshootingPage,
  changelog: ChangelogPage,
  contributing: ContributingPage,
  architecture: ArchitecturePage,
  "architecture-runtime-boundaries": ArchitectureRuntimeBoundariesPage,
  "architecture-startup-config": ArchitectureStartupConfigPage,
  "architecture-manifest-visibility": ArchitectureManifestVisibilityPage,
  "architecture-tool-lifecycle": ArchitectureToolLifecyclePage,
  "architecture-rendering-output": ArchitectureRenderingOutputPage,
  "architecture-daemon": ArchitectureDaemonPage,
  "architecture-debugging": ArchitectureDebuggingPage,
  "tool-authoring": ToolAuthoringPage,
  "schema-versioning": SchemaVersioningPage,
  testing: TestingPage,
}
