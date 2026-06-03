export type AgentDemoVideoMetadata = {
  src: string;
  poster: string;
  durationMs: number;
  width: number;
  height: number;
  title: string;
};

export type AgentEventKind =
  | "prompt"
  | "agent"
  | "tool-call"
  | "tool-output"
  | "status"
  | "diff";

export type AgentPhaseId =
  | "inspect"
  | "build"
  | "reproduce"
  | "diagnose"
  | "fix"
  | "validate";

export type AgentPhase = {
  id: AgentPhaseId;
  label: string;
};

export type AgentDiffLine = {
  kind: "context" | "added" | "removed";
  text: string;
};

export type AgentTranscriptEvent = {
  id: string;
  startMs: number;
  endMs?: number;
  phase: AgentPhaseId;
  kind: AgentEventKind;
  status?: "running" | "completed";
  text?: string;
  server?: string;
  tool?: string;
  args?: string;
  lines?: string[];
  more?: string;
  file?: string;
  diff?: AgentDiffLine[];
};

export const agentDemoPlaybackRate = 2.0;

export const agentDemoToolServer = "xcodebuildmcp";

export const agentDemoPrompt =
  "Add a storm-alert banner to Atmos Weather, wire it to the Settings toggle, then prove it on a stormy location.";

export const agentDemoPromptSubmitMs = 2_600;

export const agentDemoVideo: AgentDemoVideoMetadata = {
  src: "/videos/why-xcodebuildmcp/atmos-weather-agent-demo.mp4",
  poster: "/videos/why-xcodebuildmcp/atmos-weather-agent-demo-poster.jpg",
  durationMs: 146_267,
  width: 720,
  height: 1564,
  title: "Atmos Weather agent demo",
};

export const agentDemoPhases: AgentPhase[] = [
  { id: "inspect", label: "Inspect" },
  { id: "build", label: "Build & launch" },
  { id: "reproduce", label: "Reproduce" },
  { id: "diagnose", label: "Diagnose" },
  { id: "fix", label: "Fix" },
  { id: "validate", label: "Validate" },
];

