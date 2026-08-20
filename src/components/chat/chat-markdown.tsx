"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/lib/chat-context";
import { emptyFilter } from "@/lib/filter-utils";
import { projects } from "@/lib/projects";

// ─── Token regex ──────────────────────────────────────────────────────────────
// Matches [project:some-slug] or [filter:slug1,slug2,slug3]
const ACTION_TOKEN_RE = /\[(project|filter):([^\]]+)\]/g;

// ─── Inline buttons ───────────────────────────────────────────────────────────

function ProjectButton({ slug }: { slug: string }) {
  const router = useRouter();
  const { setChatOpen } = useChatContext();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;

  return (
    <button
      type="button"
      onClick={() => {
        router.push(`/projects/${slug}`);
        setChatOpen(false);
      }}
      className="mx-1 inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-0.5 text-[0.75em] font-semibold text-bg shadow-sm transition-opacity hover:opacity-80 active:opacity-60"
    >
      View Case Study
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 5h6M5 2l3 3-3 3" />
      </svg>
    </button>
  );
}

function FilterButton({ slugs }: { slugs: string[] }) {
  const { setFilter } = useChatContext();

  function apply() {
    setFilter(
      { ...emptyFilter(), slugs: new Set(slugs) },
      true,
    );
  }

  return (
    <button
      type="button"
      onClick={apply}
      className="mx-1 inline-flex items-center gap-1 rounded-lg border border-accent bg-accent/10 px-2.5 py-0.5 text-[0.75em] font-semibold text-accent shadow-sm transition-colors hover:bg-accent/20 active:bg-accent/30"
    >
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M1 3h10M3 6h6M5 9h2" />
      </svg>
      Show only these
    </button>
  );
}

// ─── Inline span parser ───────────────────────────────────────────────────────

/**
 * Parse a single text segment (which may contain action tokens) into ReactNodes.
 * Also handles **bold**, *italic*, and `code` markdown.
 */
function parseSegment(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  ACTION_TOKEN_RE.lastIndex = 0;

  while ((match = ACTION_TOKEN_RE.exec(text)) !== null) {
    // text before this token
    if (match.index > last) {
      nodes.push(...parseInlineMarkdown(text.slice(last, match.index), `${keyBase}-t${last}`));
    }

    const [, type, payload] = match;
    const key = `${keyBase}-btn${match.index}`;

    if (type === "project") {
      nodes.push(<ProjectButton key={key} slug={payload.trim()} />);
    } else if (type === "filter") {
      const slugs = payload.split(",").map((s) => s.trim()).filter(Boolean);
      nodes.push(<FilterButton key={key} slugs={slugs} />);
    }

    last = match.index + match[0].length;
  }

  // remaining text
  if (last < text.length) {
    nodes.push(...parseInlineMarkdown(text.slice(last), `${keyBase}-t${last}`));
  }

  return nodes;
}

// ─── Markdown inline parser (bold / italic / code / links) ───────────────────

