"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { PanelContext } from "@/hooks/usePanels";
import { useIsMobile } from "@/hooks/useIsMobile";

const ALL_PANELS = ["wave", "readme", "links", "terminal"];
const ALL_PANELS_MOBILE = ["links", "terminal", "wave", "readme"];

export default function PanelProvider({ children }: { children: ReactNode }) {
  const [openPanels, setOpenPanels] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const isMobileRef = useRef(isMobile);
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  const focusPanel = useCallback((panel: string) => {
    setOpenPanels([panel]);
  }, []);

  const ensureOpen = useCallback((panel: string) => {
    setOpenPanels((prev) => (prev.includes(panel) ? prev : [...prev, panel]));
  }, []);

  const revealPanels = useCallback(() => {
    const panels = isMobileRef.current ? ALL_PANELS_MOBILE : ALL_PANELS;
    panels.forEach((panel, i) => {
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
