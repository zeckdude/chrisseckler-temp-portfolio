# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, deployed to Vercel. Framer Motion for interaction/motion layer. All content is hardcoded in source (no CMS).

## Users

Two audiences: (1) freelance/contract clients evaluating whether to hire Chris for project work, and (2) full-time hiring managers/recruiters evaluating him for senior IC, founding engineer, or AI-forward engineering roles. Both are technical or semi-technical decision-makers scanning quickly for credibility signals: real shipped products, scale, and technical depth.

## Product Purpose

A personal portfolio site for Chris Seckler, a Senior Frontend Engineer with 15+ years of experience. It exists to demonstrate technical craft directly through the site itself, showcase a body of professional and personal project work as case studies, and convert visitors into an email/LinkedIn contact. Success = a recruiter or client leaves with a clear sense of what he's built and reaches out.

## Positioning

"I build products people actually use — from zero to launch and everything after." Track record spans founding-engineer scale-ups (Toucan: 0 → 1M+ users), high-growth unicorns (Dave.com: 200K → 4M+ users), and enterprise infrastructure (Aerospike Cloud). Currently deepening into AI engineering (LLMs, RAG, embeddings) via a structured bootcamp while shipping personal AI-adjacent side projects.

## Operating Context

Visitors arrive from a resume, LinkedIn profile, or direct link during a job search / client vetting process. They will skim the home page, jump to `/projects` to scan the grid, open one or two case studies at `/projects/[slug]` for depth, check `/about` for career trajectory, and use `/contact` to reach out. Desktop and mobile both matter (recruiters often browse on mobile between meetings).

## Capabilities and Constraints

- Every project uses one shared case-study template (`/projects/[slug]`); the only structural difference is the badge and an optional "My Role" block for professional projects.
- No backend, no database, no CMS — content lives in a typed data file in source and is updated via code edits.
- Screenshots/video demos for projects are not yet available; visual blocks must degrade gracefully to a styled placeholder (no broken images, no stock photography).
- Several projects have placeholder/incomplete content (exact dates, feature detail, tech stack) pending follow-up — see open items tracked in the repo.

## Brand Commitments

- Name: Chris Seckler. Title: Senior Frontend Engineer.
- Voice: direct, technical, no hype, no filler. Written like an engineer, not a marketer.
- Identity: OIF Army Reserve veteran, based in Las Vegas, open to remote or Las Vegas-based roles.
- Explicit anti-references (binding, from the user's brief): warm cream backgrounds with terracotta accents, generic "developer blue" with card grids, acid-green on black, glassmorphism/frosted panels/floating blurred cards, italic serif display fonts, "Introducing..." hero eyebrows, pulsing dots, skeleton loaders, AI-thinking spinners, side-tab navigation, nested cards, icon tile stacks.

## Evidence on Hand

- 12 real projects with varying depth of detail (full case studies for Aerospike, NumPy Dojo, HuntCalm, Exact Recall; placeholders pending for Adim, Toucan, Dave.com, Chrome River, Trailer Park, HomeSearch, Tag My Web, Print Custom Calendar).
- Real metrics: Toucan (0 → 1M+ users, 30 employees), Dave.com (200K → 4M+ users, unicorn status), Aerospike (unified legacy ACMS console migration).
- Real links: numpydojo.com, exactrecall.com, tagmyweb.com, printcustomcalendar.com, and GitHub repos for several personal projects.
- No screenshots, video demos, or headshot photo on hand yet — explicitly deferred to a later pass per the user's open items list. Do not fabricate placeholder imagery that looks like a real screenshot.

## Product Principles

1. The site itself is a work sample — the craft of the UI is part of the pitch, not decoration on top of it.
2. Every project, professional or personal, gets the same structural respect: one template, applied consistently.
3. Content honesty over polish theater: placeholder/unknown facts are marked as such in source, never invented.
4. Motion and visual flourish are concentrated on the home page; every other page stays fast, quiet, and easy to scan under time pressure.
5. Two audiences, one voice: write for a technical reader who wants signal fast, not persuasion copy.

## Accessibility & Inclusion

Respect `prefers-reduced-motion` (disable parallax/magnetic/scroll-reveal motion). Maintain WCAG AA contrast against the near-black palette. Full keyboard navigability for nav, filter tabs, and all links/buttons.
