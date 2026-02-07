import type { ReactNode } from "react";

const LINK_RE = /<a(?:\s+href="([^"]*)")?>([^<]*)<\/a>/g;

/**
 * Parses `<a>text</a>` and `<a href="url">text</a>` in a string
 * into clickable React <a> elements.
 *
 * - `<a>example.com</a>` → links to `https://example.com`
 * - `<a href="https://example.com">text</a>` → links to the explicit href
 */
export function parseLinks(
  text: string,
  className: string,
): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_RE)) {
    const [full, href, linkText] = match;
    const index = match.index!;

    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    const url = href || (linkText.match(/^https?:\/\//) ? linkText : `https://${linkText}`);

    parts.push(
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {linkText}
      </a>,
    );

    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
