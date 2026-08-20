/**
 * Renders a string that may contain `backtick-wrapped` tokens as a React
 * node, replacing each token with a <code> element styled to match the
 * site's dark-mode code aesthetic.
 */
export function renderWithCode(text: string): React.ReactNode {
  if (!text.includes("`")) return text;

  const parts = text.split(/(`[^`]+`)/g);
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
        return part;
      })}
    </>
  );
}
