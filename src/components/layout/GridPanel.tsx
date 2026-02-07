"use client";

import type { ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";

interface GridPanelProps {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
  rightLabel?: string;
}

export default function GridPanel({ value, title, children, className = "", rightLabel }: GridPanelProps) {
  return (
    <Accordion.Item
      value={value}
      className={`border border-[var(--grid-accent)] bg-[var(--grid-panel-bg)] flex flex-col overflow-hidden data-[state=open]:min-h-[250px] data-[state=open]:md:min-h-0 data-[state=open]:md:flex-1 data-[state=closed]:shrink-0 transition-[flex-grow] duration-300 ease-in-out ${className}`}
      style={{ boxShadow: "0 0 8px var(--grid-accent-glow)" }}
    >
      <Accordion.Header asChild>
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--grid-accent)] bg-[var(--grid-accent-dim)] shrink-0 cursor-pointer select-none">
          <Accordion.Trigger className="group flex items-center gap-2 flex-1 text-left cursor-pointer">
            <svg
              className="w-3 h-3 text-[var(--grid-accent)] transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[11px] tracking-widest uppercase text-[var(--grid-accent)] font-bold">
              {title}
            </span>
          </Accordion.Trigger>
          {rightLabel && (
            <span className="text-[10px] tracking-wider uppercase text-[var(--grid-accent)]">
              {rightLabel}
            </span>
          )}
        </div>
      </Accordion.Header>
      <Accordion.Content
        forceMount
        className="grid min-h-0 overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out data-[state=open]:grid-rows-[1fr] data-[state=open]:flex-1 data-[state=closed]:grid-rows-[0fr]"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="h-full overflow-auto">
            {children}
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
