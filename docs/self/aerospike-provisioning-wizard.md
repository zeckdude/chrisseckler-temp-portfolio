# Aerospike Cloud Console — Provisioning Wizard Feature Breakdown

> A feature-by-feature breakdown of the cluster provisioning wizard Chris owned as sole front-end engineer on the Aerospike Cloud team. Each entry pairs the user/business problem with the technical solution implemented.

---

## Context

The provisioning wizard is the revenue-critical flow in the Aerospike Cloud Console — the multi-step process where a prospect configures and creates their first database cluster. A trial becoming a paying customer happens here. When Chris arrived, the flow was fragmented, stateless on page refresh, and running alongside a separate legacy admin console (ACMS) that hadn't been unified into the main platform.

**Business problem:** Enterprise customers were dropping off mid-setup, which meant lost revenue. Chris owned fixing it — architecture, delivery, testing, and the migration from the legacy console.

---

## Feature Breakdown

| # | User / Business Problem | Technical Solution |
|---|---|---|
| 1 | Users had no sense of progress through a multi-step setup — they got lost or confused | Redesigned as a linear wizard with a business-logic-driven `StepIndicator` that showed completed, active, error, and upcoming states — where logic, not just position, controlled which steps were navigable |
| 2 | Less technical users didn't know what to pick, slowing them down or causing misconfiguration | Smart defaults and presets surfaced based on use case, company type, or earlier selections in the flow |
| 3 | Users submitted with errors they didn't catch until after the fact | Inline validation and error messaging at each step before allowing progression |
| 4 | Users committed to configurations without a final review, risking costly mistakes on launch | A review-before-launch summary screen — the full configuration visible and editable before cluster creation was triggered |
| 5 | A one-size-fits-all form didn't fit different cluster types or workflows | Conditional and branching steps that adapted based on prior answers, reducing irrelevant options for each path |
| 6 | Stale data from earlier choices could silently break a later step | State that reset conditionally when upstream choices changed — e.g., changing the number of availability zones invalidated and recalculated node sizing constraints downstream |
| 7 | Some fields depended on data (regions, instance types) that loaded asynchronously mid-flow | Async-dependent fields handled gracefully without breaking or blocking user progress |
| 8 | Users lost their input if they navigated back a step | Back navigation that preserved all entered data — no re-entry required |
| 9 | Users lost all progress if they left the flow, refreshed, or came back later | Cross-step state managed via React Context, hydrated from `localStorage` — users never lost progress on refresh or re-entry |
| 10 | Users needed help but didn't want to leave the flow or open a support ticket | A contextual inline docs panel that fetched Aerospike's documentation and rendered it inside a collapsible sidebar, formatted to match the console's design system — context-aware on open, defaulting to the most relevant article for the current page |
| 11 | The backend supported more configuration options than the UI had caught up to — users shouldn't lose access to them | A dual-mode JSON/YAML config editor for advanced settings not yet exposed in the wizard UI, paired with conflict detection that identified when custom config keys clashed with values already set via the UI steps |

---

## Business Outcomes

- The unified flow drove successful enterprise migrations away from the legacy ACMS console during a live customer migration window
- Persistent state across steps measurably reduced drop-off during provisioning
- The component architecture Chris introduced became the foundation for subsequent Cloud UI work — it outlasted his tenure
- Chris also mentored two junior front-end engineers on the team and introduced AI-assisted development workflows — the first person to bring that practice to Aerospike engineering

---

## Tech Stack

React · TypeScript · React Context · Material UI · Vitest · Playwright · GraphQL