export const agentTranscriptEvents: AgentTranscriptEvent[] = [
  {
    id: "submitted-prompt",
    startMs: agentDemoPromptSubmitMs,
    phase: "inspect",
    kind: "prompt",
    text: agentDemoPrompt,
  },
  {
    id: "baseline-snapshot-call",
    startMs: 5_000,
    phase: "inspect",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "snapshot_ui",
  },
  {
    id: "baseline-snapshot-out",
    startMs: 8_000,
    phase: "inspect",
    kind: "tool-output",
    lines: [
      "weather.locationButton  San Francisco",
      "weather.settingsButton",
      "weather.heroCondition   Mostly Sunny",
      "weather.stormAlertBanner not found",
    ],
    more: "+84 lines",
  },
  {
    id: "baseline-note",
    startMs: 11_500,
    phase: "inspect",
    kind: "agent",
    text: "Baseline confirmed: Atmos Weather is already running, Settings is reachable, and no storm banner exists yet.",
  },
  {
    id: "task-plan",
    startMs: 14_000,
    phase: "inspect",
    kind: "agent",
    text: "I'll add the banner with alerts off by default, build and launch, reproduce the missing-banner bug on New Orleans, inspect logs, debug with LLDB, fix, and validate again.",
  },
  {
    id: "alerts-default-off-diff",
    startMs: 16_000,
    phase: "inspect",
    kind: "diff",
    file: "WeatherPresentation.swift",
    diff: [
      { kind: "context", text: "struct WeatherSettings" },
      { kind: "removed", text: "var severeWeatherAlerts = true" },
      { kind: "added", text: "var severeWeatherAlerts = false" },
      { kind: "context", text: "var atmosphericAnimations = true" },
    ],
  },
  {
    id: "banner-view-diff",
    startMs: 19_000,
    phase: "inspect",
    kind: "diff",
    file: "WeatherPresentation.swift",
    diff: [
      { kind: "added", text: "if model.shouldShowStormAlert {" },
      { kind: "added", text: "    StormAlertBanner()" },
      { kind: "added", text: "        .accessibilityIdentifier(\"weather.stormAlertBanner\")" },
      { kind: "added", text: "}" },
    ],
  },
  {
    id: "storm-predicate-diff",
    startMs: 22_000,
    phase: "inspect",
    kind: "diff",
    file: "WeatherPresentation.swift",
    diff: [
      { kind: "added", text: "var isStormAlertCondition: Bool {" },
      { kind: "added", text: "    self == .heavyRain" },
      { kind: "added", text: "}" },
      { kind: "context", text: "// New Orleans is thunderstorms, so this first pass is intentionally wrong." },
    ],
  },
  {
    id: "storm-log-diff",
    startMs: 24_500,
    phase: "inspect",
    kind: "diff",
    file: "ContentView.swift",
    diff: [
      { kind: "added", text: "logger.info(\"storm-alert condition=\\(condition) alertsEnabled=\\(alertsEnabled) predicate=\\(predicate) bannerVisible=\\(bannerVisible)\")" },
    ],
  },
  {
    id: "build-call",
    startMs: 31_000,
    phase: "build",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "build_run_sim",
  },
  {
    id: "build-status",
    startMs: 31_500,
    endMs: 40_500,
    phase: "build",
    kind: "status",
    status: "running",
    text: "Building, installing, and launching Weather",
  },
  {
    id: "build-completed",
    startMs: 40_500,
    phase: "build",
    kind: "status",
    status: "completed",
    text: "Build succeeded",
  },
  {
    id: "build-out",
    startMs: 41_500,
    phase: "build",
    kind: "tool-output",
    lines: [
      "status: SUCCEEDED",
      "Installed Weather.app on iPhone 17 Pro Max",
      "Launched from SpringBoard",
      "runtimeLogPath and build log captured",
    ],
  },
  {
    id: "build-log-call",
    startMs: 44_000,
    phase: "build",
    kind: "tool-call",
    tool: "Grep",
    args: "BUILD SUCCEEDED in build log",
  },
  {
    id: "build-log-out",
    startMs: 46_000,
    phase: "build",
    kind: "tool-output",
    lines: ["** BUILD SUCCEEDED **", "No blocking warnings in the captured build summary"],
  },
  {
    id: "post-build-snapshot-call",
    startMs: 48_000,
    phase: "build",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "snapshot_ui",
  },
  {
    id: "post-build-snapshot-out",
    startMs: 50_000,
    phase: "build",
    kind: "tool-output",
    lines: ["weather.locationButton  San Francisco", "weather.settingsButton"],
  },
  {
    id: "open-location-call",
    startMs: 52_000,
    phase: "reproduce",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "tap",
    args: "weather.locationButton",
  },
  {
    id: "open-location-out",
    startMs: 54_000,
    phase: "reproduce",
    kind: "tool-output",
    lines: ["Locations sheet open", "Search field focused"],
  },
  {
    id: "type-location-call",
    startMs: 55_000,
    phase: "reproduce",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "type_text",
    args: "text: \"New Orleans\"",
  },
  {
    id: "type-location-out",
    startMs: 57_000,
    phase: "reproduce",
    kind: "tool-output",
    lines: ["New Orleans, Louisiana, USA", "72°", "3:24 PM · Thunderstorms"],
  },
  {
    id: "select-location-call",
    startMs: 59_000,
    phase: "reproduce",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "tap",
    args: "New Orleans",
  },
  {
    id: "select-location-out",
    startMs: 63_000,
    phase: "reproduce",
    kind: "tool-output",
    lines: [
      "weather.heroLocation  New Orleans",
      "weather.heroCondition  Thunderstorms",
      "Alerts are off, so no banner is expected yet",
    ],
  },
  {
    id: "open-settings-call",
    startMs: 66_000,
    phase: "reproduce",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "tap",
    args: "weather.settingsButton",
  },
  {
    id: "open-settings-out",
    startMs: 70_000,
    phase: "reproduce",
    kind: "tool-output",
    lines: ["Settings sheet open", "Severe weather alerts = off"],
  },
  {
    id: "toggle-alerts-call",
    startMs: 72_000,
    phase: "reproduce",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "tap",
    args: "Severe weather alerts switch",
  },
  {
    id: "toggle-alerts-out",
    startMs: 76_000,
    phase: "reproduce",
    kind: "tool-output",
    lines: ["Severe weather alerts = on", "Expected storm banner is still missing"],
  },
  {
    id: "bug-reproduced-note",
    startMs: 78_000,
    phase: "reproduce",
    kind: "agent",
    text: "Bug reproduced: New Orleans is stormy and alerts are enabled, but the banner is not appearing.",
  },
  {
    id: "bug-log-call",
    startMs: 79_500,
    phase: "diagnose",
    kind: "tool-call",
    tool: "Grep",
    args: "storm-alert in runtime log",
  },
  {
    id: "bug-log-out",
    startMs: 81_500,
    phase: "diagnose",
    kind: "tool-output",
    lines: [
      "condition=thunderstorms alertsEnabled=true",
      "predicate=false bannerVisible=false",
    ],
  },
  {
    id: "log-diagnosis-note",
    startMs: 83_000,
    phase: "diagnose",
    kind: "agent",
    text: "The log says the data and toggle are correct. I’m attaching LLDB to inspect the predicate inside the running app.",
  },
  {
    id: "debug-attach-call",
    startMs: 84_000,
    phase: "diagnose",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "debug_attach_sim",
  },
  {
    id: "debug-attach-out",
    startMs: 86_000,
    phase: "diagnose",
    kind: "tool-output",
    lines: ["Debugger attached to Weather", "executionState running"],
  },
  {
    id: "breakpoint-call",
    startMs: 87_000,
    phase: "diagnose",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "debug_breakpoint_add",
    args: "WeatherPresentation.swift:108",
  },
  {
    id: "breakpoint-out",
    startMs: 88_500,
    phase: "diagnose",
    kind: "tool-output",
    lines: ["Breakpoint hit", "WeatherCondition.isStormAlertCondition"],
  },
  {
    id: "lldb-condition-call",
    startMs: 90_000,
    phase: "diagnose",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "debug_lldb_command",
    args: "frame variable self; expression self.isStormAlertCondition",
  },
  {
    id: "lldb-condition-out",
    startMs: 94_000,
    phase: "diagnose",
    kind: "tool-output",
    lines: ["self = thunderstorms", "self.isStormAlertCondition = false", "source: self == .heavyRain"],
  },
  {
    id: "debug-detach-call",
    startMs: 96_000,
    phase: "diagnose",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "debug_detach",
  },
  {
    id: "debug-detach-out",
    startMs: 97_000,
    phase: "diagnose",
    kind: "tool-output",
    lines: ["Debugger detached", "Weather stopped before rebuilding"],
  },
  {
    id: "fix-note",
    startMs: 98_000,
    phase: "fix",
    kind: "agent",
    text: "LLDB proved the bug: New Orleans is thunderstorms, but the predicate only checks heavy rain. I’m adding thunderstorms and relaunching.",
  },
  {
    id: "fix-diff",
    startMs: 99_000,
    phase: "fix",
    kind: "diff",
    file: "WeatherPresentation.swift",
    diff: [
      { kind: "context", text: "var isStormAlertCondition: Bool {" },
      { kind: "removed", text: "self == .heavyRain" },
      { kind: "added", text: "self == .heavyRain || self == .thunderstorms" },
      { kind: "context", text: "}" },
    ],
  },
  {
    id: "rebuild-call",
    startMs: 100_500,
    phase: "fix",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "build_run_sim",
  },
  {
    id: "rebuild-status",
    startMs: 101_000,
    endMs: 111_000,
    phase: "fix",
    kind: "status",
    status: "running",
    text: "Rebuilding and relaunching the fixed app",
  },
  {
    id: "rebuild-completed",
    startMs: 111_000,
    phase: "fix",
    kind: "status",
    status: "completed",
    text: "Build succeeded",
  },
  {
    id: "rebuild-out",
    startMs: 112_000,
    phase: "fix",
    kind: "tool-output",
    lines: ["status: SUCCEEDED", "Weather.app relaunched", "fresh runtime log captured"],
  },
  {
    id: "fixed-log-call",
    startMs: 113_500,
    phase: "fix",
    kind: "tool-call",
    tool: "Grep",
    args: "fixed build runtime log",
  },
  {
    id: "fixed-log-out",
    startMs: 115_000,
    phase: "fix",
    kind: "tool-output",
    lines: ["Fixed build loaded cleanly", "No crash or launch error in runtime log"],
  },
  {
    id: "validate-snapshot-call",
    startMs: 116_500,
    phase: "validate",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "snapshot_ui",
  },
  {
    id: "validate-snapshot-out",
    startMs: 118_000,
    phase: "validate",
    kind: "tool-output",
    lines: ["weather.locationButton  San Francisco", "weather.settingsButton"],
  },
  {
    id: "validate-location-call",
    startMs: 119_000,
    phase: "validate",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "tap",
    args: "weather.locationButton",
  },
  {
    id: "validate-type-call",
    startMs: 121_000,
    phase: "validate",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "type_text",
    args: "text: \"New Orleans\"",
  },
  {
    id: "validate-select-call",
    startMs: 123_000,
    phase: "validate",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "tap",
    args: "New Orleans",
  },
  {
    id: "validate-location-out",
    startMs: 125_000,
    phase: "validate",
    kind: "tool-output",
    lines: ["New Orleans loaded", "Thunderstorms", "Storm banner still waits for alerts"],
  },
  {
    id: "validate-settings-call",
    startMs: 126_500,
    phase: "validate",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "tap",
    args: "weather.settingsButton",
  },
  {
    id: "validate-settings-out",
    startMs: 130_000,
    phase: "validate",
    kind: "tool-output",
    lines: ["Settings open", "Severe weather alerts = off"],
  },
  {
    id: "validate-toggle-call",
    startMs: 132_000,
    phase: "validate",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "tap",
    args: "Severe weather alerts switch",
  },
  {
    id: "validate-toggle-out",
    startMs: 136_000,
    phase: "validate",
    kind: "tool-output",
    lines: ["Severe weather alerts = on", "weather.stormAlertBanner visible"],
  },
  {
    id: "validation-note",
    startMs: 138_000,
    phase: "validate",
    kind: "agent",
    text: "Validation passes: the storm banner is inline above New Orleans and pushes the forecast down instead of floating over it.",
  },
  {
    id: "final-log-call",
    startMs: 139_500,
    phase: "validate",
    kind: "tool-call",
    tool: "Grep",
    args: "storm-alert in fixed runtime log",
  },
  {
    id: "final-log-out",
    startMs: 141_000,
    phase: "validate",
    kind: "tool-output",
    lines: [
      "condition=thunderstorms alertsEnabled=true",
      "predicate=true bannerVisible=true",
    ],
  },
  {
    id: "screenshot-call",
    startMs: 142_000,
    phase: "validate",
    kind: "tool-call",
    server: agentDemoToolServer,
    tool: "screenshot",
    args: "returnFormat: path",
  },
  {
    id: "screenshot-out",
    startMs: 143_000,
    phase: "validate",
    kind: "tool-output",
    lines: ["Final proof frame captured", "Severe storm watch visible above New Orleans"],
  },
  {
    id: "final-summary",
    startMs: 144_000,
    phase: "validate",
    kind: "agent",
    text: "Done: built the feature, drove the simulator, checked logs, debugged the predicate with LLDB, fixed it, and validated the banner on a stormy location.",
  },
];
