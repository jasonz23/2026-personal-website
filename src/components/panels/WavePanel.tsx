"use client";

import { useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useWaveGL } from "@/hooks/useWaveGL";
import { usePanels } from "@/hooks/usePanels";
import { ReactTyped } from "react-typed";

interface WavePanelProps {
  typingCmd: string | null;
}

export default function WavePanel({ typingCmd }: WavePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const { ensureOpen } = usePanels();

  useWaveGL(containerRef, {
    lightColor: "#1e40af",
    darkColor: "#22d3ee",
    isDark,
  });

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={containerRef}
        className="absolute inset-0 w-[150%] h-[120%] -translate-x-1/5"
      />
      <div className={`absolute top-3 left-3 right-3 ${typingCmd ? "pointer-events-none" : ""}`}>
        {typingCmd ? (
          <div className="text-(--grid-accent) text-sm font-mono tracking-wide">
            <span className="text-term-dim">$ </span>
            <ReactTyped
              strings={[typingCmd]}
              typeSpeed={40}
              showCursor={true}
              cursorChar="▋"
            />
          </div>
        ) : (
          <button
            onClick={() => ensureOpen("links")}
            className="text-term-dim text-xs tracking-widest uppercase hover:text-(--grid-accent) transition-colors cursor-pointer"
          >
            SELECT A DESTINATION ...
          </button>
        )}
      </div>
      <div className="absolute bottom-3 left-3 text-[10px] tracking-wider uppercase text-term-dim pointer-events-none">
        TERRAIN ANALYSIS // ACTIVE
      </div>
    </div>
  );
}
