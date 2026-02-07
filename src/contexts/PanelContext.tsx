"use client";

import { useState, useCallback, type ReactNode } from "react";
import { PanelContext } from "@/hooks/usePanels";

export default function PanelProvider({ children }: { children: ReactNode }) {
  const [openPanels, setOpenPanels] = useState<string[]>([
    "readme",
    "wave",
    "terminal",
    "links",
  ]);

  const focusPanel = useCallback((panel: string) => {
    setOpenPanels([panel]);
  }, []);

  const ensureOpen = useCallback((panel: string) => {
    setOpenPanels((prev) => (prev.includes(panel) ? prev : [...prev, panel]));
  }, []);

  return (
    <PanelContext.Provider
      value={{ openPanels, setOpenPanels, focusPanel, ensureOpen }}
    >
      {children}
    </PanelContext.Provider>
  );
}
