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

export const PAGE_COMPONENTS: Record<DocSlug, ComponentType> = {
  introduction: IntroductionPage,
  installation: InstallationPage,
  setup: SetupPage,
  clients: ClientsPage,
  cli: CLIPage,
  "mcp-mode": MCPModePage,
  workflows: WorkflowsPage,
  tools: ToolsPage,
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
}
