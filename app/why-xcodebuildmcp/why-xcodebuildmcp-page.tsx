"use client";

import { useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  Code2,
  Eye,
  Github,
  Menu,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AgentDemo, AgentDemoStyles } from "./agent-demo";
import {
  appleToolchain,
  bashLines,
  benefits,
  mcpSteps,
  stories,
  tokenComparison,
} from "./why-xcodebuildmcp-data";

type TokenBadgeProps = {
  label: string;
  value: string;
  tone: "bash" | "mcp";
  className?: string;
  delta?: string;
};

function TokenBadge({
  label,
  value,
  tone,
  className = "",
  delta,
}: TokenBadgeProps) {
  const toneClassName =
    tone === "bash"
      ? "border-red-500/30 ring-red-500/10"
      : "border-green-400/30 ring-green-400/10";
  const accentClassName = tone === "bash" ? "bg-red-400" : "bg-green-400";

  return (
    <div
      className={`${className} z-10 inline-flex items-center gap-3 rounded-2xl border bg-sentry-dark-300/95 px-4 py-2.5 shadow-lg shadow-black/40 ring-1 backdrop-blur ${toneClassName}`}
    >
      <span className={`h-9 w-1 rounded-full ${accentClassName}`} />
      <div className="leading-none">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-sentry-text-secondary">
          {label}
        </span>
        <span className="mt-1.5 block text-lg font-bold text-white">
          {value}
        </span>
      </div>
      {delta ? (
        <span className="ml-1 rounded-full bg-green-400/15 px-2 py-1 text-xs font-semibold text-green-300">
          {delta}
        </span>
      ) : null}
    </div>
  );
}

export function WhyXcodeBuildMCPPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-sentry-dark-100 text-sentry-text-primary">
      <header className="sticky top-0 z-50 border-b border-sentry-dark-600/50 bg-sentry-dark-100/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.png"
                alt="XcodeBuildMCP"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="text-lg font-semibold tracking-tight">
                XcodeBuildMCP
              </span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <Link
                href="/#features"
                className="text-sm text-sentry-text-secondary transition-colors hover:text-white"
              >
                Features
              </Link>
              <Link
                href="/#see-it-in-action"
                className="text-sm text-sentry-text-secondary transition-colors hover:text-white"
              >
                See it in Action
              </Link>
              <Link
                href="/#xcode-integration"
                className="text-sm text-sentry-text-secondary transition-colors hover:text-white"
              >
                Xcode Integration
              </Link>
              <Link
                href="/why-xcodebuildmcp"
                className="text-sm text-white transition-colors"
              >
                Why XcodeBuildMCP?
              </Link>
              <Link
                href="/docs"
                className="text-sm text-sentry-text-secondary transition-colors hover:text-white"
              >
                Docs
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/getsentry/XcodeBuildMCP"
                className="hidden items-center gap-2 text-sm text-sentry-text-secondary transition-colors hover:text-white sm:flex"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
              <Link
                href="/#get-started"
                className="hidden items-center gap-2 rounded-lg bg-sentry-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sentry-purple-deep sm:inline-flex"
              >
                Get Started
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                className="p-2 text-sentry-text-secondary transition-colors hover:text-white md:hidden"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen ? (
            <div className="border-t border-sentry-dark-600/50 pb-6 pt-4 md:hidden">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sentry-text-secondary transition-colors hover:text-white"
                >
                  Features
                </Link>
                <Link
                  href="/#see-it-in-action"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sentry-text-secondary transition-colors hover:text-white"
                >
                  See it in Action
                </Link>
                <Link
                  href="/#xcode-integration"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sentry-text-secondary transition-colors hover:text-white"
                >
                  Xcode Integration
                </Link>
                <Link
                  href="/why-xcodebuildmcp"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white transition-colors"
                >
                  Why XcodeBuildMCP?
                </Link>
                <Link
                  href="/docs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sentry-text-secondary transition-colors hover:text-white"
                >
                  Docs
                </Link>
              </nav>
            </div>
          ) : null}
        </div>
      </header>

      <main>
        <section
          id="live-demo"
          className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="absolute left-1/2 top-0 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-sentry-purple/15 blur-[150px]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Stop feeding agents raw Xcode output.
                <span className="block bg-gradient-to-r from-sentry-purple via-sentry-purple-light to-sentry-pink bg-clip-text text-transparent">
                  Give them the simulator.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-sentry-text-secondary sm:text-xl">
                XcodeBuildMCP does not replace Xcode or xcodebuild. It
                orchestrates Apple&apos;s own tools into a closed loop: chat
                request, tool call, simulator interaction, managed logs,
                debugger state, and proof the agent can explain back to you
                without dumping raw build output into the conversation.
              </p>
              <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
                {appleToolchain.map((tool) => (
                  <span key={tool} className="rounded-full border border-sentry-purple/25 bg-sentry-purple/10 px-3 py-1 text-xs font-medium text-sentry-purple-light">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <AgentDemo />
          </div>
        </section>

        <section id="why-not-bash" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Agents need more than shell access.
              </h2>
              <p className="mt-4 text-lg leading-8 text-sentry-text-secondary">
                Agentic iOS work is not one build command. It is build,
                install, launch, inspect UI, capture logs, debug, fix, and
                validate. A shell can run commands, but it does not remember the
                project, reduce noise, manage debug state, or turn UI into
                something an agent can reason about.
              </p>
            </div>
            <div className="grid gap-10 pt-8 lg:grid-cols-2 lg:gap-6">
              <div className="relative rounded-2xl border border-red-500/20 bg-red-500/5 p-6 pt-10">
                <TokenBadge
                  className="absolute -top-5 right-5"
                  label={tokenComparison.bash.label}
                  value={tokenComparison.bash.value}
                  tone="bash"
                />
                <div className="mb-5 flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-red-300" />
                  <h3 className="text-xl font-semibold">Ad-hoc shell loop</h3>
                </div>
                <div className="space-y-3 font-mono text-xs text-sentry-text-secondary">
                  {bashLines.map((line) => (
                    <div
                      key={line}
                      className="rounded-lg bg-sentry-dark-100/80 p-3"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl border border-green-400/20 bg-green-400/5 p-6 pt-10">
                <TokenBadge
                  className="absolute -top-5 right-5"
                  label={tokenComparison.mcp.label}
                  value={tokenComparison.mcp.value}
                  tone="mcp"
                  delta="less noise"
                />
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <h3 className="text-xl font-semibold">
                    Agentic tool contract
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-sentry-text-secondary">
                  {mcpSteps.map((step) => (
                    <div
                      key={step}
                      className="flex items-start gap-3 rounded-xl bg-sentry-dark-100/80 p-4"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-sentry-text-secondary">
              In this illustrative loop, XcodeBuildMCP returns a{" "}
              <span className="font-semibold text-green-300">
                {tokenComparison.summary}
              </span>{" "}
              instead of asking the agent to parse every transcript line.
            </p>
          </div>
        </section>

        <section id="benefits" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Why agents do better with XcodeBuildMCP
              </h2>
              <p className="mt-4 text-lg leading-8 text-sentry-text-secondary">
                It breaks the Xcode IDE bottleneck while keeping Apple&apos;s
                toolchain as the source of truth. Results are schema-backed and
                versioned; see the{" "}
                <Link href="/docs/schemas" className="font-semibold text-sentry-purple-light underline decoration-sentry-purple-light/40 underline-offset-4 hover:text-white">
                  published schema browser
                </Link>.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="group rounded-2xl border border-sentry-dark-600/50 bg-sentry-dark-200/60 p-6 transition-all hover:-translate-y-1 hover:border-sentry-purple/50 hover:bg-sentry-dark-300/80 hover:shadow-2xl hover:shadow-sentry-purple/10"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sentry-purple/10 text-sentry-purple-light group-hover:bg-sentry-purple group-hover:text-white">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-sentry-text-secondary">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {stories.map((story) => (
              <div
                key={story.role}
                className="rounded-2xl border border-sentry-dark-600/60 bg-gradient-to-br from-sentry-dark-300/80 to-sentry-dark-200/50 p-7"
              >
                <p className="text-sm font-medium text-sentry-purple-light">
                  {story.role}
                </p>
                <h3 className="mt-3 text-2xl font-bold">{story.title}</h3>
                <p className="mt-4 leading-7 text-sentry-text-secondary">
                  {story.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-sentry-purple/25 bg-gradient-to-br from-sentry-purple/20 via-sentry-dark-300 to-sentry-pink/10 p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Code2 className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">Give the agent hands and eyes.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-sentry-text-secondary">
              Use MCP for live collaboration. Use the CLI for deterministic
              scripts. Either way, your agent gets a purpose-built Xcode
              interface instead of a pile of terminal output.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/docs/setup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-sentry-dark-100 hover:bg-sentry-text-primary"
              >
                Start with setup <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs/demos"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 font-medium text-white hover:bg-white/10"
              >
                See demos <Eye className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-4xl text-center text-xs leading-6 text-sentry-text-muted">
            Demo workflow is illustrative, not a benchmark. It is
            representative of a real agent-assisted session using XcodeBuildMCP,
            but it has been simplified for clarity. Output volume and exact tool
            behavior vary by task, project, build settings, and agent client.
          </p>
        </section>
      </main>

      <footer className="border-t border-sentry-dark-600/30 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="XcodeBuildMCP" width={20} height={20} className="h-5 w-5" />
              <span className="text-sm font-medium">XcodeBuildMCP</span>
              <span className="text-sm text-sentry-text-muted">&copy; {new Date().getFullYear()} Sentry</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="https://sentry.io" className="text-sm text-sentry-text-muted transition-colors hover:text-white">
                Sentry
              </Link>
              <Link
                href="https://x.com/xcodebuildmcp"
                className="flex items-center gap-1.5 text-sm text-sentry-text-muted transition-colors hover:text-white"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @xcodebuildmcp
              </Link>
              <Link
                href="https://github.com/getsentry/XcodeBuildMCP"
                className="flex items-center gap-1.5 text-sm text-sentry-text-muted transition-colors hover:text-white"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <AgentDemoStyles />
    </div>
  );
}
