"use client";

import type { MutableRefObject } from "react";
import Terminal from "@/components/Terminal";

interface TerminalPanelProps {
  onCommandRef?: MutableRefObject<((cmd: string) => void) | null>;
  initialCwd?: string;
  onCwdChange?: (cwd: string) => void;
  onCommandComplete?: () => void;
}

export default function TerminalPanel({ onCommandRef, initialCwd, onCwdChange, onCommandComplete }: TerminalPanelProps) {
  return (
    <div className="h-full w-full">
      <Terminal
        onCommandRef={onCommandRef}
        initialCwd={initialCwd}
        onCwdChange={onCwdChange}
        onCommandComplete={onCommandComplete}
      />
    </div>
  );
}
