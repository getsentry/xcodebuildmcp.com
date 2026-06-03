"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  agentDemoPhases,
  agentDemoPlaybackRate,
  agentDemoPrompt,
  agentDemoPromptSubmitMs,
  agentDemoVideo,
  agentTranscriptEvents,
} from "./agent-demo-data";
import {
  formatTimestamp,
  PhaseStepper,
  PromptBox,
  SpeedBadge,
  TerminalRow,
} from "./agent-demo-terminal";

const PIN_THRESHOLD_PX = 48;
const PLAYBACK_RATES = [1, 2, 3] as const;
const FINAL_TRANSCRIPT_START_MS =
  agentTranscriptEvents[agentTranscriptEvents.length - 1]?.startMs ??
  agentDemoVideo.durationMs;

function useInView<T extends Element>(threshold = 0.6): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export function AgentDemo() {
  const [demoRef, isDemoInView] = useInView<HTMLDivElement>(0.6);
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const isPinnedRef = useRef(true);

  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [motionPreferenceKnown, setMotionPreferenceKnown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(agentDemoPlaybackRate);

  const visibleEvents = useMemo(
    () =>
      agentTranscriptEvents.filter((event) => {
        if (isReducedMotion) return event.status !== "running";
        if (event.status === "running") {
          return (
            event.startMs <= currentTimeMs &&
            currentTimeMs < (event.endMs ?? Number.POSITIVE_INFINITY)
          );
        }

        return event.startMs <= currentTimeMs;
      }),
    [currentTimeMs, isReducedMotion],
  );

  const activePhaseId =
    visibleEvents.length > 0
      ? visibleEvents[visibleEvents.length - 1].phase
      : agentDemoPhases[0].id;

  const isPhaseStepperComplete =
    isReducedMotion || currentTimeMs >= FINAL_TRANSCRIPT_START_MS;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setIsReducedMotion(media.matches);
      setMotionPreferenceKnown(true);
    };

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!motionPreferenceKnown || !video) return;

    if (isReducedMotion || !isDemoInView) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    void video.play().catch(() => setIsPlaying(false));
  }, [isDemoInView, isReducedMotion, motionPreferenceKnown]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (isReducedMotion || !isPinnedRef.current) return;

    const element = transcriptRef.current;
    if (!element) return;

    const animationFrame = window.requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight;
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isReducedMotion, visibleEvents.length]);

  return (
    <div
      ref={demoRef}
      className={`relative mx-auto max-w-7xl ${
        isReducedMotion ? "agent-demo-reduced" : ""
      }`}
    >
      <div className="absolute -inset-6 rounded-[2.4rem] bg-sentry-purple/20 blur-3xl" />
      <div className="absolute -inset-1 rounded-[2.2rem] bg-sentry-pink/10 blur-2xl" />
      <div className="relative grid items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="flex h-[620px] min-w-0 flex-col overflow-hidden rounded-[2rem] border border-sentry-purple/30 bg-[#0F0B1A]/95 shadow-2xl shadow-black/60 backdrop-blur-xl lg:h-[660px] xl:h-[700px]">
          <div className="flex items-center justify-between gap-4 border-b border-sentry-purple/15 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-sentry-pink" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="hidden font-mono text-xs text-sentry-text-muted sm:inline">
                claude :: atmos weather
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden font-mono text-[11px] text-sentry-text-muted sm:inline">
                {formatTimestamp(currentTimeMs)} /{" "}
                {formatTimestamp(agentDemoVideo.durationMs)}
              </span>
              <SpeedBadge rate={playbackRate} onClick={handleSpeedCycle} />
              <button
                type="button"
                onClick={handlePlaybackToggle}
                disabled={hasVideoError}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sentry-dark-600 bg-sentry-dark-100 text-sentry-text-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={isPlaying ? "Pause demo video" : "Play demo video"}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleReplay}
                disabled={hasVideoError}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sentry-dark-600 bg-sentry-dark-100 text-sentry-text-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Replay demo video"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div
            ref={transcriptRef}
            onScroll={handleTranscriptScroll}
            className="term-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 font-mono text-[12.5px] leading-6"
          >
            {visibleEvents.map((event) => (
              <TerminalRow key={event.id} event={event} />
            ))}
          </div>

          <div className="border-t border-sentry-purple/15 px-5 py-2.5">
            <PromptBox
              currentTimeMs={currentTimeMs}
              prompt={agentDemoPrompt}
              submitMs={agentDemoPromptSubmitMs}
            />
          </div>
          <div className="border-t border-sentry-purple/15 px-5 py-2.5">
            <PhaseStepper
              phases={agentDemoPhases}
              activeId={activePhaseId}
              isComplete={isPhaseStepperComplete}
            />
          </div>
        </section>

        <div className="flex min-w-0 items-center justify-center pb-4 pt-2 lg:h-[660px] lg:py-0 xl:h-[700px]">
          <PhoneFrame
            currentTimeMs={currentTimeMs}
            autoPlay={motionPreferenceKnown && !isReducedMotion && isDemoInView}
            hasVideoError={hasVideoError}
            onError={() => setHasVideoError(true)}
            onLoadedMetadata={handleVideoLoadedMetadata}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onSeeked={handleVideoTimeUpdate}
            onSeeking={handleVideoTimeUpdate}
            onTimeUpdate={handleVideoTimeUpdate}
            videoRef={videoRef}
          />
        </div>
      </div>
    </div>
  );

  function handleVideoLoadedMetadata() {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
    setCurrentTimeMs(Math.round(video.currentTime * 1000));
  }

  function handleVideoTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTimeMs(Math.round(video.currentTime * 1000));
  }

  function handleSpeedCycle() {
    setPlaybackRate((currentRate) => {
      const currentIndex = PLAYBACK_RATES.findIndex(
        (rate) => rate === currentRate,
      );
      const nextRate = PLAYBACK_RATES[(currentIndex + 1) % PLAYBACK_RATES.length];
      const video = videoRef.current;

      if (video) video.playbackRate = nextRate;

      return nextRate;
    });
  }

  function handlePlaybackToggle() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().catch(() => setIsPlaying(false));
      return;
    }

    video.pause();
  }

  function handleReplay() {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTimeMs(0);

    if (!isReducedMotion) {
      void video.play().catch(() => setIsPlaying(false));
    }
  }

  function handleTranscriptScroll() {
    const element = transcriptRef.current;
    if (!element) return;

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    isPinnedRef.current = distanceFromBottom < PIN_THRESHOLD_PX;
  }
}

