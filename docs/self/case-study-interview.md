# Case study interview

Interview notes for bringing every project detail page up to a senior-FE bar: specific enough that a demanding engineering manager would not dismiss it as resume prose.

**How to use this file**
- Status table is the scoreboard. Update it as projects lock or questions defer.
- **Two phases (2026-08-20):**
  - **Phase 1 — Ship-ready:** Answer only the [minimum questions](#phase-1--ship-ready-minimum) per project so `projects.ts` / `CHRIS.md` can be updated and the projects page is honest enough to publish. Then run a **verification pass** for that project.
  - **Phase 2 — Full EM bar:** Come back and finish the [full question bank](#question-banks) for interview depth. Tracked in [Phase 2 backlog](#phase-2-backlog-full-interview).
- Answer in chat via **multiple-choice UI** (AskQuestion) when Cursor provides it; otherwise reply with question IDs (`T1`, `D7`, …) or plain text. One **(Recommended)** when we have a strong inference; **Other** for custom answers.
- After **Phase 1 minimum** (or full bank) for a project is answered, run a **verification pass**: check `projects.ts`, `CHRIS.md`, tech stacks, and company files before writing copy to the live site.
- **Detail page table (`whatIBuilt`):** Each project’s case study renders **Problem → Fix → Result** per row (see `WhatIBuiltItem` in `projects.ts`). Phase 1 answers must capture enough to populate those rows — not just narrative fluff. When Chris answers, extract or ask for: **what was broken (problem)**, **what you built (fix)**, **what changed for users or the business (result)** — honest, no invented metrics.
- Say **save for later** via Other or a dedicated option when research is needed. Those go to [Deferred](#deferred). **Full Phase 1 batch with context + A–E options:** [v1-interview-defer.md](v1-interview-defer.md).
- Do not invent metrics. An honest “I don’t have the number” is better than “measurably.”
- If a question is a pile of asks, split it. Prefer one probe the EM would not let you dodge.

**Resume in a new chat:** “Continue Phase 1 case study interview from `docs/self/case-study-interview.md`. Start at the first project with open minimum questions.”

**The bar (what “locked” means)**
A case study is locked when it can survive these EM probes without adjectives doing the work:

1. **Stakes** — who was hurt, and what it cost (user and business)
2. **Ownership** — what you owned vs the team, and why you were the one
3. **Hard part** — a constraint a junior would not solve by dropping in a library
4. **Tradeoff** — one thing you chose and one thing you rejected, with a reason
5. **Evidence** — a result that is not an adjective (a number, a migration, a pattern that outlasted you, a named operational change)

---

## Status

**20 projects on the site** after splits (Toucan ×3, Dave ×3) and scope cleanup (Trailer Park role page unpublished). AutoMD and Pro Print remain `CHRIS.md` only.

| Remaining | Count |
|---|---|
| Phase 1 (ship-ready) — projects not yet minimum-complete | **0** |
| Phase 1 — minimum questions still open | **0** (locked 2026-08-23 — see [Notes](#phase-1-locked-2026-08-23)) |
| Phase 2 (full EM bar) — questions still open | **~77** |
| Deferred (saved for research) | **0** |
| Scope resolved without interview | **1** (Trailer Park role page only) |
| Fully locked (Phase 1 + 2 + site verified) | **1** (Aerospike) |
| Phase 1 interview locked, site verified | **20** (all projects on grid) |

### Phase 1 progress (ship-ready minimum)

| Project | Min Qs | Done | Open (Phase 1) | Phase 1 status | Full bank left (Phase 2) |
|---|---|---|---|---|---|
| Aerospike Cloud Console | 8 | 8 | — | **Ship-ready ✓** (verified on site) | 0 (+ A3 tradeoff optional later) |
| Toucan — Browser Extension | 4 | 4 | — | **Phase 1 ✓** (2026-08-20) | T2, T5 |
| Toucan — Safari Extension | 1 | 1 | — | **Phase 1 ✓** (T6 locked) | — |
| Toucan — Web Platform | 4 | 4 | — | **Phase 1 ✓** (2026-08-20) | T7 |
| Dave — Support Tooling | 3 | 3 | — | **Phase 1 ✓** (2026-08-20) | D3, D4 |
| Dave — Mobile App | 1 | 1 | — | **Phase 1 ✓** (2026-08-20) | D6 |
| Dave — Public Website | 1 | 1 | — | **Phase 1 ✓** (2026-08-20) | — |
| Adim | 3 | 3 | — | **Phase 1 ✓** (2026-08-21) | AD3, AD4, AD5 |
| HuntCalm | 3 | 3 | — | **Phase 1 ✓** (2026-08-23) | H2, H3, H4 |
| Exact Recall | 3 | 3 | — | **Phase 1 ✓** (2026-08-23) | E2, E3, E4 |
| NumPy Dojo | 3 | 3 | — | **Phase 1 ✓** (2026-08-23) | N2, N5 |
| Fox International Portal | 3 | 3 | — | **Phase 1 ✓** (2026-08-23) | F1 |
| Custom Analytics Platform | 3 | 3 | — | **Phase 1 ✓** (2026-08-23) | CA2 |
| Tag My Web | 3 | 3 | — | **Phase 1 ✓** (2026-08-23) | TM3 |
| Chrome River | 3 | 3 | — | **Phase 1 ✓** (2026-08-23) slug `chrome-river-expense-reporting` | CR2, CR4, CR6 |
| Cartoon Universe | 3 | 3 | — | **Phase 1 ✓** (2026-08-23) | CU2 |
| Warner Bros. 300 | 2 | 2 | — | **Phase 1 ✓** (2026-08-23) | W2 |
| Applied Materials Order Center | 2 | 2 | — | **Phase 1 ✓** (2026-08-23) | AM3 |
| Print Custom Calendar | 2 | 2 | — | **Phase 1 ✓** (2026-08-23) | P2 |
| HomeSearch | 4 | 4 | — | **Phase 1 ✓** (2026-08-23) | — |
| ~~Trailer Park (role page)~~ | — | — | — | **Unpublished** (TP1/TP6 → redirect) | — |

### Legacy status (detail)

| Project | Bar today | Remaining Qs (full bank) | Status |
|---|---|---|---|
| Aerospike Cloud Console | Interview complete 2026-08-20. Site verified. | 0 | **Locked** |
| Toucan (×3) | Phase 1 locked 2026-08-20. Site verified. | 4 (Phase 2) | **Phase 1 done** |
| Dave.com (×3) | Phase 1 locked 2026-08-20. Site verified. | 3 (Phase 2) | **Phase 1 done** |
| Adim | Phase 1 locked 2026-08-21. Site verified. | 3 (Phase 2) | **Phase 1 done** |
| HuntCalm | Phase 1 locked 2026-08-23. AI-directed build; in progress. | 5 | **Phase 1 done** |
| Exact Recall | Phase 1 locked 2026-08-23. In progress; search unmeasured. | 5 | **Phase 1 done** |
| NumPy Dojo | Phase 1 locked 2026-08-23. AI-assisted engine. | 5 | **Phase 1 done** |
| Fox International Portal | Phase 1 locked 2026-08-23. | 4 | **Phase 1 done** |
| Custom Analytics Platform | Phase 1 locked 2026-08-23. Laravel by preference. | 4 | **Phase 1 done** |
| Tag My Web | Phase 1 locked 2026-08-23. | 4 | **Phase 1 done** |
| Chrome River | Phase 1 locked 2026-08-23. `chrome-river-expense-reporting`. | 6 | **Phase 1 done** |
| Cartoon Universe | Phase 1 locked 2026-08-23. | 4 | **Phase 1 done** |
| Warner Bros. 300 | Phase 1 locked 2026-08-23. | 3 | **Phase 1 done** |
| Applied Materials Order Center | Phase 1 locked 2026-08-23. | 3 | **Phase 1 done** |
| Print Custom Calendar | Phase 1 locked 2026-08-23. | 3 | **Phase 1 done** |
| HomeSearch | Phase 1 locked 2026-08-23. Honest demo on grid. | — | **Phase 1 done** |
| ~~Trailer Park role page~~ | Unpublished — overlaps Fox / 300 / CU | — | **Removed** |

---

## Phase 1 — Ship-ready minimum

Goal: each project page has **problem, honest ownership, one defensible hard part, and honest evidence** — enough to publish without resume fluff. Not the full staff-interview depth.

| Project | Minimum questions (answer these for Phase 1) | Maps to bar |
|---|---|---|
| **Aerospike** | A1–A8 + A9 ✓ | All five |
| **Toucan — Extension** | **T1** (extension portions) ✓ | T2 (contextless DOM) |
| **Toucan — Website** | **T1, T3, T4, T8** ✓ | T5, T6, T7 |
| **Dave — Support** | **D1, D2, D7** ✓ · **D5** (public site) open | D3, D4 |
| **Dave — Mobile** | Split from combined case study; **D6** Phase 2 | D6 |
| **Adim** | **AD1** · **AD2** · **AD6** | Stakes, ownership, evidence |
| **HuntCalm** | Confirm **problem** on page · **H1** (LinkedIn/shadow DOM hard part) · **H5** (honest usage today) | Hard part, evidence |
| **Exact Recall** | Confirm **problem** · **E1** (why interview-then-finalize) · **E5** (one honest gap in prod) | Hard part, tradeoff |
| **NumPy Dojo** | **N1** (what the engine really implements) · **N3** (custom engine vs Pyodide) · **N4** (metric or honest ceiling) | Hard part, tradeoff, evidence |
| **Fox International Portal** | **F3** (you vs PHP/CMS team) · **F2** (hardest JS problem) · **F4** (metric or “shipped for N locales”) | Ownership, hard part, evidence |
| **Custom Analytics Platform** | **CA1** (tracking pipeline, rough scale) · **CA3** (WP→Laravel — why incremental) · **CA4** (did client act on data?) | Hard part, tradeoff, evidence |
| **Tag My Web** | **TM1** (dates) · **TM2** (YouTube quota/sync — the hard part) · **TM4** (outcome) | Ownership, hard part, evidence |
| **Chrome River** | **CR1** · **CR3** · **CR5** | Ownership, hard part, evidence |
| ~~**Trailer Park**~~ | ~~**TP1** · **TP6**~~ | **Resolved:** page unpublished |
| **Cartoon Universe** | **CU1** · **CU3** · **CU4** | Stakes, ownership, evidence |
| **Warner Bros. 300** | **W1** · **W3** | Ownership, evidence |
| **Applied Materials** | **AM2** (PDF preview/print) · **AM1** (rough volume or “internal cafeteria scale”) | Hard part, stakes |
| **Print Custom Calendar** | **P1** (print CSS) · **P3** (outcome) | Hard part, evidence |
| **HomeSearch** | **HS1** (keep on site) · **HS2** (dates) · **HS3** (data source) · **HS4** (interesting behavior) | Scope, ownership, hard part, evidence |

After Phase 1 answers for a project → verification pass → update `projects.ts` + `CHRIS.md` → mark **Phase 1 complete** in the table above.

---

## Phase 2 backlog (full interview)

Return here when you want staff-level depth. Everything in [Question banks](#question-banks) **not** listed in Phase 1 minimum for that project.

| Project | Phase 2 only (not needed to ship page) |
|---|---|
| Aerospike | Optional: **A3** (Context vs Redux/XState — tradeoff story) |
| Toucan | **T2, T5, T6, T7** (+ who owned extension after year 1) |
| Dave.com | **D3, D4, D6** |
| Adim | **AD3, AD4, AD5** |
| HuntCalm | **H2, H3, H4** |
| Exact Recall | **E2, E3, E4** |
| NumPy Dojo | **N2, N5** |
| Fox International Portal | **F1** |
| Custom Analytics Platform | **CA2** |
| Tag My Web | **TM3** |
| Chrome River | **CR2, CR4, CR6** |
| Trailer Park | **TP2, TP3, TP4, TP5** (if page kept) |
| Cartoon Universe | **CU2** |
| Warner Bros. 300 | **W2** |
| Applied Materials | **AM3** |
| Print Custom Calendar | **P2** |
| HomeSearch | **HS2, HS3, HS4, HS5** (if page kept) |

**Also open across projects:** Aerospike ACMS migration customer count (deferred research).

---

## Aerospike Cloud Console — EM read

**What already passes**
- Stakes are real: provisioning is the trial-to-revenue moment; drop-off is lost revenue.
- Ownership is specific: architected the provisioning wizard and built many pages; other Cloud FEs shipped against those patterns — not “sole FE” or “no handoffs.”
- Wizard items name real FE problems: flow-aware navigation, upstream invalidation, async fields, localStorage hydration, JSON/YAML conflict detection. A manager who has shipped a multi-step config flow will recognize these.
- ACMS called out as a live migration, not a rewrite in a vacuum.

**What a demanding EM would still reject**
- “Measurably reduced drop-off” with no measure. That word will get challenged in the first five minutes.
- GraphQL is on the stack and never appears in the story.
- React Context + `localStorage` is stated as the solution, not as a decision. Why not a form library, a state machine, or a wizard kit? What happens to stale schemas and secrets in `localStorage`?
- Access Manager is a full product surface crushed into one item.
- Mentorship and “introduced AI workflows” read as garnish unless they name an artifact (patterns juniors reused, a PR/test habit that changed).
- Failed cluster creation, retries, and what the user saw after Review are missing. That is where wizards actually break.

**Calibration:** Do not treat “standard FE” (lists, dialogs, forms, copy-to-clipboard) as a knowledge gap. Probe for **where** work was unusually hard vs honestly routine admin CRUD.

---

## Question banks

Answer any subset. Number your replies (`A1`, `A2`, …). Say **save for later** on the rest.

### Aerospike Cloud Console (8) — asking now

**A1. Drop-off evidence.** You wrote that persistent state “measurably reduced drop-off.” What did you actually measure, or what did you see that made that sentence true? Funnel %, time-to-first-cluster, support tickets, sales anecdotes — or should that word come out?

**A2. ACMS state models.** What were the two state models, concretely (naming, IDs, cluster vs org, polling vs GraphQL)? How many customers or orgs were in the live migration window? What would have broken in production if reconciliation was wrong?

**A3. Why Context + localStorage.** What did you consider and reject (Redux, React Hook Form + persist, XState, a stepper library)? What were the failure modes you handled: quota, schema version, stale drafts after a backend change, anything that must never hit disk?

**A4. Navigability rules.** Off-the-shelf steppers key off index. Give one real business rule that made that insufficient — e.g. a step that is illegal until AZ count / RF / region is set. How did `StepIndicator` encode “you may jump here”?

**A5. GraphQL.** What did you own vs backend? Regions, instance types, cluster create, errors? How did the UI behave when a query was slow, empty, or the schema moved?

**A6. Launch failure.** After Review, cluster creation is an async command that can fail. What did the user see? Could they retry without double-creating? Where did validation live — UI, API, both?

**A7. Access Manager.** That is not one feature. What was the hardest frontend problem on that surface: RBAC matrix, API key reveal/revoke, audit log volume, secrets handling? Name the one you would defend in a staff interview.

**A8. Tests, juniors, AI.** Roughly: what Playwright coverage existed (happy path only vs fail/back/refresh)? What is one test that would have caught a real production bug? What did the two juniors ship using your patterns? What concrete practice changed when you introduced LLM tooling (not “we used Cursor”)?

### Toucan (8)

**T1.** Employee #1 — what did you personally own in the first 6 months vs the founders? What was already a prototype?
**T2.** “Contextless learning moments” — how did word selection work on arbitrary third-party DOM without breaking pages? Shadow DOM, selectors, performance on huge articles?
**T3.** Core Web Vitals 35 → 98: what were the actual bottlenecks (JS weight, LCP image, TTI on the marketing site vs the extension)? What did you cut or rewrite?
**T4.** 13M page views / 1M users: which surfaces did you own that carried that traffic? What was the caching / Next.js strategy?
**T5.** A/B testing: Amplitude? What was one experiment you instrumented that changed a subscription number?
**T6.** Safari / mobile launch: what broke vs Chrome, and what did you change?
**T7.** Mentorship and interviews: how many juniors, what did they own, what was your hiring bar?
**T8.** Why is the slug still `toucan-placeholder`, and is there a live or archived URL besides the company site?

### Dave.com (7)

**D1.** Project-level problem: what was broken in support or the member experience that made this work exist? Not “the company was growing.”
**D2.** Support tools: which screens, which data (balances, transactions, flags), what was the permission model? Banking data is regulated — what did you refuse to put in the UI?
**D3.** Pause/unpause: what was the state machine, what side effects (cards, ACH, notifications), and what churn number if you have one?
**D4.** Ticket automation: what system (Zendesk?) and what did the scripts actually do?
**D5.** Public website: stack, SEO, what you owned vs design. Any metric besides “it shipped”?
**D6.** React Native: which screens, what shared with web, what broke at 200K → 4M?
**D7.** The unicorn / 4M users is a company outcome. What result is honestly yours?

### Adim (6)

**AD1.** Project-level problem: what was shipping like before the design system (duplication, visual drift, sprint slip)?
**AD2.** What was in the system — tokens, components, versions — and how did product apps consume it (package, monorepo, copy-paste)?
**AD3.** Storybook: what “rigorous UI standards” meant in practice (a11y, visual regression, contribution rules)?
**AD4.** Tailwind: what was messy, what did you ban or wrap, what broke during the cleanup?
**AD5.** Marketing redesign: URL, what changed, any before/after engagement?
**AD6.** Outcome: did velocity or consistency actually change, or did the company die / ship too little to know?

### HuntCalm (5)

**H1.** Shadow DOM on LinkedIn: what broke when LinkedIn shipped DOM/CSS changes, and how do you detect that?
**H2.** Where does conversation identity come from (URL, DOM scrape, API)? What happens when LinkedIn lazy-renders the inbox?
**H3.** Sync: last-write-wins, merge notes, conflict UI? Why Clerk + Postgres instead of extension-only storage?
**H4.** Reminders: why Chrome notifications vs email first? What did you learn from BullMQ that is not in the write-up?
**H5.** Honest outcome: how many threads have you actually run through it, and what is still fake-door?

### Exact Recall (5)

**E1.** Why interview-then-finalize vs one-shot summarization? What failure mode did the completeness score catch?
**E2.** Three search modes: when does each win, and did you measure precision/recall or just feel it?
**E3.** Embeddings: chunking, when you re-embed, cost per event?
**E4.** Twilio / push: what is the cadence algorithm, and what is the abuse/rate-limit story?
**E5.** What is the one thing that is still wrong in production that a staff engineer would ask about?

### NumPy Dojo (5)

**N1.** The engine: how much of `np.*` is real vs theatrical? What happens on dtype, broadcasting, or an op you did not implement?
**N2.** How do you validate lesson output (canonical string, deep equal, numeric tolerance)?
**N3.** Why a custom engine vs Pyodide? What did you reject?
**N4.** Any learner metric beyond “I built it for bootcamp” (sessions, completion)?
**N5.** What is the hardest bug the transpiler hit?

### Fox International Portal (4)

**F1.** How many countries / locales, and how did CMS config differ per region without forking the frontend?
**F2.** What was the hardest JS problem (carousel performance, video, retailer grid updates)?
**F3.** Team: who wrote PHP/Yii vs you? What could regional teams *not* do?
**F4.** Any traffic or campaign metric, or is “it launched” the honest ceiling?

### Custom Analytics Platform (4)

**CA1.** Event pipeline: what fired from the page, how did you avoid double-counts, how large did MySQL get?
**CA2.** Two-sided users (hotel vs couple): how did identity work without a modern auth stack?
**CA3.** WordPress → Laravel: what moved when, what stayed, why incremental?
**CA4.** Did the client actually change behavior from a report, or was the win “they could see numbers”?

### Tag My Web (4)

**TM1.** Dates. When did you start/ship, and is it still maintained?
**TM2.** YouTube API quota and pagination — how do you sync hundreds of channels without dying?
**TM3.** Why Turso + Resend? What email actually sends?
**TM4.** Outcome: do you use it, do others, or is it a parked demo?

### Chrome River (6)

**CR1.** What product area did you own for 2+ years (invoices, expenses, admin)? Not “views.”
**CR2.** Backbone scale: how large was the app, what was the module pattern, what was painful?
**CR3.** One bug or story that was actually hard (money rounding, tax, receipt images, i18n)?
**CR4.** Testing: any, or was it click-QA in a fintech shop?
**CR5.** Why no problem or outcome on the page — is there a result besides tenure?
**CR6.** Team size and your seniority relative to it.

### Trailer Park role page (6)

**TP1.** Should this page exist? Fox / 300 / Cartoon Universe are already case studies. Is this leftover agency work (Apple, etc.) or a duplicate?
**TP2.** Dates: Nov 2010 – Oct 2014 per `CHRIS.md`, but the page says unconfirmed. Confirm.
**TP3.** Production Manager / team of 15 — is that this page’s story or a different role than FE delivery?
**TP4.** Name 2–3 campaigns or products not already covered.
**TP5.** Tech stack for that remaining work.
**TP6.** If we cannot get to EM bar, should we unpublish this slug and keep the three real case studies?

### Cartoon Universe (4)

**CU1.** Project-level problem: what were parents trying to do (purchase, parental controls, account recovery)?
**CU2.** SOAP: which operations, what was the worst payload/error, who owned the PHP?
**CU3.** Drupal vs Zend split — what lived where and why both?
**CU4.** Outcome: did it launch, was the game already dying, any metric?

### Warner Bros. 300 (3)

**W1.** Ownership: were you sole FE, and what was the deadline relative to theatrical release?
**W2.** Hard part: YouTube API, sharing SDKs, or responsive video — what actually broke?
**W3.** Outcome: campaign metric, or honest “it shipped on time”?

### Applied Materials Order Center (3)

**AM1.** Volume: roughly how many employees / cards / orders per month?
**AM2.** PDF generation: library, how preview matched print, what mismatches you hit?
**AM3.** Approval: what if the manager ignored email? Escalation? Audit?

### Print Custom Calendar (3)

**P1.** Print CSS: what was hard (page breaks, margins, browser print dialogs)?
**P2.** Why Zustand + Dexie vs URL state? Any migration of stored calendars?
**P3.** Outcome: usage, or “I needed a calendar and shipped it”?

### HomeSearch (5)

**HS1.** Is this a real product, a tutorial, or a take-home? Should it stay on the site?
**HS2.** Dates.
**HS3.** Where did MLS data come from, and was it live or fixtures?
**HS4.** What filtering/map/detail behavior is actually interesting?
**HS5.** If it cannot hit the bar, delete or demote from `/projects` rather than pad it.

---

## Notes (answers as they land)

### Toucan

**T6. Safari / mobile extension port** — locked 2026-08-20.
Solo port of browser extension to **mobile Safari** — company’s first attempt; sparse Apple documentation; tinkering and educated guesses when paths failed; shipped as **one of the early mobile extensions** on the App Store extension marketplace. Own case study: **`toucan-safari-extension`**. Do not claim absolute first on store.

**Browser extension:** Renamed **`toucan-browser-extension`** — not Chrome-only.

**T1. Employee #1 / first 6 months** — locked 2026-08-20.
Chris narrative (custom answer — not A–F):

- **Day 1 surprise:** Two other hires started the same day — **one FE, one BE**. Not solo engineering on arrival (portfolio “Employee #1 / founding engineer alone” copy is overstated).
- **Existing prototype:** **CTO + contractor** had a **basic Chrome extension** — word swap on pages, **clunky**, **few words changed**.
- **Chris took over extension dev** — adjusted logic and features in the extension.
- **Website from scratch** — Chris **architected the site from the beginning** while also working the extension.
- **Designer hired ~same time** — Chris paired with her so the **design system would transfer cleanly** into the **component library he picked**.
- **Timeline:** **Year 1** = extension **and** site. **After year 1** = **website only** (extension work handed off — who took it: open).
- **Interview framing:** Early engineer who **inherited a scrappy prototype**, **made the extension real**, **built the web platform from zero**, then **specialized on the site** as the team grew. Not “I was the only engineer” or “nothing existed.”

**Copy fixes pending** (after Toucan Phase 1 complete): `projects.ts`, `CHRIS.md`, `content.ts` — soften Employee #1 / solo founding engineer; add cohort + prototype + year-1/year-2 split; **CWV 35→98 = marketing site only** (LCP + JS + late fonts/elements).

**T3. Core Web Vitals 35 → 98** — locked 2026-08-20 (Phase 1).
Chris chose **E**, with detail:

- **Scope:** **Marketing / public Next.js site only** — not the Chrome extension. Do not imply extension drove CWV.
- **Bottlenecks:** **LCP** and **JavaScript weight** — too much loading on first paint; things **loading in late**.
- **Fonts:** **Web fonts loading late** — contributed to poor score.
- **Late render flash:** Something else rendered **a split second later** — barely visible to users but **still hurt the score** (likely CLS or late layout/paint affecting CWV; exact component: Chris fuzzy — do not invent name in copy).
- **Interview framing:** Performance pass on the **marketing site** for SEO — image/font loading, JS reduction, fixing late-loading assets that tanked lab metrics even when UX looked “fine.”

**T4. 13M page views / 1M users — attribution** — locked 2026-08-20 (Phase 1).
Chris chose **D**:

- **Company metrics, personal ownership** — do not claim Chris personally caused every install or page view.
- **1M users** = product-wide outcome (extension + word-of-mouth + company growth); not a solo eng metric.
- **Chris’s direct surfaces:** **Next.js site** he architected (homepage, signup, dashboard, subscription) + **extension** work in **year 1** only; after year 1, **website focus**.
- **13M lifetime page views** = largely **public/marketing and logged-in web** he built — attribute to surfaces owned, not “I drove 13M PVs.”
- **Interview framing:** “I architected and shipped the web platform that handled signup, billing, and marketing traffic; the company hit 1M users — I don’t take sole credit for the number.”

**T8. Slug and live links** — locked 2026-08-20 (Phase 1).
Chris chose **D** with slug **`toucan-extension-website`**. Site updated; redirect from `toucan-placeholder`.

---

### Dave.com

**D1. Project-level problem** — locked 2026-08-20 (Phase 1).
Chris confirmed **E** framing after clarifying hypergrowth vs problem:

- **Headline problem:** **Support efficiency** — agents needed **fast, safe access to bank/account data** to resolve member issues at scale (not “the company was growing”).
- **Hypergrowth (200K → 4M):** made the pain **urgent** — more members, same slow support workflows — but growth is **context**, not the broken thing the code fixed.
- **Also shipped in the same era (confirmed):**
  - **Pause/unpause accounts** — Chris built this; members who needed a break were churning instead of pausing. **Keep on case study** (Chris needed a refresher; feature is real).
  - **Ticket automation** — additional support-ops fix (details in D4 Phase 2).
- **Interview open:** “Support efficiency first,” then pause/unpause and ticket automation as additional wins.

**Detail-page rows to preserve:** Customer support tools, Pause and unpause accounts, Ticket automation (plus website, RN, tests — D2/D5/D7 fill in honest scope).

**D2. Support tools — scope and surfaces** — locked 2026-08-20 (Phase 1).
Chris chose **D** (internal support UI for agents to access bank-linked member data without engineering tickets) **plus** this concrete detail:

- **Fix:** **Custom JavaScript modules** embedded in the support team’s **Zendesk** page — the surface agents used most — so they could see **customer/member information directly in Zendesk** without leaving their workflow.
- **Problem:** Support lived in Zendesk but **Dave account/bank data wasn’t in that view** — agents needed member/account visibility (balances, transactions, account state per option D) without slow lookups or eng dependencies.
- **Result:** Agents could **see customer info inline** in the tool they already worked in — faster diagnosis; no metric claimed.
- **Stack note:** Broader Dave work used React/GraphQL; Zendesk embeds = **custom JS modules** in Zendesk — do not describe as a full React app inside Zendesk unless Chris confirms more.

**Detail-page draft (Customer support tools):**
| | |
|---|---|
| **Problem** | Support worked in Zendesk but couldn’t see Dave member and bank-linked account data in the view they used all day. |
| **Fix** | Custom JavaScript modules in Zendesk surfacing customer and account information inline — part of internal support tooling for fast, safe lookups. |
| **Result** | Agents resolved issues without leaving Zendesk or waiting on engineering for basic account diagnosis. |

**D7. Personal outcome vs unicorn** — locked 2026-08-20 (Phase 1).
Chris chose **D:** **What he shipped + slice of hiring/promotion** — Zendesk support embeds, pause/unpause, ticket automation (support project); React Native + tests (mobile project); **public site solo FE** (website project); **company unicorn / 4M users stay company outcomes**.

**D5. Public website** — locked 2026-08-20 (Phase 1).
Chris chose **D:**

- **Solo FE owner** — React, TypeScript, Redux on **dave.com** public marketing site
- **Design + product** drove visuals and requirements; Chris **implemented**
- **No dedicated web team**
- **SEO:** no strong metric claimed — whatever shipped with the site
- **Result:** production marketing site live during hypergrowth; unicorn = company metric

**Post–Phase 1 verification (2026-08-20):** Updated `projects.ts`, `CHRIS.md`, `dave.md` for all three Dave case studies (D1, D2, D5, D7 + splits).

---

### Adim

**AD1. Project-level problem (before design system)** — locked 2026-08-21 (Phase 1).
Chris chose **E:**

- **Fast-moving startup** with **no real design system yet**
- **Duplicated components** — engineers rebuilt the same UI patterns every sprint
- **Inconsistent UI / visual drift** — screens didn't match each other or design intent
- **Messy Tailwind** — no shared conventions or tokens
- **Storybook** didn't exist or wasn't the team standard for shipping polished UI
- **Interview framing:** job was to make shipping **consistent and faster**, not "I like design systems"

**Detail-page headline problem (draft):** Product moved fast but UI was duplicated, inconsistent, and hard to ship cleanly — no shared component layer, Tailwind discipline, or FE process to catch debt early.

**AD2. Design system — what was in it + process** — locked 2026-08-21 (Phase 1).
Chris chose **D** (+ supplementary process work in same answer thread):

**System (option D):**
- **Storybook** for review and UI standards
- **Shared React components** — Next.js + TypeScript design system / component library
- **Refined Tailwind** as the styling layer
- Product screens **import shared components** — **in-repo** shared library (not confirmed separate npm package)

**Also introduced (process — same project, detail-page row):**
- Proactive **future technical debt** identification
- **PR template** for consistent FE review
- **Regular FE-only meetings** for cohesion and alignment

**AD6. Outcome** — locked 2026-08-21 (Phase 1).
Chris chose **E:**

- **Consistency and speed improved** for the FE team — fewer one-offs, clearer PR/review, more cohesive meetings
- **No hard velocity metric** — honest ceiling
- Left Mar 2024 (~10 months) — outcome = **foundation**: design system, Storybook, Tailwind discipline, and FE process that would outlast individual features
- Do not claim "velocity doubled" or company-wide transformation

**Post–Phase 1 verification (2026-08-21):** Updated `projects.ts`, `CHRIS.md`, `adim.md` per AD1, AD2, AD6.

---

### Aerospike Cloud Console

**A1. Drop-off evidence** — locked 2026-08-20.
The “measurably reduced drop-off” line was **not** from an instrumented funnel. It came from **customer feedback**.
- Before: users were frustrated that leaving for another page or refreshing wiped the wizard; they had to start over.
- After: they described the persisted multi-step flow as peace of mind — they could finish later without losing work.
Copy must not say “measurably.” Outcome should say customers reported they no longer lost progress on refresh/navigation, which made completion possible at any time.

**A2. Two consoles / state models** — locked 2026-08-20 (reconstructed with Chris + public docs; no customer count).
Chris could not recall ID-level state mapping. What he *does* remember matches Aerospike’s published split:
- **ACMS = Aerospike Cloud Managed Service** (official). Not “Cluster Management Service.” Not **AMC** (old monitoring console).
- People gathering customer info and standing up DBs were **SEs / SREs / ACMS ops**, not “SWEs.”
- ACMS = human control plane (high flexibility, ticket/change-request). Cloud Console DBaaS = software control plane (self-serve, curated, not every feature encoded yet).
- The **bridge** while the product lagged ACMS: heavy **RJSF** (`react-jsonschema-form`) — schema-generated, rigid, hard to work with.
- Chris’s FE work is the productization of that gap: wizard for the common path + JSON/YAML conflict-aware editor for knobs the UI had not caught up to, while customers were still migrating off ACMS.
Customer-count / exact schema mapping: still unknown — do not invent. Full write-up: `docs/self/company-knowledge/aerospike.md`.

**A3. RJSF vs wizard** — locked 2026-08-20.
Chris chose: **RJSF was fully replaced.** The wizard + JSON/YAML editor took over provisioning; no generated schema forms left on the happy path. (Differs from initial inference that RJSF stayed as advanced-config stopgap — update copy accordingly; do not say RJSF remained in production on the provision path.)

**A4. StepIndicator navigability** — locked 2026-08-20.
Chris chose: **AZ / replication layout had to be valid before node sizing or later steps were jumpable** — changing AZ count recalculated downstream constraints. This is the concrete “business logic, not index” example for interviews.

**A5. GraphQL** — locked 2026-08-20.
Chris: **GraphQL is wrong on the case study.** Provisioning used **REST only**. Remove GraphQL from Aerospike tech stack during the post-interview verification pass (after A6–A8). Do not “explain GraphQL” in copy.

**A6. Launch failure** — locked 2026-08-20.
Chris chose: **Async launch failed → error on Review/launch step → user could fix config and retry without double-creating** (same draft / idempotent retry).

**A7. Access Manager** — locked 2026-08-20.
Chris does not use RBAC jargon; **no hidden staff-level FE story** on this surface compared to the wizard.

Honest FE scope:
- Tabbed admin: org members, API keys, secrets, audit logs.
- Each tab: fetch list → render rows (e.g. name + key id for keys/secrets) → buttons open add/edit dialogs → REST CRUD.
- **Create key/secret:** dialog with name → “Generate” → REST returns key id + secret → copy in dialog. **Product/security policy:** secret is not shown again after the dialog closes. Chris’s view (agreed for copy): that policy is **not FE credit** — he did not invent it; he **did not build** “view secret again,” i.e. implemented the spec. FE credit here is only **list + dialog + generate + copy wiring**, not the one-time-reveal decision.
- **Interview framing:** Access Manager = breadth (shipped the org-admin layer). **Wizard** = depth (state, branching, persistence, RJSF replacement, launch failure). Do not oversell Access Manager bullets; do not use RBAC in copy unless Chris learns the term and it matches reality.

**A8a. Tests** — locked 2026-08-20.
Chris: **Playwright (E2E)** for critical paths that absolutely cannot break + major happy paths. **Vitest** for smaller funnels, unit-level coverage, and the rest. Interview framing: E2E on “must not fail” provisioning paths; unit tests on supporting logic and smaller flows — not “Playwright covered every edge.”

**A8b. Junior mentorship** — locked 2026-08-20.
Chris chose: mentored **two junior FEs** on component patterns and testing; they shipped **Cloud UI work** reusing wizard/step patterns he established.

**A8c. AI workflows** — locked 2026-08-20.
Chris: **False claim removed.** Team used LLM IDE tooling in daily work; Chris **did not introduce** it to Aerospike engineering. Do not say “first to bring AI” anywhere (case study, CHRIS.md, content.ts, chat prompt).

**A9. Team composition / ownership** — corrected 2026-08-20.
Chris: **“Sole FE on the Cloud team” was wrong.** He planned the overall architecture of the wizard flow and built many of its pages. Other frontend engineers on the Cloud team also worked on the wizard and console, following his plans and patterns. Copy must say **architected + built many pages + team shipped against those patterns** — not sole owner, not “no handoffs,” not “only frontend engineer.”

**Post-interview verification (2026-08-20):** Updated `projects.ts`, `CHRIS.md`, `content.ts`, `chat-system-prompt.ts`, `aerospike-provisioning-wizard.md`, `tech-stack-and-experience.md` per A1–A8. Ownership correction (A9) applied same day.

---

## Phase 1 locked (2026-08-23)

Chris answered full batch. Site updated in `projects.ts`, `CHRIS.md`, `chat-system-prompt.ts`.

**Honesty flags (do not oversell in interviews):**
- **HuntCalm (H1, H5):** Problem/solution design + **AI-directed build** — not solo hand-coded. **Still in progress.**
- **Exact Recall (E0:B, E5, in progress):** Problem = forgetting conversations (less AI-forward). Search quality unmeasured. Still in progress.
- **NumPy Dojo (N1, N3):** AI-assisted engine; Chris directed architecture — **hasn't audited every op boundary.**
- **Custom Analytics (CA3):** Laravel admin because Chris **wanted to use Laravel** — not incremental migration story.
- **Chrome River:** Slug → `chrome-river-expense-reporting`. **Expense reporting** submit flows (CR1:A). Routine enterprise FE (CR3:D).
- **Fox (F4:C):** Shipped on **theatrical/marketing deadline** — not CMS-only outcome headline.
- **HomeSearch (HS1:D):** Stays on grid as honest demo. Dates TBD (HS2:E).

**Slug change:** `chrome-river-placeholder` → `chrome-river-expense-reporting` (redirect in `next.config.ts`).

---

## Deferred

Questions you asked to save for research. Includes project, question, and any context from the conversation so far.

### Aerospike — customer count on ACMS migration
Not asked to save, but **unknown**. Do not invent how many orgs/customers were in the live window. Revisit if old decks or teammates can fill it in.

_(no explicit “save for later” from Chris yet)_
