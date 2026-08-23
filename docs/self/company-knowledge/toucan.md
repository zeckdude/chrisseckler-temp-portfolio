# Toucan — company and product brief

Last updated: 2026-08-20. Mix of **public product truth** and **Chris’s memory** from the case-study interview. Inferences are labeled.

Chris: Senior Software Engineer I → II, Dec 2019 – Mar 2023. Joined early (often called Employee #1 in portfolio copy — **verify title vs day-one cohort**). Live: https://jointoucan.com

---

## What Toucan is (one breath)

Toucan is a **language-learning Chrome extension** (plus web app) that replaces select words on pages you're already reading with vocabulary in a language you're learning — passive practice while browsing.

Chris did **not** invent the company or the original extension idea. He joined as an early engineer and **took over extension development**, then **architected and built the website from scratch**.

---

## Day one (Chris’s memory — T1, 2026-08-20)

**What already existed:**
- **CTO + a contractor** had built a **basic Chrome extension** that could swap words on a page.
- It was **clunky** and **did not change many words** (low coverage / rough implementation).

**Who started when:**
- Chris arrived expecting “employee #1” framing, but **two other engineers started the same day** — **one FE, one BE**.
- Not a solo-engineering hire on day one; a **small founding engineering cohort**.

**Chris’s first ~6 months (and first year):**
- **Took over extension development** — adjusted logic and features within the extension.
- **Started the website from scratch** — architected it from the beginning.
- A **designer was hired around the same time**; Chris worked closely with her so the **design system would transfer cleanly** into the **component library he chose**.
- **Year 1:** extension **and** website.
- **After year 1:** moved to **website only** (extension ownership handed off or narrowed — confirm who owned extension after).

**Core Web Vitals 35 → 98 (T3, 2026-08-20):**
- **Marketing / public Next.js site only** — not the extension.
- **LCP + JavaScript** on first paint; assets **loading in late**.
- **Web fonts loading late** hurt the score.
- Another element rendered **a split second later** — barely noticeable to users but still damaged CWV (exact component: Chris does not recall — do not name in copy).

**Metrics attribution (T4, 2026-08-20):**
- **1M users / 13M page views** = **company outcomes** — Chris does **not** claim sole credit.
- **His surfaces:** Next.js site (homepage, signup, dashboard, subscription) + extension in year 1; site-only after year 1.
- **13M PVs** ≈ public/marketing + logged-in web he built — frame as surfaces shipped, not personal growth hacking.

**Founders / leadership:** CTO had hands-on prototype code; Chris’s lane was making extension + web **shippable and scalable**, not greenfield invention of the product concept.

---

## Glossary

| Term | What it is | Chris’s surface? |
|---|---|---|
| **Contextless learning moments** | In-product name for word replacement on arbitrary third-party pages without page-specific integration | Extension — first year (T2 not yet locked) |
| **Sidebar** | Extension UI chrome | Extension — first year |
| **Next.js site** | Marketing, signup, dashboard, subscription | Architected from scratch; primary focus after year 1 |
| **Component library** | Shared UI primitives aligned with design system | Chris picked the library; paired with designer on tokens/patterns |

---

## Copy corrections vs current portfolio

| Old / implied | Corrected |
|---|---|
| “Joined pre-product as the only engineering hire” | Small eng cohort day one (Chris + 1 FE + 1 BE); CTO+contractor prototype existed |
| “Building the product from the ground up alongside the founders” | Took over clunky prototype; built site from scratch; year 1 both, then site focus |
| “Employee #1” without nuance | **Corrected:** early engineer; slugs **`toucan-browser-extension`**, **`toucan-safari-extension`**, **`toucan-website`** |
| Chrome-only extension | **Browser extension** on desktop; **Safari mobile = separate solo project** |
| CWV on “the site” without scope | **Marketing site only** — LCP, JS, late fonts/layout |
| Personal credit for 1M users / 13M PVs | **Company metrics** — own surfaces, not sole credit |

Do not say Chris was the **only** engineer on day one.

---

## Phase 2

- **T2:** contextless learning moments — DOM / performance
- **T5:** A/B testing — one experiment that moved subscription
- **T7:** mentorship and hiring bar (website project)
- Who owned the extension after year 1?

## Locked (own case studies)

- **T6:** Mobile Safari solo port → `toucan-safari-extension`
- **T3, T4, T8:** website project
- **T1:** shared context across Toucan projects

---

## Links

- https://jointoucan.com
- Chrome Web Store (extension) — add URL when confirmed