const MARKDOWN_RE = /(\*\*[^*\n]+?\*\*|`[^`\n]+?`|\*[^*\n]+?\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)>]+|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;

function parseInlineMarkdown(text: string, keyBase: string): ReactNode[] {
  const parts = text.split(MARKDOWN_RE);
  return parts.map((token, i) => {
    const key = `${keyBase}-m${i}`;
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return <strong key={key} className="font-semibold text-text-primary">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      return (
        <code key={key} className="rounded bg-border/60 px-1 py-0.5 font-mono text-[0.8em] text-accent">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }
    // Markdown link [text](url)
    const mdLink = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLink) {
      return (
        <a key={key} href={mdLink[2]} target="_blank" rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:opacity-80">
          {mdLink[1]}
        </a>
      );
    }
    if (/^https?:\/\//.test(token)) {
      return (
        <a key={key} href={token} target="_blank" rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:opacity-80 break-all">
          {token}
        </a>
      );
    }
    if (/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(token)) {
      return (
        <a key={key} href={`mailto:${token}`} target="_blank" rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:opacity-80">
          {token}
        </a>
      );
    }
    return token || null;
  });
}

// ─── Block helpers ─────────────────────────────────────────────────────────────

function isUnorderedItem(line: string) {
  return /^[-*•]\s/.test(line.trimStart());
}
function isOrderedItem(line: string) {
  return /^\d+\.\s/.test(line.trimStart());
}
function stripListMarker(line: string) {
  return line.replace(/^[-*•]\s/, "").replace(/^\d+\.\s/, "").trim();
}
function isHorizontalRule(line: string) {
  return /^[-*_]{3,}\s*$/.test(line.trim());
}
function headingLevel(line: string): number {
  const m = line.match(/^(#{1,3})\s/);
  return m ? m[1].length : 0;
}
function stripHeading(line: string): string {
  return line.replace(/^#{1,3}\s/, "");
}
function isBlockquote(line: string): boolean {
  return /^>\s?/.test(line);
}
function stripBlockquote(line: string): string {
  return line.replace(/^>\s?/, "");
}
function isTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith("|") && t.includes("|", 1);
}
function isSeparatorRow(line: string): boolean {
  const inner = line.replace(/^\s*\||\|\s*$/g, "");
  return inner.split("|").every((cell) => /^[\s:|-]+$/.test(cell) && /-/.test(cell));
}
function parseTableCells(line: string): string[] {
  return line
    .replace(/^\s*\||\|\s*$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function isStructural(line: string): boolean {
  return (
    isUnorderedItem(line) ||
    isOrderedItem(line) ||
    headingLevel(line) > 0 ||
    isHorizontalRule(line) ||
    isBlockquote(line) ||
    isTableRow(line)
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/** Collect every unique [project:slug] slug from a text string. */
function collectProjectSlugs(text: string): string[] {
  const seen = new Set<string>();
  ACTION_TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ACTION_TOKEN_RE.exec(text)) !== null) {
    if (m[1] === "project") seen.add(m[2].trim());
  }
  return [...seen];
}

/** Convert a markdown string (with optional [project:slug] / [filter:slugs] tokens) into JSX. */
export function ChatMarkdown({ text }: { text: string }) {
  const elements: ReactNode[] = [];
  let keyCounter = 0;
  const nextKey = () => `el-${keyCounter++}`;

  // Strip dangling unclosed inline markers at the end (from truncated streams)
  const cleanText = text.replace(/\*{1,2}\s*$/, "").replace(/`\s*$/, "");

  // Pre-process: extract fenced code blocks so they aren't touched by the line parser
  type RawBlock = { type: "code"; lang: string; content: string } | { type: "text"; content: string };
  const rawBlocks: RawBlock[] = [];
  const codeFenceRe = /^```(\w*)\n([\s\S]*?)^```/gm;
  let lastIndex = 0;
  let fenceMatch: RegExpExecArray | null;

  while ((fenceMatch = codeFenceRe.exec(cleanText)) !== null) {
    if (fenceMatch.index > lastIndex) {
      rawBlocks.push({ type: "text", content: cleanText.slice(lastIndex, fenceMatch.index) });
    }
    rawBlocks.push({ type: "code", lang: fenceMatch[1], content: fenceMatch[2] });
    lastIndex = fenceMatch.index + fenceMatch[0].length;
  }
  if (lastIndex < cleanText.length) {
    rawBlocks.push({ type: "text", content: cleanText.slice(lastIndex) });
  }

  for (const rawBlock of rawBlocks) {
    // ── Fenced code block ──────────────────────────────────────────────────
    if (rawBlock.type === "code") {
      elements.push(
        <pre key={nextKey()} className="my-3 overflow-x-auto rounded-lg bg-border/40 p-3 font-mono text-[0.8em] leading-relaxed text-text-primary">
          <code>{rawBlock.content.replace(/\n$/, "")}</code>
        </pre>,
      );
      continue;
    }

    // ── Linear line-by-line parser ─────────────────────────────────────────
    // Processes lines one at a time so mixed blocks (e.g. paragraph intro
    // followed by list items) are correctly split rather than collapsed.
    const lines = rawBlock.content.split("\n");
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Blank line — just advance
      if (!line.trim()) { i++; continue; }

      const key = nextKey();

      // ── Horizontal rule ────────────────────────────────────────────────
      if (isHorizontalRule(line)) {
        elements.push(<hr key={key} className="my-3 border-border/70" />);
        i++;
        continue;
      }

      // ── Heading ────────────────────────────────────────────────────────
      const hLevel = headingLevel(line);
      if (hLevel > 0) {
        const Tag = `h${hLevel}` as "h1" | "h2" | "h3";
        const headingClass =
          hLevel === 1
            ? "mt-4 mb-2 text-lg font-bold text-text-primary leading-tight"
            : hLevel === 2
              ? "mt-3 mb-1.5 text-[0.85em] font-semibold uppercase tracking-wider text-text-secondary"
              : "mt-3 mb-1.5 text-[0.9em] font-bold text-text-primary tracking-wide";
        elements.push(
          <Tag key={key} className={headingClass}>
            {parseSegment(stripHeading(line), `${key}-h`)}
          </Tag>,
        );
        i++;
        continue;
      }

      // ── Blockquote run ─────────────────────────────────────────────────
      if (isBlockquote(line)) {
        const quoteLines: string[] = [];
        while (i < lines.length && (isBlockquote(lines[i]) || lines[i].trim() === "")) {
          if (lines[i].trim()) quoteLines.push(lines[i]);
          i++;
        }
        const children: ReactNode[] = [];
        quoteLines.forEach((l, j) => {
          if (j > 0) children.push(<br key={`br-${j}`} />);
          children.push(...parseSegment(stripBlockquote(l), `${key}-bq${j}`));
        });
        elements.push(
          <blockquote key={key} className="my-2.5 border-l-2 border-accent/60 pl-3 text-sm italic text-text-secondary leading-relaxed">
            {children}
          </blockquote>,
        );
        continue;
      }

      // ── Markdown table ─────────────────────────────────────────────────
      if (isTableRow(line)) {
        const tableLines: string[] = [];
        while (i < lines.length && isTableRow(lines[i])) {
          tableLines.push(lines[i]);
          i++;
        }
        // Valid table needs header + separator + at least one body row
        if (tableLines.length >= 2 && isSeparatorRow(tableLines[1])) {
          const headers = parseTableCells(tableLines[0]);
          const bodyRows = tableLines.slice(2).map(parseTableCells);
          elements.push(
            <div key={key} className="my-3 overflow-x-auto rounded-lg border border-border/50 text-sm">
              <table className="w-full min-w-[320px] border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-white/5">
                    {headers.map((h, ci) => (
                      <th key={ci} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary whitespace-nowrap">
                        {parseSegment(h, `${key}-th${ci}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 1 ? "bg-white/3" : ""}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 leading-relaxed align-top">
                          {parseSegment(cell, `${key}-td${ri}-${ci}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>,
          );
        } else {
          // Fallback: render as plain paragraphs if not a valid table
          tableLines.forEach((l) => {
            const fbKey = nextKey();
            elements.push(
              <p key={fbKey} className="text-sm leading-[1.75]">
                {parseSegment(l, `${fbKey}-p`)}
              </p>,
            );
          });
        }
        continue;
      }

      // ── Unordered list run ─────────────────────────────────────────────
      if (isUnorderedItem(line)) {
        const items: string[] = [];
        while (i < lines.length) {
          const l = lines[i];
          if (isUnorderedItem(l)) { items.push(l); i++; }
          else if (l.trim() === "") {
            // Allow a single blank line between items only if next non-blank is also a list item
            let j = i + 1;
            while (j < lines.length && lines[j].trim() === "") j++;
            if (j < lines.length && isUnorderedItem(lines[j])) i++;
            else break;
          }
          else break;
        }
        elements.push(
          <ul key={key} className="my-2.5 space-y-2 pl-5 text-sm">
            {items.map((item, j) => (
              <li key={j} className="list-disc leading-relaxed pl-0.5">
                {parseSegment(stripListMarker(item), `${key}-li${j}`)}
              </li>
            ))}
          </ul>,
        );
        continue;
      }

      // ── Ordered list item — rendered as a numbered step group ──────────
      // Each item title gets its own numbered badge. Lines immediately
      // following the title (single-newline-separated, non-structural) are
      // treated as the item's description and indented under it.
      if (isOrderedItem(line)) {
        const num = parseInt(line.match(/^(\d+)\./)?.[1] ?? "1", 10);
        const titleNodes = parseSegment(stripListMarker(line), `${key}-title`);
        i++;

        // Collect single-newline-attached description lines
        const descLines: string[] = [];
        while (i < lines.length) {
          const l = lines[i];
          if (!l.trim()) break; // blank line ends description
          if (isStructural(l)) break; // next element starts
          descLines.push(l);
          i++;
        }

        const descChildren: ReactNode[] = [];
        descLines.forEach((l, j) => {
          if (j > 0) descChildren.push(<br key={`br-${j}`} />);
          descChildren.push(...parseSegment(l, `${key}-desc${j}`));
        });

        elements.push(
          <div key={key} className="flex gap-3 my-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[0.65em] font-bold text-accent ring-1 ring-accent/30">
              {num}
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-sm leading-snug text-text-primary">
                {titleNodes}
              </p>
              {descLines.length > 0 && (
                <p className="text-sm leading-relaxed text-text-secondary">
                  {descChildren}
                </p>
              )}
            </div>
          </div>,
        );
        continue;
      }

      // ── Paragraph ──────────────────────────────────────────────────────
      // Collect consecutive non-structural, non-blank lines.
      const paraLines: string[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (!l.trim()) break; // blank line ends paragraph
        if (isStructural(l)) break; // next element starts
        paraLines.push(l);
        i++;
      }
      if (paraLines.length > 0) {
        const children: ReactNode[] = [];
        paraLines.forEach((l, j) => {
          if (j > 0) children.push(<br key={`br-${j}`} />);
          children.push(...parseSegment(l, `${key}-p${j}`));
        });
        elements.push(
          <p key={key} className="text-sm leading-[1.75]">
            {children}
          </p>,
        );
      }
    }
  }

  // Auto-inject a group filter button when 2+ projects are mentioned
  const allSlugs = collectProjectSlugs(text);
  if (allSlugs.length >= 2) {
    elements.push(
      <div key="auto-filter" className="pt-1.5">
        <FilterButton slugs={allSlugs} />
      </div>,
    );
  }

  return <div className="space-y-2.5">{elements}</div>;
}