type PhoneFrameProps = {
  autoPlay: boolean;
  currentTimeMs: number;
  hasVideoError: boolean;
  onError: () => void;
  onLoadedMetadata: () => void;
  onPause: () => void;
  onPlay: () => void;
  onSeeked: () => void;
  onSeeking: () => void;
  onTimeUpdate: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
};

function PhoneFrame({
  autoPlay,
  currentTimeMs,
  hasVideoError,
  onError,
  onLoadedMetadata,
  onPause,
  onPlay,
  onSeeked,
  onSeeking,
  onTimeUpdate,
  videoRef,
}: PhoneFrameProps) {
  return (
    <div className="relative w-[330px] max-w-full rounded-[2.9rem] bg-[#050505] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.75)] ring-1 ring-white/10 xl:w-[350px]">
      <div className="pointer-events-none absolute left-1/2 top-4 z-20 h-[25px] w-[86px] -translate-x-1/2 rounded-full bg-black/95 shadow-sm" />
      <div className="relative aspect-[720/1564] overflow-hidden rounded-[2.35rem] bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${agentDemoVideo.poster})` }}
        />
        {!hasVideoError ? (
          <video
            ref={videoRef}
            aria-label={agentDemoVideo.title}
            className="relative z-10 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay={autoPlay}
            poster={agentDemoVideo.poster}
            onError={onError}
            onLoadedMetadata={onLoadedMetadata}
            onPause={onPause}
            onPlay={onPlay}
            onSeeked={onSeeked}
            onSeeking={onSeeking}
            onTimeUpdate={onTimeUpdate}
          >
            <source src={agentDemoVideo.src} type="video/mp4" />
          </video>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center">
          <div className="h-1 w-24 rounded-full bg-black/30" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-black/20 to-transparent" />
        <span className="sr-only">{formatTimestamp(currentTimeMs)}</span>
      </div>
    </div>
  );
}

export function AgentDemoStyles() {
  return (
    <style jsx global>{`
      @keyframes term-row-in {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes term-status-pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.35;
        }
      }

      @keyframes term-caret-pulse {
        0%,
        45% {
          opacity: 1;
        }
        46%,
        100% {
          opacity: 0;
        }
      }

      .term-row {
        animation: term-row-in 260ms ease both;
      }

      .term-status-star {
        display: inline-block;
        animation: term-status-pulse 1s ease-in-out infinite;
      }

      .term-caret::after {
        content: "";
        display: inline-block;
        height: 1em;
        width: 0.55em;
        margin-left: 2px;
        border-right: 1px solid rgba(236, 232, 255, 0.86);
        vertical-align: -0.12em;
        animation: term-caret-pulse 1s steps(1, end) infinite;
      }

      .agent-demo-reduced .term-row,
      .agent-demo-reduced .term-status-star,
      .agent-demo-reduced .term-caret::after {
        animation: none;
      }

      .term-scroll {
        scrollbar-color: rgba(117, 83, 255, 0.28) transparent;
        scrollbar-width: thin;
        mask-image: linear-gradient(
          to bottom,
          transparent 0,
          black 20px,
          black calc(100% - 20px),
          transparent 100%
        );
      }

      .term-scroll::-webkit-scrollbar {
        width: 6px;
      }

      .term-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      .term-scroll::-webkit-scrollbar-thumb {
        background: rgba(117, 83, 255, 0.28);
        border-radius: 999px;
      }

      .term-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(117, 83, 255, 0.44);
      }

      @media (prefers-reduced-motion: reduce) {
        .term-row,
        .term-status-star,
        .term-caret::after {
          animation: none;
        }
      }
    `}</style>
  );
}
