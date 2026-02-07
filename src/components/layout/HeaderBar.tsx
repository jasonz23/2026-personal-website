"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderMenu from "./HeaderMenu";

export default function HeaderBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-(--grid-header-bg) border-b border-[var(--grid-accent)] shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-(--header-text) font-bold text-sm tracking-widest">
          JASON ZHAO
        </span>
        <span className="text-(--grid-header-text) text-xs opacity-60 hidden sm:inline">
          OS | 012
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-(--grid-header-text)">
        <span className="text-(--header-text) hidden sm:inline tracking-wider">
          SYSTEM ONLINE
        </span>
        <span className="opacity-60 hidden sm:inline">...</span>
        <span className="font-mono opacity-80 tabular-nums">{time}</span>
        <ThemeToggle />
        <HeaderMenu />
      </div>
    </div>
  );
}
