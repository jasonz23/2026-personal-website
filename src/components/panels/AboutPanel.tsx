"use client";

import { getNode, type DownloadLink } from "@/constants/fileSystem";
import { parseLinks } from "@/utils/parseLinks";

interface AboutPanelProps {
  activePath: string;
}

export default function AboutPanel({ activePath }: AboutPanelProps) {
  const { content, downloadLinks } = getContentForPath(activePath);

  return (
    <div className="p-4 md:p-5">
      {content ? (
        <>
          {downloadLinks && downloadLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {downloadLinks.map((dl, idx) => (
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
          {renderContent(content)}
        </>
      ) : (
        <p className="text-term-dim text-sm">
          No README found for this location.
        </p>
      )}
    </div>
  );
}

function getContentForPath(path: string): {
  content: string;
  downloadLinks?: DownloadLink[];
} {
  const node = getNode(path);
  if (!node) {
    return { content: getNode("~/about-me/README.md")?.content || "" };
  }

  if (node.type === "file") {
    return { content: node.content || "", downloadLinks: node.downloadLinks };
  }

  if (node.children?.["README.md"]) {
    return { content: node.children["README.md"].content || "" };
  }

  return { content: getNode("~/about-me/README.md")?.content || "" };
}

const linkClass =
  "text-[var(--grid-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity";

function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("# ")) {
      return (
        <h2
          key={i}
          className="text-[var(--grid-accent)] text-lg font-bold mb-3 tracking-wide"
        >
          {parseLinks(line.slice(2), linkClass)}
        </h2>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3
          key={i}
          className="text-[var(--grid-accent)] text-sm font-bold mt-4 mb-2 tracking-wider uppercase"
        >
          {parseLinks(line.slice(3), linkClass)}
        </h3>
      );
    }
    if (line.trimStart().startsWith("- ")) {
      return (
        <div key={i} className="flex items-start gap-2 ml-2 mb-1">
          <span className="text-[var(--grid-accent)] mt-0.5 text-xs">
            &#9654;
          </span>
          <span className="text-foreground text-sm">
            {parseLinks(line.trimStart().slice(2), linkClass)}
          </span>
        </div>
      );
    }
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }
    return (
      <p key={i} className="text-foreground text-sm leading-relaxed">
        {parseLinks(line, linkClass)}
      </p>
    );
  });
}
