"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ReactTyped } from "react-typed";
import { usePanels } from "@/hooks/usePanels";
import { LINKS } from "@/constants/links";
import { getNode } from "@/constants/fileSystem";

const PANELS = [
  { id: "readme", label: "README.TXT" },
  { id: "wave", label: "WEBGL.WAVE" },
  { id: "terminal", label: "TERMINAL" },
  { id: "links", label: "NAVIGATION" },
] as const;

interface HeaderMenuProps {
  onNavigate?: (cmd: string) => void;
  onTypingChange?: (cmd: string | null) => void;
}

export default function HeaderMenu({
  onNavigate,
  onTypingChange,
}: HeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const [typingLink, setTypingLink] = useState<string | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const pendingPathRef = useRef<string | null>(null);
  const { focusPanel, ensureOpen } = usePanels();
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
      setOpen(false);
    },
    [startTyping, ensureOpen],
  );

  const handleExternalClick = useCallback(
    (href: string, name: string) => {
      pendingHrefRef.current = href;
      startTyping(`open ${name.toLowerCase()}`);
      setOpen(false);
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
    <div className="relative md:hidden" ref={menuRef}>
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
        <div className="absolute right-0 top-full mt-1 z-50 border border-(--grid-accent) bg-(--grid-panel-bg) shadow-lg min-w-[200px] max-h-[70vh] overflow-y-auto">
          <div className="px-3 py-1.5 text-[9px] tracking-widest uppercase text-(--grid-accent) opacity-60 border-b border-(--grid-accent)">
            PANELS
          </div>
          {PANELS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                focusPanel(id);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[11px] tracking-widest uppercase text-(--grid-accent) hover:bg-(--grid-accent-dim) transition-colors cursor-pointer border-b border-(--grid-accent)"
            >
              {label}
            </button>
          ))}
          <div className="px-3 py-1.5 text-[9px] tracking-widest uppercase text-(--grid-accent) opacity-60 border-b border-(--grid-accent)">
            NAVIGATION
          </div>
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
              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] tracking-widest uppercase text-(--grid-accent) hover:bg-(--grid-accent-dim) transition-colors cursor-pointer border-b border-(--grid-accent) last:border-b-0 disabled:opacity-50"
            >
              <span className="text-[10px] font-bold shrink-0">
                {link.external ? "[>]" : link.isFile ? "[#]" : "[/]"}
              </span>
              <span>{link.name}</span>
              {link.external && (
                <svg
                  className="w-3 h-3 ml-auto opacity-60"
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
      )}

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
