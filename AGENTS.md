<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Chris Seckler — Source of Truth

**CHRIS.md** (at the repo root) is the single source of truth about Chris: his background, career, projects, skills, availability, personal facts, and fun details used by the portfolio's AI chat assistant.

**All agent sessions must:**
1. Read `CHRIS.md` at the start of any session involving this portfolio.
2. Update `CHRIS.md` whenever new information is learned about Chris — new projects, availability changes, skills, fun facts, anything.
3. When updating the live site content (`src/lib/content.ts`, `src/lib/projects.ts`), update `CHRIS.md` in parallel so the two stay in sync.
4. The AI chat system prompt is built in `src/lib/chat-system-prompt.ts` — if adding new personal context or fun facts, update that file too.

# Analytics events

PostHog named events live in `src/lib/analytics-events.ts`. Capture via `track()` in `src/lib/analytics.ts`.

**Always update `src/lib/analytics-events.ts` in the same change** when you add, rename, or remove a `track(...)` call. The `/ops` page renders that catalog. Do not invent event names that are not in the catalog.

Rules:
- Never call `posthog.identify()`. Visitors stay anonymous (`localStorage` distinct_id).
- Never capture on `/ops` (`track()` no-ops there; SDK opts out).
- Named event style: `[object] [verb]` in lowercase (`chat opened`, `project viewed`).
- Autocapture stays on for clicks/forms; named events are for funnels.
- Do not fire named events for ops/admin UI.

If you add a new public interaction (CTA, gallery, form, chat action), add a named event unless an existing one already covers it.

# Company / product knowledge (interview prep)

Chris will later get a **teach + quiz + checklist** page per company (what they sell, problems they faced, how he helped, with links). **Do not build that page until he asks.**

**Every session must:**
1. Treat [`docs/self/company-knowledge/`](docs/self/company-knowledge/README.md) as the index. One file per employer (start with `aerospike.md`).
2. When you learn anything about an employer’s products, architecture, glossary, public docs, or how Chris’s work maps onto them — **write it into that folder in the same session**. Do not leave it only in chat.
3. Separate public product truth from Chris’s ownership. Mark inferences. Never invent metrics.
4. Keep company files consistent with `CHRIS.md`.
5. Add useful links as you find them. If Chris is fuzzy on a name (e.g. ACMS), research the official term and record both.
