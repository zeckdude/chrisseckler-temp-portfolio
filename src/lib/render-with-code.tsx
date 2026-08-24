/**
 * Renders a string that may contain `backtick-wrapped` tokens and
 * [markdown links](/path) as React nodes.
 */
import Link from "next/link";

const RICH_TEXT_TOKEN = /(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;

export function renderWithCode(text: string): React.ReactNode {
  if (!text.includes("`") && !/]\([^)]+\)/.test(text)) return text;

  const parts = text.split(RICH_TEXT_TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.82em] text-accent ring-1 ring-border"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          const linkClassName =
            "font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent";

          if (href.startsWith("/")) {
            return (
              <Link key={i} href={href} className={linkClassName}>
                {label}
              </Link>
            );
          }

          return (
            <a key={i} href={href} className={linkClassName} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          );
        }

        return part;
      })}
    </>
  );
}
