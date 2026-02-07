"use client";

import { createContext, useContext } from "react";

export interface PanelContextValue {
  openPanels: string[];
  setOpenPanels: (panels: string[]) => void;
  focusPanel: (panel: string) => void;
  ensureOpen: (panel: string) => void;
}

export const PanelContext = createContext<PanelContextValue>({
  openPanels: ["readme", "wave", "terminal", "links"],
  setOpenPanels: () => {},
  focusPanel: () => {},
  ensureOpen: () => {},
});

export function usePanels() {
  return useContext(PanelContext);
}
