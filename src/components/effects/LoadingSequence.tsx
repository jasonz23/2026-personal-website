"use client";

import { useState, useEffect, useRef } from "react";

type Phase = "black" | "drawing" | "loading" | "fading" | "complete";

const TIMINGS = {
  blackDuration: 500,
  drawDuration: 1500,
  loadDuration: 1000,
  fadeDuration: 500,
};

interface LoadingSequenceProps {
  onComplete?: () => void;
}

export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [phase, setPhase] = useState<Phase>("black");
  const [progress, setProgress] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("complete");
      onComplete?.();
      return;
    }

    // Phase transitions
    const t1 = setTimeout(() => setPhase("drawing"), TIMINGS.blackDuration);
    const t2 = setTimeout(
      () => setPhase("loading"),
      TIMINGS.blackDuration + TIMINGS.drawDuration,
    );
    const t3 = setTimeout(
      () => {
        setPhase("fading");
        onComplete?.();
      },
      TIMINGS.blackDuration + TIMINGS.drawDuration + TIMINGS.loadDuration,
    );
    const t4 = setTimeout(
      () => setPhase("complete"),
      TIMINGS.blackDuration +
        TIMINGS.drawDuration +
        TIMINGS.loadDuration +
        TIMINGS.fadeDuration,
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Animate loading bar progress
  useEffect(() => {
    if (phase !== "loading") return;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / TIMINGS.loadDuration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(animate);
    };
    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  if (phase === "complete") return null;

  // Grid lines for the border drawing animation
  // We draw: outer border, horizontal center divider, vertical center divider
  const gridLines: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    delay: number;
    dim?: boolean;
  }[] = [
    // Outer border - top
    { x1: 0, y1: 0, x2: 100, y2: 0, delay: 0 },
    // Outer border - right
    { x1: 100, y1: 0, x2: 100, y2: 100, delay: 0.1 },
    // Outer border - bottom
    { x1: 100, y1: 100, x2: 0, y2: 100, delay: 0.2 },
    // Outer border - left
    { x1: 0, y1: 100, x2: 0, y2: 0, delay: 0.3 },
    // Horizontal center divider
    { x1: 0, y1: 50, x2: 100, y2: 50, delay: 0.5, dim: true },
    // Vertical center divider
    { x1: 50, y1: 0, x2: 50, y2: 100, delay: 0.5, dim: true },
    // Header bar line (top)
    { x1: 0, y1: 5, x2: 100, y2: 5, delay: 0.7 },
    // Status bar line (bottom)
    { x1: 0, y1: 95, x2: 100, y2: 95, delay: 0.7 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "#000",
        opacity: phase === "fading" ? 0 : 1,
        transition:
          phase === "fading"
            ? `opacity ${TIMINGS.fadeDuration}ms ease-out`
            : "none",
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      {/* Border drawing SVG */}
      {(phase === "drawing" || phase === "loading" || phase === "fading") && (
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {gridLines.map((line, i) => {
            const dx = line.x2 - line.x1;
            const dy = line.y2 - line.y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            return (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="var(--grid-accent, #1e40af)"
                strokeWidth="1"
                strokeDasharray={length}
                strokeDashoffset={length}
                opacity={line.dim ? 0.3 : 1}
                style={{
                  animation: `drawLine ${TIMINGS.drawDuration * 0.6}ms ease-out ${line.delay * TIMINGS.drawDuration}ms forwards`,
                }}
              />
            );
          })}
        </svg>
      )}

      {/* Loading bar */}
      {(phase === "loading" || phase === "fading") && (
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="text-(--grid-accent,#1e40af) text-xs tracking-[0.3em] uppercase font-mono animate-[fadeIn_0.3s_ease-out]">
            INITIALIZING SYSTEMS
          </div>
          <div className="w-64 h-0.5 bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#ffffff] transition-none"
              style={{
                width: `${progress * 100}%`,
                boxShadow:
                  "0 0 10px var(--grid-accent-glow, rgba(30,64,175,0.3))",
              }}
            />
          </div>
          <div className="text-white/30 text-[10px] font-mono tabular-nums">
            {Math.round(progress * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}
