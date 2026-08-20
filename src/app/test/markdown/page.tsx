import { ChatMarkdown } from "@/components/chat/chat-markdown";

// ─── Sample markdown strings exercising every supported element ──────────────

const PARAGRAPHS = `
This is a plain paragraph. It has multiple sentences and should wrap naturally at whatever width the container provides. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

This is a second paragraph separated by a blank line. It demonstrates that double line breaks create distinct blocks with breathing room between them.
`.trim();

const INLINE_FORMATTING = `
**Bold text** is for strong emphasis — company names, project titles, key terms.

*Italic text* is for lighter emphasis or nuance.

Combine them: **this is bold** and *this is italic* and \`this is inline code\` all in one sentence.

A raw URL renders as a link: https://github.com/zeckdude

A markdown link: [Chris's GitHub](https://github.com/zeckdude)

An email: chris@example.com

**Bold code combo:** \`**bold in code is just code**\` — backticks always win.
`.trim();

const HEADINGS = `
# h1 — Top-level Heading

The largest heading. Bold, full body text size. Used sparingly for major response titles.

---

## h2 — Section Heading

Small caps, uppercase, tracked. Used for major section labels. Styled with muted color to feel like a label, not a title.

### h3 — Sub-section Heading

Bold, slightly larger than body text, normal case. Used for named sub-topics within a section. Sits between the labeled section (h2) and regular paragraph text.

A paragraph immediately under an h3 to confirm the spacing gap between heading and body text looks right.

---

## h2 again

This confirms h2 spacing is consistent across multiple occurrences.

### h3 again

And h3 as well. Both should feel visually distinct from each other and from the body text below.

Normal paragraph text here — this is the baseline. Compare its weight and size to both headings above.
`.trim();

const HORIZONTAL_RULE = `
Content above the divider. This section wraps up a topic.

---

Content below the divider. This starts a new topic. The rule should be clearly visible but not heavy-handed.

---

A second divider for good measure.
`.trim();

const UNORDERED_LISTS = `
Here is a simple unordered list:

- First item with some longer text that might wrap onto a second line to verify alignment stays correct
- Second item
- Third item with **bold text** inside the list item
- Fourth item with \`inline code\` inside the list item
- Fifth item with a [link](https://example.com) inside

A list immediately following a paragraph intro (no blank line):
- Item A
- Item B
- Item C
`.trim();

const ORDERED_LISTS = `
Here are numbered steps. Each step has a description attached (single newline):

1. Get the right people in the room early
Before any design or code happens, bring together engineering, product, and design. This isn't a handoff — it's a collaborative discovery.

2. Write a templated RFD
For substantial features, document the entire scope: problem, users, business case, technical requirements, architecture impact, and timeline feasibility.

3. Run a structured review
Present the RFD to other senior engineers. Push back on assumptions. Stress-test the architecture. Surface edge cases.

4. Hand off an implementation-ready plan
By the time engineering starts building, the approach is locked: component boundaries, API contracts, database schema, error handling strategy.
`.trim();

const BLOCKQUOTES = `
A single-line blockquote:

> I build side projects the way most people watch TV.

A multi-line blockquote:

> Design systems create disproportionate leverage. When you partner with design to establish a system, build a component library mapped to it, document in Storybook, and set up ongoing communication — you make changes in one place and they ripple everywhere.
`.trim();

const CODE_BLOCK = `
Here is a TypeScript code block:

\`\`\`typescript
export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) throw new Error("User not found");
  return response.json();
}
\`\`\`

And a shell snippet:

\`\`\`bash
npm run dev
git add . && git commit -m "feat: add markdown renderer"
\`\`\`
`.trim();

const TABLE = `
Here is a feature comparison table:

| Feature | Problem Solved | Impact |
|---------|----------------|--------|
| **StepIndicator** | Users dropped off mid-setup with no progress visibility | Reduced abandonment |
| **Smart defaults** | Non-technical users misconfigured availability zones | Fewer errors |
| **Inline validation** | Users hit errors at the end, forced to backtrack | Reduced re-entry |
| **Review screen** | Costly mistakes after cluster creation | Prevented data loss |
| \`localStorage\` state | Refreshing lost all wizard progress | Seamless iteration |

A minimal two-column table:

| Key | Value |
|-----|-------|
| Language | TypeScript |
| Framework | Next.js |
| Styling | Tailwind CSS |
`.trim();

const MIXED_CONTENT = `
## Mixed Content Response

This is the kind of response the AI assistant might actually generate — it mixes multiple element types fluidly.

Chris is a **systems thinker** who scales process to match the problem. Here's a brief breakdown:

### For Big Features

1. Align stakeholders first
Get engineering, product, and design in the same room before any code is written.

2. Write an RFD
Document problem, users, business case, technical requirements, and timeline.

3. Review and ship
Present to senior engineers, incorporate feedback, then hand off an implementation-ready plan.

### For Small Issues

- Look at the existing code
- Understand the context
- Ship it

> "The process scales down as the problem gets smaller."

---

### Design System Superpower

| Deliverable | Description |
|-------------|-------------|
| Design system | Shared tokens, spacing, color, type scales |
| Component library | React components mapped to design system |
| Storybook docs | Living documentation for every component |
| Team process | Ongoing design ↔ engineering communication |

The result: **faster onboarding**, changes in one place, higher consistency and quality across the whole product.

Here's a quick example of what a component might look like:

\`\`\`typescript
import { Button } from "@/components/ui/button";

export function ExampleCTA() {
  return (
    <Button variant="primary" size="md">
      View Case Study
    </Button>
  );
}
\`\`\`

You can reach Chris at chris@example.com or visit [his GitHub](https://github.com/zeckdude).
`.trim();

// ─── Page component ──────────────────────────────────────────────────────────

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">{title}</p>
      <ChatMarkdown text={content} />
    </div>
  );
}

export default function MarkdownTestPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] px-4 py-12 text-white">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Markdown Renderer Test</h1>
          <p className="mt-1 text-sm text-white/40">
            Every supported markdown element rendered in a chat bubble context.
          </p>
        </div>

        <Section title="Plain Paragraphs" content={PARAGRAPHS} />
        <Section title="Inline Formatting (bold, italic, code, links)" content={INLINE_FORMATTING} />
        <Section title="Headings (h2, h3)" content={HEADINGS} />
        <Section title="Horizontal Rules" content={HORIZONTAL_RULE} />
        <Section title="Unordered Lists" content={UNORDERED_LISTS} />
        <Section title="Ordered Lists (Step Groups)" content={ORDERED_LISTS} />
        <Section title="Blockquotes" content={BLOCKQUOTES} />
        <Section title="Code Blocks" content={CODE_BLOCK} />
        <Section title="Tables" content={TABLE} />
        <Section title="Mixed Content (realistic AI response)" content={MIXED_CONTENT} />
      </div>
    </div>
  );
}
