import type {
  AgentDiffLine,
  AgentPhase,
  AgentPhaseId,
  AgentTranscriptEvent,
} from "./agent-demo-data";

export function formatTimestamp(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function formatRate(rate: number) {
  return rate % 1 === 0 ? String(rate) : rate.toFixed(1);
}

export function SpeedBadge({
  rate,
  onClick,
}: {
  rate: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-sentry-purple/30 bg-sentry-purple/10 px-2.5 py-1 font-mono text-[11px] transition hover:border-sentry-purple/60 hover:bg-sentry-purple/20"
      aria-label="Change demo playback speed"
    >
      <span className="text-sentry-text-muted">speed</span>
      <span className="text-sentry-purple-light">»</span>
      <span className="text-white">{formatRate(rate)}x</span>
    </button>
  );
}

export function PromptBox({
  currentTimeMs,
  prompt,
  submitMs,
}: {
  currentTimeMs: number;
  prompt: string;
  submitMs: number;
}) {
  const isSubmitted = currentTimeMs >= submitMs;
  const typedPrompt = isSubmitted
    ? ""
    : prompt.slice(0, Math.floor((currentTimeMs / submitMs) * prompt.length));

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg border border-sentry-purple/20 bg-black/30 px-3 py-1.5 font-mono text-[12px]">
        <span className="text-sentry-purple-light">{">"}</span>
        <span
          className={`min-h-4 min-w-0 flex-1 truncate ${
            typedPrompt ? "text-sentry-text-primary" : "text-sentry-text-muted/45"
          }`}
          aria-label={isSubmitted ? "Prompt input cleared" : "Prompt input"}
        >
          {typedPrompt}
          {!isSubmitted ? <span className="term-caret" /> : null}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 font-mono text-[10.5px] text-sentry-text-muted">
        <span className="text-green-400">⏵⏵</span>
        <span>{isSubmitted ? "prompt sent" : "press return to start"}</span>
        <span className="text-sentry-text-muted/70">
          {isSubmitted ? "(agent continues unattended)" : "(single user action)"}
        </span>
      </div>
    </div>
  );
}

export function PhaseStepper({
  phases,
  activeId,
  isComplete,
}: {
  phases: AgentPhase[];
  activeId: AgentPhaseId;
  isComplete: boolean;
}) {
  const activeIndex = Math.max(
    0,
    phases.findIndex((phase) => phase.id === activeId),
  );
  const active = phases[activeIndex];

  return (
    <div>
      <div className="flex items-center gap-1.5">
        {phases.map((phase, index) => (
          <span
            key={phase.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${segmentClass(
              index,
              activeIndex,
              isComplete,
            )}`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
        <span className="text-sentry-text-secondary">{active?.label}</span>
        <span className="text-sentry-text-muted">
          phase {activeIndex + 1} of {phases.length}
        </span>
      </div>
    </div>
  );
}

function segmentClass(
  index: number,
  activeIndex: number,
  isComplete: boolean,
) {
  if (isComplete || index < activeIndex) return "bg-green-400/70";
  if (index === activeIndex) return "bg-sentry-purple-light";
  return "bg-sentry-dark-600/70";
}

export function TerminalRow({ event }: { event: AgentTranscriptEvent }) {
  return (
    <div className={`term-row ${rowSpacingClass(event)}`}>
      <TerminalRowBody event={event} />
    </div>
  );
}

function rowSpacingClass(event: AgentTranscriptEvent) {
  if (event.kind === "tool-output") return "mt-0.5";
  if (event.kind === "tool-call") return "mt-1";
  return "mt-3 first:mt-0";
}

function TerminalRowBody({ event }: { event: AgentTranscriptEvent }) {
  switch (event.kind) {
    case "prompt":
      return (
        <div className="flex gap-2 border-l border-sentry-purple/40 pl-3 text-sentry-text-primary">
          <span className="select-none text-sentry-purple-light">{">"}</span>
          <span className="whitespace-pre-wrap break-words">{event.text}</span>
        </div>
      );

    case "agent":
      return (
        <div className="flex gap-2">
          <span className="select-none text-white/80">●</span>
          <span className="text-sentry-text-primary">{event.text}</span>
        </div>
      );

    case "tool-call":
      return (
        <div className="flex gap-2">
          <span className="select-none text-green-400">●</span>
          <span className="break-words">
            {event.server ? (
              <>
                <span className="text-sentry-text-secondary">
                  {event.server}
                </span>
                <span className="text-sentry-text-muted"> :: </span>
              </>
            ) : null}
            <span className="font-semibold text-sentry-text-primary">
              {event.tool}
            </span>
            {event.args ? (
              <span className="text-sentry-text-muted">({event.args})</span>
            ) : null}
          </span>
        </div>
      );

    case "tool-output":
      return (
        <div className="text-sentry-text-muted">
          {(event.lines ?? []).map((line, index) => (
            <div key={index} className="flex gap-2">
              <span className="select-none text-sentry-text-muted/60">
                {index === 0 ? "⎿" : " "}
              </span>
              <span className="whitespace-pre-wrap break-words">{line}</span>
            </div>
          ))}
          {event.more ? (
            <div className="pl-5 text-sentry-text-muted/60">… {event.more}</div>
          ) : null}
        </div>
      );

    case "status": {
      const isCompleted = event.status === "completed";

      return (
        <div
          className={`flex gap-2 ${
            isCompleted ? "text-green-400" : "text-sentry-pink"
          }`}
        >
          <span
            className={`${
              isCompleted ? "" : "term-status-star"
            } select-none`}
          >
            {isCompleted ? "✓" : "✱"}
          </span>
          <span>
            {event.text}
            {isCompleted ? null : "…"}
          </span>
        </div>
      );
    }

    case "diff":
      return <DiffHunk file={event.file} diff={event.diff ?? []} />;

    default:
      return null;
  }
}

function DiffHunk({
  file,
  diff,
}: {
  file?: string;
  diff: AgentDiffLine[];
}) {
  return (
    <div className="my-1 overflow-hidden rounded-md border border-sentry-dark-600/70 bg-black/40">
      {file ? (
        <div className="border-b border-sentry-dark-600/60 px-3 py-1 text-[11px] text-sentry-text-muted">
          {file}
        </div>
      ) : null}
      <div className="py-1 text-[11px] leading-5">
        {diff.map((line, index) => (
          <div
            key={index}
            className={`flex gap-2 px-3 ${diffLineClass(line.kind)}`}
          >
            <span className="select-none opacity-70">{diffSign(line.kind)}</span>
            <span className="whitespace-pre">{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function diffLineClass(kind: AgentDiffLine["kind"]) {
  if (kind === "added") return "bg-green-500/10 text-green-300";
  if (kind === "removed") return "bg-red-500/10 text-red-300";
  return "text-sentry-text-muted";
}

function diffSign(kind: AgentDiffLine["kind"]) {
  if (kind === "added") return "+";
  if (kind === "removed") return "-";
  return " ";
}
