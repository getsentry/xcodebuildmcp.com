import type { Metadata } from "next";
import { WhyXcodeBuildMCPPage } from "./why-xcodebuildmcp-page";

export const metadata: Metadata = {
  title: "Why XcodeBuildMCP? Agentic Xcode Automation Beyond Bash",
  description:
    "Why AI agents use XcodeBuildMCP instead of ad-hoc xcodebuild and simctl commands: compact output, session defaults, managed logs, UI automation, LLDB, and deterministic CLI workflows.",
  openGraph: {
    title: "Why XcodeBuildMCP?",
    description:
      "See why XcodeBuildMCP gives AI agents a better Xcode feedback loop than raw shell commands.",
    url: "https://xcodebuildmcp.com/why-xcodebuildmcp",
  },
};

export default function Page() {
  return <WhyXcodeBuildMCPPage />;
}
