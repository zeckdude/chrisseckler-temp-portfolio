# chrisseckler.com — Portfolio Site

Personal portfolio for **Chris Seckler**, Senior Frontend Engineer. Built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. Deployed to Vercel.

All content is hardcoded in source (no CMS, no database). Updating the site means editing two TypeScript files and committing.

---

## Table of Contents

1. [Stack](#stack)
2. [External Services](#external-services)
3. [Environment Variables](#environment-variables)
4. [Project Structure](#project-structure)
5. [Updating Content](#updating-content)
   - [Adding / Editing Projects](#adding--editing-projects)
   - [Home / About / Contact Copy](#home--about--contact-copy)
6. [AI Chat Assistant](#ai-chat-assistant)
   - [How It Works](#how-it-works)
   - [Limits & Guardrails](#limits--guardrails)
   - [Checking Usage & Cost](#checking-usage--cost)
   - [Adjusting or Disabling the Bot](#adjusting-or-disabling-the-bot)
7. [Design System](#design-system)
8. [Development](#development)
9. [Deployment](#deployment)
10. [Dependency Reference](#dependency-reference)

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| UI library | React | 19.x |
| Styling | Tailwind CSS v4 | 4.x |
| Motion | Framer Motion | 13.x |
| AI SDK (server) | Vercel AI SDK | 7.x |
| AI SDK (client hooks) | @ai-sdk/react | 4.x |
| AI provider | @ai-sdk/anthropic | 4.x |
| Rate limiting | @upstash/ratelimit | 2.x |
| Redis client | @upstash/redis | 1.x |
| Schema validation | Zod | 4.x |
| Deployment | Vercel | — |

---

## External Services

The site depends on three external services. Two are free at the current usage level.

### 1. Vercel (hosting + Edge Functions)
- **What it does:** Hosts the site, serves static pages, and runs the `/api/chat` Edge Function (the AI chatbot backend).
- **Free tier:** Hobby plan covers this site indefinitely at current traffic.
- **Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **When to touch it:** Deploying (auto on git push), adding/changing environment variables, checking function logs, rolling back a bad deploy.

### 2. Anthropic (AI model)
- **What it does:** Powers the chat assistant. The site calls `claude-haiku-4-5` via the Anthropic API.
- **Model:** `claude-haiku-4-5` — Anthropic's fastest, cheapest current Haiku. List price is fetched weekly from OpenRouter into Redis; hardcoded fallback is `$1.00 / $5.00` per MTok (input/output) in `src/lib/ai-pricing.ts`.
- **Free tier:** None — you pay per token. At this site's traffic level the monthly cost is typically under $1.
- **Dashboard:** [console.anthropic.com](https://console.anthropic.com)
- **Key location:** `ANTHROPIC_API_KEY` environment variable (see below).
- **When to touch it:** Rotating a compromised key, checking spend, setting a monthly spend alert, upgrading the model string in `src/app/api/chat/route.ts`.

### 3. Upstash Redis (rate limiting + usage tracking)
- **What it does:** Two things: (1) enforces the 30-requests-per-hour-per-IP rate limit so a single visitor can't run up your Anthropic bill; (2) stores counters so you can see total chat usage.
- **Free tier:** 10,000 commands/day — more than enough for a portfolio. Would need an upgrade only if the site goes massively viral.
- **Dashboard:** [console.upstash.com](https://console.upstash.com)
- **Keys stored:** `chat:requests:total`, `chat:requests:daily:YYYY-MM-DD`, `chat:tokens:total`, `chat:tokens:daily:YYYY-MM-DD`
- **When to touch it:** Checking usage counters (Data Browser tab), adjusting rate limits (change `RATE_LIMIT_PER_HOUR` in `src/app/api/chat/route.ts`), rotating credentials.
- **⚠️ If Upstash is not configured:** The chatbot still works — rate limiting is silently skipped. This is intentional for local dev, but make sure both env vars are set in production.

### 4. Fontshare (typography)
- **What it does:** Serves Cabinet Grotesk (display font). Loaded via a `<link>` tag in `src/app/layout.tsx`.
- **Free tier:** Unlimited, free CDN.
- **⚠️ If Fontshare goes down or changes their URL:** The display font will fall back to `sans-serif` (because of the `display: swap` setting) and the site will still be readable, just less distinctive. Fix by downloading the font and self-hosting it in `public/fonts/`.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` for local development. Set the same keys in **Vercel → Project → Settings → Environment Variables** for Production (and Preview if you want ops/chat on preview deploys).

`NEXT_PUBLIC_*` values are baked in at **build time** — add them, then redeploy.

| Variable | Required | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes (chatbot won't work without it) | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| `UPSTASH_REDIS_REST_URL` | Recommended (rate limiting / logs disabled without it) | Upstash console → Redis → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | Same location as above |
| `UPSTASH_VECTOR_REST_URL` | Recommended (ops RAG disabled without it) | Upstash console → Vector → REST API |
| `UPSTASH_VECTOR_REST_TOKEN` | Recommended | Same location as above |
| `ADMIN_PASSWORD` | Yes for `/ops` | Any password you choose; same value locally and in Vercel |
| `CRON_SECRET` | Auto in Vercel production | Vercel injects this when Cron Jobs are enabled. Optional locally. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional (analytics) | PostHog project settings → write-only project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional | `https://us.posthog.com` (toolbar/dashboard host; events go through `/ingest`) |
| `POSTHOG_PERSONAL_API_KEY` | For live `/ops` PostHog data | PostHog → Settings → Personal API keys (server-only) |
| `POSTHOG_PROJECT_ID` | For live `/ops` PostHog data | Project settings → Project ID (`566729`) |

---

## Project Structure

```
src/
  app/                           Next.js App Router routes
    page.tsx                     Home page
    about/page.tsx               About page
    contact/page.tsx             Contact page
    projects/
      page.tsx                   Projects grid (imports ProjectsGrid + InlineChatPrompt)
      [slug]/page.tsx            Project detail / case study template
    api/
      chat/route.ts              AI chat API (Edge Function) — POST /api/chat
    layout.tsx                   Root layout: fonts, Nav, Footer, ChatProvider, ChatButton, ChatPanel
    globals.css                  Tailwind v4 @theme tokens (colors, fonts, spacing)

  components/
    chat/
      chat-button.tsx            Floating chat toggle button (bottom-right, site-wide)
      chat-panel.tsx             Sliding chat panel (messages, input, filter chips)
      inline-chat-prompt.tsx     Dismissable banner on /projects page
    motion/
      magnetic.tsx               Magnetic cursor hover effect
      page-transition.tsx        Fade+slide between pages (wraps <main> in layout)
      parallax-hero.tsx          Parallax scroll layers on the home hero
      reveal.tsx                 Scroll-triggered fade-in (Reveal / RevealGroup)
    ui/
      badge.tsx                  Employment type chip (Full-time / Freelance / Personal Project)
                                 Also exports CompanyChip (@ CompanyName)
      button.tsx                 Styled button variants
      icons.tsx                  Custom SVGs (GitHub, LinkedIn brand marks)
      project-card.tsx           Card used in the /projects grid
      project-gallery.tsx        Horizontal scrolling image/video slideshow on detail pages
      project-lightbox.tsx       Full-screen modal viewer opened from gallery
      project-thumbnail.tsx      Thumbnail image or initial-letter fallback
      tech-chip.tsx              Pill label for tech stack items
    nav.tsx                      Top navigation bar
    footer.tsx                   Footer
    projects-grid.tsx            Projects grid + multi-select badge filter

  lib/
    projects.ts                  ★ All project content + Project type definition
    content.ts                   ★ Home/About/Contact copy + siteConfig
    chat-context.tsx             React context for chat open/close state + AI-driven filter state
    chat-system-prompt.ts        Builds the AI system prompt from projects.ts + content.ts at request time
    render-with-code.tsx         Parses `backtick` strings into <code> elements in JSX
    utils.ts                     cn() Tailwind class merging helper
```

**★ = the two files you'll touch most when maintaining the site.**

---

## Updating Content

### Adding / Editing Projects

Edit `src/lib/projects.ts`. Each project is a typed `Project` object in the `projects` array.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `slug` | `string` | URL path: `/projects/{slug}`. Use kebab-case. Never change a slug after deploying — it'll break any existing links. |
| `title` | `string` | Project name |
| `company` | `string?` | Shown as `@ Company` chip below the badge |
| `badge` | `"professional" \| "freelance" \| "personal"` | Drives the filter chips and badge color |
| `category` | `"professional" \| "personal-freelance"` | Legacy field kept for type compatibility — badge is what actually matters now |
| `dates` | `string` | Free-form, e.g. `"2022 – 2024"` |
| `tagline` | `string` | One-line summary shown on the card |
| `techStack` | `string[]` | Shown as chips on the detail page |
| `overview` | `string` | Lead paragraph on the detail page |
| `problem` | `string?` | Optional "The Problem" section |
| `whatIBuilt` | `WhatIBuiltItem[]?` | Each item is `{ title, problem, fix, result }`. Wrap code names in backticks: `` `ComponentName` `` → renders as `<code>` |
| `outcome` | `string?` | Optional "Outcome / Impact" section |
| `links.live` | `string?` | URL for the "Live Site" button |
| `links.liveNote` | `string?` | Shown instead of a live button when the site is behind auth or gone |
| `links.github` | `string?` | GitHub link |
| `links.company` | `string?` | Company site link |
| `featured` | `boolean?` | Not currently used in the UI but reserved |
| `images` | `string[]?` | Paths under `/public`, e.g. `"/projects/my-project/1-home.png"`. First image is the card thumbnail. |
| `imageCaptions` | `Array<{ headline?, caption? } \| null>?` | Indexed parallel to `images`. Use `null` for a slide with no caption. |
| `videoSrc` | `string?` | Path to an `.mp4` under `/public`. Shown as the first slide in the gallery. |

**Adding a new project checklist:**
1. Create a folder at `public/projects/{slug}/` and drop images/videos there.
2. Add an entry to the `projects` array in `projects.ts`.
3. `npm run build` to verify no type errors.
4. Commit and push — Vercel deploys automatically.

The project detail page (`/projects/[slug]`) uses `generateStaticParams`, so it's **fully static** — no server rendering needed. Adding a project and pushing is all it takes.

### Home / About / Contact Copy

Edit `src/lib/content.ts`. The file exports:
- `siteConfig` — name, title, email, LinkedIn URL, GitHub URL. Email and social links appear in multiple places; change them here and they update everywhere.
- `home` — the hero positioning line and "currently" line.
- `about` — headline, bio paragraphs, tech stack groups, career timeline.
- `contact` — headline and body paragraph.

---

## AI Chat Assistant

### How It Works

A floating chat button (bottom-right on every page) opens a panel powered by Anthropic's Claude. There's also a dismissable prompt banner on the `/projects` page.

The full pipeline:

```
Visitor types message
        ↓
POST /api/chat  (Edge Function on Vercel)
        ↓
Upstash Redis → rate-limit check (30 req/hr per IP)
        ↓
Build system prompt from projects.ts + content.ts  (happens at request time, always current)
        ↓
Anthropic API → claude-3-haiku-20240307  (streams response)
        ↓
If AI calls filterProjects tool → updates the projects grid filter live
        ↓
Stream back to browser via useChat (AI SDK)
```

The system prompt is built fresh on every request by `src/lib/chat-system-prompt.ts`. It includes all project data, bio, tech stack, career timeline, and contact info. If you update `projects.ts` or `content.ts`, the chatbot knows about it immediately on the next deploy — no extra step needed.

### Limits & Guardrails

These are all configurable in `src/app/api/chat/route.ts`:

| Limit | Current value | Constant / location |
|---|---|---|
| **Rate limit** | 30 requests per IP per hour | `RATE_LIMIT_PER_HOUR = 30` (line 14) |
| **Max conversation turns per session** | 20 user messages | `MAX_TURNS = 20` (line 13). Enforced client-side in the panel UI; also checked server-side as `messages.length > MAX_TURNS * 2` |
| **Max tokens per response** | 600 output tokens (~450 words) | `maxOutputTokens: 600` (line 90) |
| **Model** | claude-3-haiku-20240307 | `anthropic("claude-3-haiku-20240307")` (line 87) |
| **What the AI can discuss** | Only content in the system prompt (projects, bio, tech, contact) | System prompt instructs: "Only share information explicitly provided above. Do not speculate or invent details." |
| **What the AI won't discuss** | Salary, availability timeline, or anything not in the data files | System prompt instructs: "If asked about salary, availability timeline, or anything not in the data above, say you can't speak to that but suggest they reach out directly." |

**Rate limit behavior:** After 30 requests in a rolling 1-hour window from the same IP, the API returns HTTP 429. The client shows a generic error message. The window resets automatically — no manual action needed.

**Session limit behavior:** After 20 turns, the input is disabled and a message tells the user to refresh to start a new chat. This is a per-browser-session limit (resets on page refresh), not a per-IP limit.

**No authentication:** The API is public. Anyone who finds the `/api/chat` endpoint can call it. The rate limiter and token cap are the only cost controls. If you see unexpected Anthropic spend, rotate your API key immediately.

### Checking Usage & Cost

**Anthropic cost dashboard:**
[console.anthropic.com/settings/billing](https://console.anthropic.com/settings/billing) — shows spend by day and by model.

**Vercel function logs (per-request token counts):**
Vercel Dashboard → your project → Deployments → click a deployment → Functions → `/api/chat`. Every request logs:
```
[chat] ip=1.2.3.4 remaining=29
[chat] tokens input=1823 output=214 total=2037
```

**Upstash usage counters (cumulative totals):**
Upstash Console → your database → **Data Browser** tab → search for `chat:`. You'll see:

| Key | What it counts |
|---|---|
| `chat:requests:total` | All-time total chat requests |
| `chat:requests:daily:2026-08-17` | Requests on a given day |
| `chat:tokens:total` | All-time total tokens processed |
| `chat:tokens:daily:2026-08-17` | Tokens on a given day |

**Rough cost math:**
- Each chat turn uses ~1,500–2,500 total tokens (mostly input because the system prompt + history are re-sent each turn).
- At haiku pricing: 1,000 turns ≈ $2–5.
- At 10 visitors/day doing 3 turns each: ~$0.05–0.15/month.

### Adjusting or Disabling the Bot

**To change the rate limit:** Edit `RATE_LIMIT_PER_HOUR` in `src/app/api/chat/route.ts`.

**To change the conversation turn limit:** Edit `MAX_TURNS` in `src/app/api/chat/route.ts` and the matching `MAX_TURNS` constant at the top of `src/components/chat/chat-panel.tsx`.

**To change the response length:** Edit `maxOutputTokens` in `src/app/api/chat/route.ts`.

**To upgrade the model:** Change the string in `anthropic("claude-haiku-4-5")`. Use the model ID from [docs.anthropic.com/models](https://docs.anthropic.com/en/docs/about-claude/models/overview). Smarter models cost more per token.

**To disable the bot entirely:** Remove `<ChatButton />` and `<ChatPanel />` from `src/app/layout.tsx`, and remove `<InlineChatPrompt />` from `src/app/projects/page.tsx`. The API route can stay — it just won't be called.

---

## Design System

All design tokens (colors, fonts, spacing, container widths) are defined in `src/app/globals.css` under `@theme inline`. This is Tailwind v4 syntax — tokens here become utility classes automatically (e.g. `bg-bg`, `text-accent`, `text-text-secondary`).

**Color tokens:**
- `--color-bg` — page background (near-black)
- `--color-surface` — card/panel backgrounds (slightly lighter)
- `--color-border` — subtle borders
- `--color-text-primary` — body text
- `--color-text-secondary` — muted/supporting text
- `--color-accent` — cyan highlight (`#38bdf8`)
- `--color-accent-dim` — low-opacity accent for chip backgrounds

**Badge colors** are hardcoded in `src/components/ui/badge.tsx` using Tailwind's built-in emerald/amber/sky palettes (not custom tokens). If the palette changes, update that file.

**Fonts:**
- `Cabinet Grotesk` — display headings, loaded from Fontshare CDN in `src/app/layout.tsx`
- `Inter` — body text, via `next/font/google`
- `JetBrains Mono` — monospace/code labels, via `next/font/google`

The full design brief and component rules are in `PRODUCT.md`.

---

## Development

```bash
npm install
npm run dev      # http://localhost:3000

# The chatbot requires ANTHROPIC_API_KEY in .env.local to work locally.
# Upstash env vars are optional locally — rate limiting is silently skipped without them.

npm run build    # production build — run this before pushing to catch type errors
npm run lint
```

---

## Deployment

The site deploys automatically to Vercel on every push to `main`.

**Manual deploy:**
```bash
# Install Vercel CLI if you don't have it
npm i -g vercel
vercel --prod
```

**Environment variables in production:**
All three variables must be set in Vercel → Project → Settings → Environment Variables:
- `ANTHROPIC_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

**Rotating an API key (e.g. after a leak):**
1. Generate a new key in the Anthropic or Upstash console.
2. Update the value in Vercel's environment variable settings.
3. Trigger a redeploy (push a commit or use the Vercel dashboard).
4. Revoke the old key.

---

## Dependency Reference

Key packages and what they do, for when you need to upgrade them.

| Package | Purpose | Docs |
|---|---|---|
| `next` | Framework, routing, image optimization, static generation | [nextjs.org/docs](https://nextjs.org/docs) |
| `react` | UI rendering | [react.dev](https://react.dev) |
| `tailwindcss` | Styling (v4 — different config format than v3) | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| `framer-motion` | Page transitions, scroll reveals, parallax, magnetic hover | [motion.dev/docs](https://motion.dev/docs) |
| `ai` (Vercel AI SDK) | `streamText`, `tool`, `convertToModelMessages` for the chat route | [sdk.vercel.ai/docs](https://sdk.vercel.ai/docs) |
| `@ai-sdk/react` | `useChat` hook, `DefaultChatTransport` for the chat UI | [sdk.vercel.ai/docs/ai-sdk-ui](https://sdk.vercel.ai/docs/ai-sdk-ui) |
| `@ai-sdk/anthropic` | Anthropic model provider for the AI SDK | [sdk.vercel.ai/providers/anthropic](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic) |
| `@upstash/ratelimit` | Sliding-window rate limiter backed by Redis | [upstash.com/docs/oss/sdks/ts/ratelimit](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview) |
| `@upstash/redis` | Redis client for Upstash REST API | [upstash.com/docs/oss/sdks/ts/redis](https://upstash.com/docs/oss/sdks/ts/redis/overview) |
| `zod` | Schema validation for AI tool inputs | [zod.dev](https://zod.dev) |
| `lucide-react` | Icon set | [lucide.dev](https://lucide.dev) |

> **Upgrading `ai` / `@ai-sdk/*`:** These packages are versioned together and the APIs change between major versions. The current code targets AI SDK v7 (server) + v4 (react). When upgrading, check for breaking changes in `streamText`, `useChat`, `UIMessage`, and the message part types (`tool-<toolName>` format replaced `tool-invocation` in v6).

> **Upgrading Tailwind v4:** The config format changed significantly from v3 (CSS-based `@theme` instead of `tailwind.config.js`). Read the migration guide before upgrading. The `@theme inline` block in `globals.css` is v4-specific.
