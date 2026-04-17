"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";
import { ASCII_TITLE } from "@/constants/ascii";
import { LINKS } from "@/constants/links";
import { COMMANDS, COMMAND_NAMES, LOCATIONS } from "@/constants/commands";
import { getNode, resolvePath } from "@/constants/fileSystem";
import { useTheme } from "@/hooks/useTheme";
import { parseLinks } from "@/utils/parseLinks";

// ==================== TYPES ====================

interface TerminalLine {
  id: number;
  content: ReactNode;
}

interface TerminalProps {
  onCommandRef?: MutableRefObject<((cmd: string) => void) | null>;
  initialCwd?: string;
  onCwdChange?: (cwd: string) => void;
  onCommandComplete?: () => void;
}

// ==================== AUTOCOMPLETE ====================

interface Suggestion {
  display: string;
  value: string;
  description?: string;
}

const COMMAND_DESCRIPTIONS: Record<string, string> = Object.fromEntries(
  COMMANDS.map(([cmd, desc]) => [cmd.split(/\s/)[0], desc]),
);

const OPEN_TARGETS = LINKS.filter((l) => l.external).map((l) => ({
  name: l.name.toLowerCase(),
  label: l.name,
  href: l.href!,
}));

function getSuggestions(input: string, cwd: string): Suggestion[] {
  const trimmed = input.trimStart();
  if (!trimmed) return [];

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();

  // Typing the first word — complete command names
  if (parts.length === 1) {
    return COMMAND_NAMES.filter(
      (c) => c.startsWith(command) && c !== command,
    ).map((c) => ({
      display: c,
      value: c + " ",
      description: COMMAND_DESCRIPTIONS[c],
    }));
  }

  const argPart = parts.slice(1).join(" ");

  // open <target>
  if (command === "open") {
    return OPEN_TARGETS.filter(
      (t) =>
        t.name.startsWith(argPart.toLowerCase()) &&
        t.name !== argPart.toLowerCase(),
    ).map((t) => ({
      display: t.label,
      value: `open ${t.name}`,
      description: t.href,
    }));
  }

  // theme <mode>
  if (command === "theme") {
    return ["light", "dark"]
      .filter(
        (m) =>
          m.startsWith(argPart.toLowerCase()) && m !== argPart.toLowerCase(),
      )
      .map((m) => ({
        display: m,
        value: `theme ${m}`,
      }));
  }

  // cd / ls / cat — filesystem completion
  if (["cd", "ls", "cat"].includes(command)) {
    const partial = parts[parts.length - 1];
    let dirPath: string;
    let prefix: string;
    let pathPrefix: string;

    if (partial.includes("/")) {
      const lastSlash = partial.lastIndexOf("/");
      dirPath = resolvePath(cwd, partial.substring(0, lastSlash) || "/");
      prefix = partial.substring(lastSlash + 1);
      pathPrefix = partial.substring(0, lastSlash + 1);
    } else {
      dirPath = cwd;
      prefix = partial;
      pathPrefix = "";
    }

    const node = getNode(dirPath);
    if (node?.type === "dir" && node.children) {
      return Object.entries(node.children)
        .filter(([name]) => name.toLowerCase().startsWith(prefix.toLowerCase()))
        .filter(([name]) => name.toLowerCase() !== prefix.toLowerCase())
        .filter(([, child]) => {
          if (command === "cd") return child.type === "dir";
          if (command === "cat") return child.type === "file";
          return true;
        })
        .map(([name, child]) => {
          const suffix = child.type === "dir" ? "/" : "";
          return {
            display: name + suffix,
            value: `${command} ${pathPrefix}${name}${suffix}`,
          };
        });
    }
  }

  return [];
}

// ==================== COMPONENT ====================

