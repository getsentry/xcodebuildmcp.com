export type PublishedSchema = {
  name: string
  versions: string[]
  latest: string
}

export const publishedSchemas: PublishedSchema[] = [
  { name: "xcodebuildmcp.output.app-path", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.build-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.build-run-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.build-settings", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.bundle-id", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.capture-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.coverage-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.debug-breakpoint-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.debug-command-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.debug-session-action", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.debug-stack-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.debug-variables-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.device-list", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.doctor-report", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.error", versions: ["1"], latest: "1" },
  { name: "xcodebuildmcp.output.install-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.launch-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.process-list", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.project-list", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.scaffold-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.scheme-list", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.session-defaults", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.session-profile", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.simulator-action-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.simulator-list", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.stop-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.test-result", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.ui-action-result", versions: ["1", "2", "3"], latest: "3" },
  { name: "xcodebuildmcp.output.workflow-selection", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.xcode-bridge-call-result", versions: ["1", "2", "3"], latest: "3" },
  { name: "xcodebuildmcp.output.xcode-bridge-status", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.xcode-bridge-sync", versions: ["1", "2"], latest: "2" },
  { name: "xcodebuildmcp.output.xcode-bridge-tool-list", versions: ["1", "2", "3"], latest: "3" },
]
