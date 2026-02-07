"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center border border-(--grid-accent) text-(--grid-accent) hover:bg-(--grid-accent-dim) transition-colors cursor-pointer"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="3.5" />
          <line x1="8" y1="1" x2="8" y2="3" />
          <line x1="8" y1="13" x2="8" y2="15" />
          <line x1="1" y1="8" x2="3" y2="8" />
          <line x1="13" y1="8" x2="15" y2="8" />
          <line x1="3.05" y1="3.05" x2="4.46" y2="4.46" />
          <line x1="11.54" y1="11.54" x2="12.95" y2="12.95" />
          <line x1="3.05" y1="12.95" x2="4.46" y2="11.54" />
          <line x1="11.54" y1="4.46" x2="12.95" y2="3.05" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{
            color: "#D1D5DB",
          }}
        >
          <path d="M13.5 10.5a6 6 0 01-8-8 6 6 0 108 8z" />
        </svg>
      )}
    </button>
  );
}
