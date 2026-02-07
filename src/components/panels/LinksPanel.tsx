"use client";

import { useState, useRef, useCallback } from "react";
import { ReactTyped } from "react-typed";
import { LINKS } from "@/constants/links";
import { getNode } from "@/constants/fileSystem";
import { usePanels } from "@/hooks/usePanels";

interface LinksPanelProps {
  onNavigate?: (cmd: string) => void;
  onTypingChange?: (cmd: string | null) => void;
}

export default function LinksPanel({
  onNavigate,
  onTypingChange,
}: LinksPanelProps) {
  const [typingLink, setTypingLink] = useState<string | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const pendingPathRef = useRef<string | null>(null);
  const { ensureOpen } = usePanels();

  const startTyping = useCallback(
    (cmd: string) => {
      setTypingLink(cmd);
      onTypingChange?.(cmd);
    },
    [onTypingChange],
  );

  const stopTyping = useCallback(() => {
    setTypingLink(null);
    onTypingChange?.(null);
  }, [onTypingChange]);

  const handleInternalClick = useCallback(
    (path: string, isFile: boolean) => {
      const cmd = isFile ? `cat ${path}` : `cd ${path}`;
      pendingPathRef.current = path;
      ensureOpen("terminal");
      startTyping(cmd);
    },
    [startTyping, ensureOpen],
  );

  const handleExternalClick = useCallback(
    (href: string, name: string) => {
      pendingHrefRef.current = href;
      startTyping(`open ${name.toLowerCase()}`);
    },
    [startTyping],
  );

  const handleTypeComplete = useCallback(() => {
    const cmd = typingLink;
    if (pendingHrefRef.current) {
      window.open(pendingHrefRef.current, "_blank", "noopener,noreferrer");
      pendingHrefRef.current = null;
    } else if (cmd && onNavigate) {
      onNavigate(cmd);

      // Auto-open readme panel if the destination has readme content
      const path = pendingPathRef.current;
      if (path) {
        const node = getNode(path);
        const hasReadme =
          node?.type === "file"
            ? !!node.content
            : !!node?.children?.["README.md"];
        if (hasReadme) {
          ensureOpen("readme");
        }
      }
    }
    pendingPathRef.current = null;
    setTimeout(() => stopTyping(), 300);
  }, [typingLink, onNavigate, stopTyping, ensureOpen]);

  return (
    <div className="p-4 md:p-5 flex flex-col h-full">
      <div className="space-y-2 flex-1">
        {LINKS.map((link, i) => (
          <button
            key={i}
            onClick={() => {
              if (typingLink) return;
              if (link.external) {
                handleExternalClick(link.href!, link.name);
              } else {
                handleInternalClick(link.path!, link.isFile || false);
              }
            }}
            disabled={typingLink !== null}
            className="w-full flex items-center gap-3 px-3 py-2 border border-[var(--grid-accent-dim)] hover:border-[var(--grid-accent)] hover:bg-[var(--grid-accent-dim)] transition-all text-left group cursor-pointer disabled:opacity-50"
          >
            <span className="text-[var(--grid-accent)] text-xs font-bold shrink-0">
              {link.external ? "[>]" : link.isFile ? "[#]" : "[/]"}
            </span>
            <span className="text-foreground text-sm tracking-wide group-hover:text-[var(--grid-accent)] transition-colors">
              {link.name}
            </span>
            {link.external && (
              <svg
                className="w-3 h-3 ml-auto text-term-dim group-hover:text-[var(--grid-accent)] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Hidden ReactTyped - drives the typing logic but display is in WavePanel */}
      {typingLink && (
        <div className="sr-only" aria-hidden="true">
          <ReactTyped
            strings={[typingLink]}
            typeSpeed={40}
            showCursor={false}
            onComplete={handleTypeComplete}
          />
        </div>
      )}
    </div>
  );
}