export default function Terminal({
  onCommandRef,
  initialCwd = "~",
  onCwdChange,
  onCommandComplete,
}: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(initialCwd);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [acIdx, setAcIdx] = useState(0);

  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cwdRef = useRef(initialCwd);
  const cmdHistoryRef = useRef<string[]>([]);
  const linkNavRef = useRef<(path: string, isFile: boolean) => void>(() => {});
  const initializedRef = useRef(false);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCwdChangeRef = useRef(onCwdChange);
  onCwdChangeRef.current = onCwdChange;
  const onCommandCompleteRef = useRef(onCommandComplete);
  onCommandCompleteRef.current = onCommandComplete;

  const { theme, toggle: toggleTheme } = useTheme();
  const themeRef = useRef({ theme, toggle: toggleTheme });
  themeRef.current = { theme, toggle: toggleTheme };

  const suggestions = useMemo(() => {
    if (isTyping || histIdx !== -1) return [];
    return getSuggestions(input, cwd);
  }, [input, cwd, isTyping, histIdx]);

  // Reset selection when suggestions change
  const prevSugLen = useRef(0);
  if (suggestions.length !== prevSugLen.current) {
    prevSugLen.current = suggestions.length;
    if (acIdx >= suggestions.length) setAcIdx(0);
  }

  // Keep refs in sync and notify parent of CWD changes
  useEffect(() => {
    cwdRef.current = cwd;
    onCwdChangeRef.current?.(cwd);
  }, [cwd]);
  useEffect(() => {
    cmdHistoryRef.current = cmdHistory;
  }, [cmdHistory]);

  const getId = () => nextId.current++;

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, input]);

  // Focus input on mount (preventScroll so mobile stays at top)
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // ---- Typewriter: types a command into the input, then executes ----

  const typewriteAndExecute = useCallback((cmd: string) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    setIsTyping(true);
    setInput("");
    inputRef.current?.focus();

    let charIndex = 0;

    typingIntervalRef.current = setInterval(() => {
      charIndex++;
      const partial = cmd.slice(0, charIndex);
      setInput(partial);

      // Scroll while typing
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

      if (charIndex >= cmd.length) {
        clearInterval(typingIntervalRef.current!);
        typingIntervalRef.current = null;

        // Small pause after typing finishes, then execute
        setTimeout(() => {
          executeCommand(cmd);
          setIsTyping(false);
        }, 150);
      }
    }, 40);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Execute a command programmatically (shared by typewriter and handleSubmit)
  const executeCommand = useCallback((cmd: string) => {
    const currentCwd = cwdRef.current;
    const currentHistory = cmdHistoryRef.current;

    const promptLine: TerminalLine = {
      id: getId(),
      content: renderPrompt(currentCwd, cmd),
    };

    const { output, newCwd, clear, viewedPath } = processCommand(
      cmd,
      currentCwd,
      currentHistory,
    );

    if (clear) {
      setLines([]);
    } else {
      const newLines: TerminalLine[] = [promptLine];
      if (output !== null) {
        newLines.push({ id: getId(), content: output });
      }
      setLines((prev) => [...prev, ...newLines]);
    }

    if (newCwd !== currentCwd) {
      setCwd(newCwd);
      cwdRef.current = newCwd;
    } else if (viewedPath) {
      // Notify parent about viewed file (e.g., cat ~/resume.txt)
      onCwdChangeRef.current?.(viewedPath);
    }

    setCmdHistory((prev) => {
      const updated = [...prev, cmd];
      cmdHistoryRef.current = updated;
      return updated;
    });
    setInput("");
    setHistIdx(-1);
    inputRef.current?.focus();
    onCommandCompleteRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose command injection for inter-panel communication (LinksPanel)
  useEffect(() => {
    if (onCommandRef) {
      onCommandRef.current = (cmd: string) => {
        typewriteAndExecute(cmd);
      };
    }
    return () => {
      if (onCommandRef) onCommandRef.current = null;
    };
  }, [onCommandRef, typewriteAndExecute]);

  // ---- Renderers ----

  const renderPrompt = (dir: string, cmd?: string) => (
    <span className="whitespace-nowrap">
      <span className="text-term-green hidden sm:inline">jasonzhao</span>
      <span className="text-term-green hidden sm:inline">@</span>
      <span className="text-term-accent hidden sm:inline">terminal</span>
      <span className="text-term-text hidden sm:inline">:</span>
      <span className="text-term-green sm:hidden">jz</span>
      <span className="text-term-text">$ </span>
      <span className="text-term-cyan">{dir} </span>
      {cmd && <span className="text-term-cmd">{cmd}</span>}
    </span>
  );

  const renderTitle = () => (
    <div className="mb-2">
      <pre className="text-term-cyan text-[10px] sm:text-sm leading-tight font-mono  flex flex-col">
        {ASCII_TITLE.map((line, i) => (
          <div key={`${i}-ascii-title`}>{line}</div>
        ))}
      </pre>
      <span className="text-term-dim ml-1">v1.0.0</span>
      <div className="mt-2 text-term-text">CTO/COO at Omnipresent | UBC CS</div>
      <div className="mt-1 text-term-muted text-sm">
        <div>{"Enter 'help' to see list of commands and locations"}</div>
        <div>{"Press 'ctrl + c' to clear the commands"}</div>
      </div>
    </div>
  );

  const renderLinks = () => (
    <div className="mb-2 flex flex-wrap gap-2">
      {LINKS.map((link, i) =>
        link.external ? (
          <button
            key={i}
            onClick={() => {
              if (isTyping) return;
              const cmd = `open ${link.name.toLowerCase()}`;
              if (typingIntervalRef.current)
                clearInterval(typingIntervalRef.current);
              setIsTyping(true);
              setInput("");

              let charIndex = 0;
              typingIntervalRef.current = setInterval(() => {
                charIndex++;
                setInput(cmd.slice(0, charIndex));
                if (scrollRef.current) {
                  scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
                if (charIndex >= cmd.length) {
                  clearInterval(typingIntervalRef.current!);
                  typingIntervalRef.current = null;
                  setTimeout(() => {
                    const currentCwd = cwdRef.current;
                    setLines((prev) => [
                      ...prev,
                      { id: getId(), content: renderPrompt(currentCwd, cmd) },
                      {
                        id: getId(),
                        content: (
                          <div className="text-term-text">
                            Opening {link.name}...
                          </div>
                        ),
                      },
                    ]);
                    setInput("");
                    setIsTyping(false);
                    window.open(link.href, "_blank", "noopener,noreferrer");
                  }, 100);
                }
              }, 40);
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--grid-accent-dim)] hover:border-[var(--grid-accent)] hover:bg-[var(--grid-accent-dim)] transition-all cursor-pointer text-term-cyan hover:text-[var(--grid-accent)] font-mono text-xs sm:text-sm"
          >
            {link.name}
          </button>
        ) : (
          <button
            key={i}
            onClick={() => {
              if (isTyping) return;
              linkNavRef.current(link.path!, link.isFile || false);
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--grid-accent-dim)] hover:border-[var(--grid-accent)] hover:bg-[var(--grid-accent-dim)] transition-all cursor-pointer text-term-cyan hover:text-[var(--grid-accent)] font-mono text-xs sm:text-sm"
          >
            {link.name}
          </button>
        ),
      )}
    </div>
  );

  // ---- Process Command ----

  const processCommand = (
    cmdStr: string,
    currentCwd: string,
    currentHistory: string[],
  ): {
    output: ReactNode;
    newCwd: string;
    clear: boolean;
    viewedPath?: string;
  } => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return { output: null, newCwd: currentCwd, clear: false };

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    let output: ReactNode = null;
    let newCwd = currentCwd;
    let viewedPath: string | undefined;

    switch (command) {
      case "help": {
        output = (
          <div className="mb-2">
            <div className="text-term-yellow mb-1">Available commands:</div>
            <div className="ml-2 space-y-0.5 text-sm">
              {COMMANDS.map(([cmd, desc]) => (
                <div key={cmd}>
                  <span className="text-term-cyan inline-block w-28">
                    {cmd}
                  </span>
                  <span className="text-term-dim"> {desc}</span>
                </div>
              ))}
            </div>
            <div className="text-term-yellow mt-3 mb-1">
              Locations (use cd to navigate):
            </div>
            <div className="ml-2 space-y-0.5 text-sm">
              {LOCATIONS.map(([path, desc]) => (
                <div key={path}>
                  <span className="text-term-cyan inline-block w-28">
                    {path}
                  </span>
                  <span className="text-term-dim"> {desc}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      }

      case "title": {
        output = renderTitle();
        break;
      }

      case "links": {
        output = renderLinks();
        break;
      }

      case "ls": {
        const targetPath = args ? resolvePath(currentCwd, args) : currentCwd;
        const node = getNode(targetPath);
        if (!node) {
          output = (
            <div className="text-term-error">
              ls: cannot access {`'${args}'`}: No such file or directory
            </div>
          );
        } else if (node.type === "file") {
          const name = args || targetPath.split("/").pop();
          output = <div className="text-term-text">{name}</div>;
        } else if (node.children) {
          output = (
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {Object.entries(node.children).map(([name, child]) => (
                <span
                  key={name}
                  className={
                    child.type === "dir"
                      ? "text-term-blue font-bold"
                      : "text-term-text"
                  }
                >
                  {name}
                  {child.type === "dir" ? "/" : ""}
                </span>
              ))}
            </div>
          );
        }
        break;
      }

      case "cd": {
        if (!args || args === "~" || args === "~/") {
          newCwd = "~";
          break;
        }
        if (args === "-") {
          output = <div className="text-term-error">cd: OLDPWD not set</div>;
          break;
        }
        const cdTarget = resolvePath(currentCwd, args);
        const cdNode = getNode(cdTarget);
        if (!cdNode) {
          output = (
            <div className="text-term-error">
              cd: no such file or directory: {args}
            </div>
          );
        } else if (cdNode.type === "file") {
          output = (
            <div className="text-term-error">cd: not a directory: {args}</div>
          );
        } else {
          newCwd = cdTarget;
        }
        break;
      }

      case "cat": {
        if (!args) {
          output = (
            <div className="text-term-error">cat: missing file operand</div>
          );
          break;
        }
        const catTarget = resolvePath(currentCwd, args);
        const catNode = getNode(catTarget);
        if (!catNode) {
          output = (
            <div className="text-term-error">
              cat: {args}: No such file or directory
            </div>
          );
        } else if (catNode.type === "dir") {
          output = (
            <div className="text-term-error">cat: {args}: Is a directory</div>
          );
        } else {
          viewedPath = catTarget;
          output = (
            <div>
              {catNode.downloadLinks && catNode.downloadLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {catNode.downloadLinks.map((dl, idx) => (
                    <a
                      key={idx}
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-1.5 border border-[var(--grid-accent)] text-[var(--grid-accent)] hover:bg-[var(--grid-accent-dim)] transition-colors text-sm"
                    >
                      {dl.label}
                    </a>
                  ))}
                </div>
              )}
              <pre className="text-term-text whitespace-pre-wrap">
                {parseLinks(
                  catNode.content || "",
                  "text-term-cyan underline underline-offset-2 hover:opacity-80 transition-opacity",
                )}
              </pre>

              {catNode.downloadUrl && (
                <a
                  href={catNode.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-1.5 border border-[var(--grid-accent)] text-[var(--grid-accent)] hover:bg-[var(--grid-accent-dim)] transition-colors text-sm"
                >
                  View PDF Resume
                </a>
              )}
            </div>
          );
        }
        break;
      }

      case "open": {
        if (!args) {
          output = (
            <div className="text-term-error">
              open: missing target. Available:{" "}
              {OPEN_TARGETS.map((t) => t.name).join(", ")}
            </div>
          );
          break;
        }
        const target = OPEN_TARGETS.find((t) => t.name === args.toLowerCase());
        if (!target) {
          output = (
            <div className="text-term-error">
              open: unknown target {`'${args}'`}. Available:{" "}
              {OPEN_TARGETS.map((t) => t.name).join(", ")}
            </div>
          );
        } else {
          window.open(target.href, "_blank", "noopener,noreferrer");
          output = (
            <div className="text-term-text">Opening {target.label}...</div>
          );
        }
        break;
      }

      case "pwd": {
        output = (
          <div className="text-term-text">
            /home/jasonzhao{currentCwd === "~" ? "" : currentCwd.slice(1)}
          </div>
        );
        break;
      }

      case "whoami": {
        output = <div className="text-term-text">jasonzhao</div>;
        break;
      }

      case "echo": {
        output = <div className="text-term-text">{args}</div>;
        break;
      }

      case "date": {
        output = <div className="text-term-text">{new Date().toString()}</div>;
        break;
      }

      case "history": {
        const allCmds = [...currentHistory, trimmed];
        output = (
          <div>
            {allCmds.map((cmd, i) => (
              <div key={i} className="text-term-text">
                <span className="text-term-dim mr-3">
                  {String(i + 1).padStart(4)}
                </span>
                {cmd}
              </div>
            ))}
          </div>
        );
        break;
      }

      case "theme": {
        const mode = args.toLowerCase();
        const current = themeRef.current.theme;

        if (mode === "light" || mode === "dark") {
          if (mode === current) {
            output = (
              <div className="text-term-text">
                Already in <span className="text-term-cyan">{mode}</span> mode.
              </div>
            );
          } else {
            themeRef.current.toggle();
            output = (
              <div className="text-term-text">
                Switched to <span className="text-term-cyan">{mode}</span> mode.
              </div>
            );
          }
        } else if (!mode) {
          const next = current === "dark" ? "light" : "dark";
          themeRef.current.toggle();
          output = (
            <div className="text-term-text">
              Switched to <span className="text-term-cyan">{next}</span> mode.
            </div>
          );
        } else {
          output = (
            <div className="text-term-error">
              theme: unknown mode {`'${mode}'`}. Use{" "}
              <span className="text-term-cyan">light</span> or{" "}
              <span className="text-term-cyan">dark</span>.
            </div>
          );
        }
        break;
      }

      case "clear": {
        return { output: null, newCwd: currentCwd, clear: true };
      }

      case "mkdir":
      case "rm":
      case "rmdir":
      case "touch":
      case "mv":
      case "cp": {
        output = (
          <div className="text-term-error">
            {command}: Permission denied (read-only filesystem)
          </div>
        );
        break;
      }

      case "sudo": {
        output = (
          <div className="text-term-error">
            {"Nice try! You don't have sudo privileges here."}
          </div>
        );
        break;
      }

      case "vim":
      case "nano":
      case "vi":
      case "emacs": {
        output = (
          <div className="text-term-error">
            {command}: editor not available in this terminal
          </div>
        );
        break;
      }

      case "exit":
      case "logout": {
        output = (
          <div className="text-term-muted">
            {"There is no escape. Type 'help' for commands."}
          </div>
        );
        break;
      }

      default: {
        output = (
          <div className="text-term-error">
            Command not found: {command}. Type {"'help'"} for available
            commands.
          </div>
        );
        break;
      }
    }

    return { output, newCwd, clear: false, viewedPath };
  };

  // ---- Handle Submit ----

  const handleSubmit = () => {
    if (isTyping) return;
    const trimmed = input.trim();
    const currentCwd = cwdRef.current;
    const currentHistory = cmdHistoryRef.current;

    const promptLine: TerminalLine = {
      id: getId(),
      content: renderPrompt(currentCwd, trimmed || undefined),
    };

    if (!trimmed) {
      setLines((prev) => [...prev, promptLine]);
      setInput("");
      return;
    }

    const { output, newCwd, clear, viewedPath } = processCommand(
      trimmed,
      currentCwd,
      currentHistory,
    );

    if (clear) {
      setLines([]);
    } else {
      const newLines: TerminalLine[] = [promptLine];
      if (output !== null) {
        newLines.push({ id: getId(), content: output });
      }
      setLines((prev) => [...prev, ...newLines]);
    }

    if (newCwd !== currentCwd) {
      setCwd(newCwd);
      cwdRef.current = newCwd;
    } else if (viewedPath) {
      onCwdChangeRef.current?.(viewedPath);
    }

    setCmdHistory((prev) => {
      const updated = [...prev, trimmed];
      cmdHistoryRef.current = updated;
      return updated;
    });
    setInput("");
    setHistIdx(-1);
  };

  // ---- Handle Link Navigation (with typewriter) ----

  const handleLinkNav = (path: string, isFile: boolean) => {
    if (isTyping) return;
    const cmd = isFile ? `cat ${path}` : `cd ${path}`;
    typewriteAndExecute(cmd);
  };

  // Keep link nav ref updated
  linkNavRef.current = handleLinkNav;

  // ---- Accept Autocomplete Suggestion ----

  const acceptSuggestion = (idx: number) => {
    if (suggestions[idx]) {
      setInput(suggestions[idx].value);
      setAcIdx(0);
      inputRef.current?.focus();
    }
  };

  // ---- Handle Key Down ----

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isTyping) {
      e.preventDefault();
      return;
    }

    const hasSuggestions = suggestions.length > 0;

    if (e.key === "Tab") {
      e.preventDefault();
      if (hasSuggestions) {
        acceptSuggestion(acIdx);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      setAcIdx(0);
      return;
    }

    if (e.key === "Escape") {
      if (hasSuggestions) {
        e.preventDefault();
        setInput("");
        setAcIdx(0);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hasSuggestions) {
        setAcIdx((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      } else {
        const history = cmdHistoryRef.current;
        if (history.length === 0) return;
        const newIdx =
          histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(newIdx);
        setInput(history[newIdx]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hasSuggestions) {
        setAcIdx((prev) => (prev >= suggestions.length - 1 ? 0 : prev + 1));
      } else {
        if (histIdx === -1) return;
        const history = cmdHistoryRef.current;
        const newIdx = histIdx + 1;
        if (newIdx >= history.length) {
          setHistIdx(-1);
          setInput("");
        } else {
          setHistIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
      return;
    }

    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
      setInput("");
      setAcIdx(0);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  // ---- Initialize Welcome Content ----

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialLines: TerminalLine[] = [
      { id: getId(), content: renderPrompt("~", "title") },
      { id: getId(), content: renderTitle() },
      { id: getId(), content: renderPrompt("~", "links") },
      { id: getId(), content: renderLinks() },
    ];

    // If starting in a specific directory from URL, show the cd + README
    if (initialCwd !== "~") {
      const node = getNode(initialCwd);
      if (node) {
        if (node.type === "file") {
          // cat the file (e.g., resume.txt)
          initialLines.push({
            id: getId(),
            content: renderPrompt("~", `cat ${initialCwd}`),
          });
          if (node.content) {
            initialLines.push({
              id: getId(),
              content: (
                <pre className="text-term-text whitespace-pre-wrap">
                  {parseLinks(
                    node.content,
                    "text-term-cyan underline underline-offset-2 hover:opacity-80 transition-opacity",
                  )}
                </pre>
              ),
            });
          }
        } else {
          // cd into directory
          initialLines.push({
            id: getId(),
            content: renderPrompt("~", `cd ${initialCwd}`),
          });
          // Show README if exists
          if (node.children?.["README.md"]) {
            initialLines.push({
              id: getId(),
              content: renderPrompt(initialCwd, "cat README.md"),
            });
            initialLines.push({
              id: getId(),
              content: (
                <pre className="text-term-text whitespace-pre-wrap">
                  {parseLinks(
                    node.children["README.md"].content || "",
                    "text-term-cyan underline underline-offset-2 hover:opacity-80 transition-opacity",
                  )}
                </pre>
              ),
            });
          }
        }
      }
    }

    setLines(initialLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Render ----

  return (
    <div
      className="h-full w-full flex flex-col select-none overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-5 min-h-0 select-text text-xs sm:text-sm md:text-base"
      >
        {/* Output */}
        {lines.map((line) => (
          <div key={line.id} className="leading-relaxed">
            {line.content}
          </div>
        ))}

        {/* Input line + autocomplete */}
        <div className="relative">
          <div className="flex items-center leading-relaxed min-w-0">
            {renderPrompt(cwd)}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                if (!isTyping) {
                  setInput(e.target.value);
                  setHistIdx(-1);
                }
              }}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none border-none text-term-cmd flex-1 ml-1 caret-term-text font-mono text-xs sm:text-sm md:text-base w-0 min-w-0"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              readOnly={isTyping}
            />
          </div>

          {/* Autocomplete dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 top-full z-10 ml-4 sm:ml-6 mt-1 border border-[var(--grid-accent-dim)] bg-[var(--grid-panel-bg)] max-w-xs shadow-lg">
              {suggestions.slice(0, 6).map((s, i) => (
                <button
                  key={s.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    acceptSuggestion(i);
                  }}
                  className={`w-full text-left px-2 py-1 flex items-center gap-3 text-xs sm:text-sm cursor-pointer transition-colors ${
                    i === acIdx
                      ? "bg-[var(--grid-accent-dim)] text-[var(--grid-accent)]"
                      : "text-term-text hover:bg-[var(--grid-accent-dim)]"
                  }`}
                >
                  <span className="text-term-cyan font-mono shrink-0">
                    {s.display}
                  </span>
                  {s.description && (
                    <span className="text-term-dim truncate text-xs">
                      {s.description}
                    </span>
                  )}
                </button>
              ))}
              <div className="px-2 py-0.5 text-[10px] text-term-dim border-t border-[var(--grid-accent-dim)]">
                Tab to complete · ↑↓ to navigate
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
