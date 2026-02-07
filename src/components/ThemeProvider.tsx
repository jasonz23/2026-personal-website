"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { ThemeContext, type Theme } from "@/hooks/useTheme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved || "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  // Prevent flash: render children immediately but theme context updates on mount
  return (
    <ThemeContext.Provider
      value={{ theme: mounted ? theme : "light", toggle, isDark: theme === "dark" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
