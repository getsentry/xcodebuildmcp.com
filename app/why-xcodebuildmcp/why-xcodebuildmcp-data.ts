import type { LucideIcon } from "lucide-react";
import {
  Bug,
  FileText,
  Gauge,
  Layers,
  MonitorSmartphone,
  Settings2,
} from "lucide-react";

export const appleToolchain = [
  "xcodebuild",
  "simctl",
  "devicectl",
  "log",
  "lldb",
  "Simulator UI",
  "debugger surfaces",
];

export const bashLines = [
  "$ xcodebuild -workspace App.xcworkspace -scheme App -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build",
  "... pages of compiler, linker, package, and warning output ...",
  "$ xcrun simctl boot 7D8B...",
  "$ xcrun simctl install 7D8B... DerivedData/.../App.app",
  "$ xcrun simctl launch 7D8B... io.example.App",
  "$ xcrun simctl spawn 7D8B... log stream --predicate ...",
];

export const mcpSteps = [
  "Remember scheme, workspace, simulator, and device through session defaults instead of repeating flags",
  "Run build, install, launch, and log capture as workflow tool calls, not fragile multi-command loops",
  "Return schema-backed structured results instead of raw terminal transcript noise",
  "Keep logs, screenshots, videos, and build artifacts available without pasting them into chat",
  "Expose semantic UI snapshots, UI actions, and stateful LLDB sessions when the fix needs evidence",
];

export const tokenComparison = {
  bash: {
    label: "Raw shell loop",
    value: "High noise",
  },
  mcp: {
    label: "MCP tool result",
    value: "Structured",
  },
  summary: "schema-backed result plus artifact links",
};

export const benefits: Array<{
  icon: LucideIcon;
  title: string;
  text: string;
}> = [
  {
    icon: Gauge,
    title: "Less output, more signal",
    text: "Raw Xcode output is a transcript. XcodeBuildMCP turns it into status, errors, warnings, artifacts, and next steps the agent can act on.",
  },
  {
    icon: Settings2,
    title: "Project memory for the agent",
    text: "Set workspace, scheme, simulator, device, and profile once. Later calls stay short, so the agent focuses on the bug instead of retyping flags.",
  },
  {
    icon: FileText,
    title: "Published structured contracts",
    text: "Tool results are schema-backed and versioned, so agents and scripts can read stable JSON fields instead of scraping rendered text.",
  },
  {
    icon: MonitorSmartphone,
    title: "Simulator UI as a first-class surface",
    text: "Agents can inspect semantic UI snapshots, tap, type, swipe, drag, press keys, capture screenshots, and record video with stable element references.",
  },
  {
    icon: Bug,
    title: "Debugger control that survives turns",
    text: "LLDB attach, breakpoints, stack frames, variables, and raw commands are exposed as tools backed by stateful debug sessions.",
  },
  {
    icon: Layers,
    title: "Artifacts are managed, not pasted",
    text: "Build logs, runtime logs, screenshots, videos, and app paths are captured as artifacts the agent can inspect without flooding every response.",
  },
];

export const stories = [
  {
    role: "Developer",
    title: "You stay in review mode",
    text: "Ask the agent to build, install, launch, inspect the UI, capture logs, debug, fix, validate, and return proof. You no longer become the build operator between every turn.",
  },
  {
    role: "Agent",
    title: "Apple tools stay the source of truth",
    text: "XcodeBuildMCP does not replace Xcode or xcodebuild. It orchestrates Apple's own xcodebuild, simctl, devicectl, log, lldb, simulator, and debugger surfaces through a narrower contract.",
  },
  {
    role: "When raw xcodebuild is enough",
    title: "Stable CI can stay simple",
    text: "If you already have a stable archive or CI script, raw xcodebuild may be the right tool. XcodeBuildMCP earns its place in iterative agent-assisted workflows where state, UI, logs, and debugging all matter.",
  },
];
