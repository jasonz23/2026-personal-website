"use client";

import { useState, useRef, useEffect } from "react";
import { usePanels } from "@/hooks/usePanels";

const PANELS = [
  { id: "readme", label: "README.TXT" },
  { id: "wave", label: "WEBGL.WAVE" },
  { id: "terminal", label: "TERMINAL" },
  { id: "links", label: "NAVIGATION" },
] as const;

export default function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const { focusPanel } = usePanels();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-8 h-8 flex items-center justify-center border border-(--grid-accent) text-(--header-text) hover:bg-(--grid-accent-dim) transition-colors cursor-pointer"
        aria-label="Panel menu"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="2" y1="4" x2="14" y2="4" />
          <line x1="2" y1="8" x2="14" y2="8" />
          <line x1="2" y1="12" x2="14" y2="12" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 border border-(--grid-accent) bg-(--grid-panel-bg) shadow-lg min-w-[160px]">
          {PANELS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                focusPanel(id);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[11px] tracking-widest uppercase text-(--grid-accent) hover:bg-(--grid-accent-dim) transition-colors cursor-pointer border-b border-(--grid-accent) last:border-b-0"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
