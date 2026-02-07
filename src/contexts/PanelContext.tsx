"use client";

import { useState, useCallback, type ReactNode } from "react";
import { PanelContext } from "@/hooks/usePanels";

const ALL_PANELS = ["wave", "readme", "links", "terminal"];

export default function PanelProvider({ children }: { children: ReactNode }) {
  const [openPanels, setOpenPanels] = useState<string[]>([]);

  const focusPanel = useCallback((panel: string) => {
    setOpenPanels([panel]);
  }, []);

  const ensureOpen = useCallback((panel: string) => {
    setOpenPanels((prev) => (prev.includes(panel) ? prev : [...prev, panel]));
  }, []);

  const revealPanels = useCallback(() => {
    ALL_PANELS.forEach((panel, i) => {
      setTimeout(
        () => {
          setOpenPanels((prev) => [...prev, panel]);
        },
        400 + i * 150,
      );
    });
  }, []);

  return (
    <PanelContext.Provider
      value={{
        openPanels,
        setOpenPanels,
        focusPanel,
        ensureOpen,
        revealPanels,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
