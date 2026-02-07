"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import HeaderBar from "./HeaderBar";
import StatusBar from "./StatusBar";
import GridPanel from "./GridPanel";
import AboutPanel from "@/components/panels/AboutPanel";
import TerminalPanel from "@/components/panels/TerminalPanel";
import WavePanel from "@/components/panels/WavePanel";
import LinksPanel from "@/components/panels/LinksPanel";
import { usePanels } from "@/hooks/usePanels";
import { useIsMobile } from "@/hooks/useIsMobile";

function pathToQuery(cwd: string): string {
  if (cwd === "~") return "";
  return cwd.replace(/^~\/?/, "").replace(/\.txt$/, "");
}

function queryToPath(query: string): string {
  if (!query) return "~";
  if (query === "resume") return "~/resume.txt";
  return `~/${query}`;
}

function getInitialPath(): string {
  if (typeof window === "undefined") return "~";
  const params = new URLSearchParams(window.location.search);
  const pathParam = params.get("path");
  return pathParam ? queryToPath(pathParam) : "~";
}

const LEFT_PANELS = ["readme", "wave"];
const RIGHT_PANELS = ["terminal", "links"];

export default function GridLayout() {
  const terminalCommandRef = useRef<((cmd: string) => void) | null>(null);
  const [activePath, setActivePath] = useState<string>("~");
  const [initialPath, setInitialPath] = useState<string>("~");
  const [mounted, setMounted] = useState(false);
  const [typingCmd, setTypingCmd] = useState<string | null>(null);
  const { openPanels, setOpenPanels } = usePanels();
  const mainRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const isMobileRef = useRef(false);
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  const scrollToTop = useCallback(() => {
    if (isMobileRef.current && mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const leftOpen = openPanels.filter((p) => LEFT_PANELS.includes(p));
  const rightOpen = openPanels.filter((p) => RIGHT_PANELS.includes(p));

  const handleLeftChange = useCallback(
    (values: string[]) => {
      const rightValues = openPanels.filter((p) => RIGHT_PANELS.includes(p));
      setOpenPanels([...values, ...rightValues]);
    },
    [openPanels, setOpenPanels],
  );

  const handleRightChange = useCallback(
    (values: string[]) => {
      const leftValues = openPanels.filter((p) => LEFT_PANELS.includes(p));
      setOpenPanels([...leftValues, ...values]);
    },
    [openPanels, setOpenPanels],
  );

  // Read URL on mount
  useEffect(() => {
    const path = getInitialPath();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivePath(path);
    setInitialPath(path);
    setMounted(true);
  }, []);

  // Update URL when activePath changes
  useEffect(() => {
    if (!mounted) return;
    const query = pathToQuery(activePath);
    const url = query ? `?path=${query}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  }, [activePath, mounted]);

  const handleSendCommand = useCallback((cmd: string) => {
    terminalCommandRef.current?.(cmd);
  }, []);

  const handlePathChange = useCallback((newPath: string) => {
    setActivePath(newPath);
  }, []);

  // Derive panel title from active path
  const panelLabel =
    activePath === "~"
      ? "ABOUT"
      : activePath
          .replace(/^~\/?/, "")
          .replace(/\.txt$/, "")
          .toUpperCase();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--background)]">
      <HeaderBar onNavigate={handleSendCommand} onTypingChange={setTypingCmd} />
      <main
        ref={mainRef}
        className="flex-1 min-h-0 min-w-0 flex flex-col md:flex-row gap-[2px] p-1 sm:p-2 md:p-3 bg-[var(--grid-accent-dim)] overflow-y-auto md:overflow-hidden"
      >
        <Accordion.Root
          type="multiple"
          value={leftOpen}
          onValueChange={handleLeftChange}
          className="flex flex-col gap-[2px] md:flex-1 md:min-h-0 min-w-0"
        >
          <GridPanel
            value="readme"
            title="README.TXT"
            rightLabel={panelLabel}
            className="max-h-[60vh] md:max-h-none"
          >
            <AboutPanel activePath={activePath} />
          </GridPanel>
          <GridPanel value="wave" title="WEBGL.WAVE" rightLabel="DATALINK">
            <WavePanel typingCmd={typingCmd} />
          </GridPanel>
        </Accordion.Root>
        <Accordion.Root
          type="multiple"
          value={rightOpen}
          onValueChange={handleRightChange}
          className="flex flex-col gap-0.5 md:flex-1 md:min-h-0 min-w-0"
        >
          <GridPanel
            value="terminal"
            title="TERMINAL // BASH"
            rightLabel="ACTIVE"
            className="max-h-[60vh] md:max-h-none"
          >
            <TerminalPanel
              onCommandRef={terminalCommandRef}
              initialCwd={mounted ? initialPath : "~"}
              onCwdChange={handlePathChange}
              onCommandComplete={scrollToTop}
            />
          </GridPanel>
          <GridPanel
            value="links"
            title="NAVIGATION // LINKS"
            rightLabel="DIRECTORY"
          >
            <LinksPanel
              onNavigate={handleSendCommand}
              onTypingChange={setTypingCmd}
            />
          </GridPanel>
        </Accordion.Root>
      </main>
      <StatusBar />
    </div>
  );
}
