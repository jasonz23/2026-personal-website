export const COMMANDS: [string, string][] = [
  ["help", "Show this help message"],
  ["title", "Display ASCII art title"],
  ["links", "Show available links"],
  ["ls [path]", "List directory contents"],
  ["cd <dir>", "Change directory"],
  ["cat <file>", "Display file contents"],
  ["pwd", "Print working directory"],
  ["whoami", "Display user info"],
  ["echo <text>", "Print text"],
  ["date", "Show current date"],
  ["history", "Show command history"],
  ["clear", "Clear terminal (or Ctrl+C)"],
  ["theme [mode]", "Toggle light/dark mode"],
];

export const COMMAND_NAMES = [
  "help",
  "title",
  "links",
  "ls",
  "cd",
  "cat",
  "pwd",
  "whoami",
  "echo",
  "date",
  "history",
  "clear",
  "theme",
];

export const LOCATIONS: [string, string][] = [
  ["~/about-me", "Learn about me"],
  ["~/projects", "View my projects"],
  ["~/experience", "Work experience"],
  ["~/education", "Education"],
  ["~/contact", "Contact information"],
  ["~/resume.txt", "View resume (use cat)"],
];
