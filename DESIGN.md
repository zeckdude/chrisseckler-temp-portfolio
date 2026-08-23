---
name: Chris Seckler — Portfolio
description: A dark, engineer-voiced portfolio that proves technical craft through restraint, not decoration.
colors:
  void: "#0d0d0f"
  surface: "#141416"
  hairline: "#242428"
  ink: "#f0f0f2"
  ash: "#8a8a96"
  signal: "#38bdf8"
  signal-dim: "#1e3a4a"
  status-professional-bg: "oklch(26.2% 0.051 172.552)"
  status-professional-text: "oklch(76.5% 0.177 163.223)"
  status-freelance-bg: "oklch(27.9% 0.077 45.635)"
  status-freelance-text: "oklch(82.8% 0.189 84.429)"
  status-personal-bg: "oklch(29.3% 0.066 243.157)"
  status-personal-text: "oklch(74.6% 0.16 232.661)"
  status-company-bg: "oklch(28.3% 0.141 291.089)"
  status-company-text: "oklch(70.2% 0.183 293.541)"
  status-tech-bg: "oklch(30.2% 0.056 229.695)"
  status-tech-text: "oklch(78.9% 0.154 211.53)"
typography:
  display:
    fontFamily: "Cabinet Grotesk, var(--font-inter), sans-serif"
    fontSize: "clamp(3rem, 8vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Cabinet Grotesk, var(--font-inter), sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 800
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Cabinet Grotesk, var(--font-inter), sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, var(--font-inter), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "JetBrains Mono, var(--font-jetbrains-mono), monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  container-content: "1200px"
  container-case-study: "760px"
  section-sm: "3.5rem"
  section-md: "4rem"
  section-lg: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.void}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    typography: "0.875rem, weight 600"
  button-primary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.void}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.signal}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  card-project:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  chip-tech:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ash}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    typography: "{typography.label}"
  badge-professional:
    backgroundColor: "{colors.status-professional-bg}"
    textColor: "{colors.status-professional-text}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
  badge-freelance:
    backgroundColor: "{colors.status-freelance-bg}"
    textColor: "{colors.status-freelance-text}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
  badge-personal:
    backgroundColor: "{colors.status-personal-bg}"
    textColor: "{colors.status-personal-text}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
---

# Design System: Chris Seckler — Portfolio

## Overview

**Creative North Star: "The Quiet Terminal"**

The site reads like a dark IDE workspace built for a technical reader who's scanning under time pressure: a near-black canvas, one signal-blue accent, and monospace type wherever a fact needs to look like a fact (dates, tech names, counts). Structure comes from hairline borders and a single step of background lightening (void → surface), not from shadows or gradients — depth is implied by layering, not lit. Per PRODUCT.md's product principles, motion and flourish are deliberately concentrated on the home hero (parallax drift, magnetic buttons, an ambient blurred glow); every other page — projects, case studies, about, contact — drops that flourish and stays flat, bordered, and fast.

The palette and type system directly enforce PRODUCT.md's binding anti-references: no warm cream/terracotta, no "developer blue" card-grid cliché, no acid-green-on-black, no glassmorphism, no italic serif display type. The one deliberate exception worth naming: the sticky nav's `bg-void/95` + `backdrop-blur-sm` is a near-opaque scroll-legibility aid, not a frosted glass panel — it should never be pushed toward more transparency or blur.

**Key Characteristics:**
- Near-black void background with a single lighter `surface` step for cards and panels — no third background tone.
- One accent color (signal blue) carries all interactive/brand emphasis; five borrowed Tailwind hues are reserved strictly for classification chips.
- Cabinet Grotesk (display, weight 800, tight tracking) paired with Inter (body) and JetBrains Mono (any label that behaves like data).
- Flat by default: hairline borders and background-shade steps do the work shadows would otherwise do; shadows are reserved for things that float above the page.
- A recurring faint dot-grid texture is the system's only background pattern, shared verbatim between the hero backdrop and empty-state thumbnails.

## Colors

The palette is almost entirely neutral — three near-black/gray steps carry the whole UI — with exactly one saturated color (signal blue) doing all brand and interaction work, plus a small set of borrowed semantic hues quarantined to classification chips.

### Primary
- **Signal Blue** (`#38bdf8`): the only accent in the system. Used for links, active nav state, focus rings, primary button fill, the floating chat affordance, and text-selection highlight. Appears on a small minority of any given screen by design.
- **Signal Dim** (`#1e3a4a`): a desaturated, near-black tint of the accent hue. Used exclusively as a background wash behind accent-colored content — the chat's icon roundel, the welcome bubble, the "assistant filter active" notice, active filter-pill fills. Never used for text or borders.

### Neutral
- **Void** (`#0d0d0f`): page background, body background, and the ground everything else sits on.
- **Surface** (`#141416`): the one elevation step above Void. Used for cards, panels, chips, the chat sidebar header/input bar, and the filter drawer. There is no second "elevated" tone above Surface — depth beyond this is expressed with borders, not more background steps.
- **Hairline** (`#242428`): the universal border color (`* { border-color: hairline }` is the global default). Also the dot color in the dot-grid texture.
- **Ink** (`#f0f0f2`): primary text, on both Void and Surface.
- **Ash** (`#8a8a96`): secondary/supporting text — taglines, captions, timestamps, disabled states.

### Named Rules
**The One Voice Rule.** Signal Blue is the system's only accent. If a new element needs emphasis, reach for Signal Blue before reaching for a new hue — the palette's restraint is itself a credibility signal for a site whose subject is engineering judgment.

**The Quarantined Semantics Rule.** Five borrowed Tailwind hues — emerald (Full-time), amber (Freelance), sky (Personal Project), violet (Company), cyan (Tech Stack) — exist only to color-code classification chips in `Badge`, `CompanyChip`, `TechChip`, and the filter panel. Always paired as a `-950` background with a `-400` text and a `-700`/`-800` ring. These hues never appear on buttons, links, or any primary-action surface.

## Typography

**Display Font:** Cabinet Grotesk (with Inter, sans-serif fallback)
**Body Font:** Inter (with system sans-serif fallback)
**Label/Mono Font:** JetBrains Mono

**Character:** Cabinet Grotesk at weight 800 with tight (-0.03em) tracking gives headings a dense, engineered edge without tipping into display-serif drama. JetBrains Mono is doing real work, not decoration — it marks anything that reads as a fact (a date, a stack, a count) the way a terminal or log line would.

### Hierarchy
- **Display** (800, `clamp(3rem, 8vw, 7rem)`, line-height 0.95): the home hero name only — the single largest moment in the system.
- **Headline** (800, `text-4xl`/`text-5xl` responsive, tight tracking): page-level `<h1>`s on About, Contact, and case-study pages.
- **Title** (800, `text-2xl`/`text-xl`): section headings inside a page ("Featured Projects", "Tech Stack", "Overview" inside a case study).
- **Body** (400, `text-base`–`text-xl`, line-height 1.7 on all `<p>`): taglines, bios, case-study prose. Body copy runs in `ash` (secondary) when it's supporting text, `ink` when it's primary content.
- **Label** (500, `0.65rem`–`0.75rem`, JetBrains Mono, often uppercase with wide tracking): filter-row eyebrow labels ("Type"), timeline dates, tech-stack category headers, project dates, chat message counters.

### Named Rules
**The Terminal Label Rule.** Any piece of copy that is functionally metadata rather than prose — a date, a tech name, a company, a counter, an inline code reference — is set in JetBrains Mono. Prose and headings never use the mono face; mono never carries a full sentence.

## Layout

Two fixed content widths carry the whole site: a **1200px** `max-w-content` for hero, grids, and section wrappers, and a narrower **760px** `max-w-case-study` for anything meant to be read start-to-finish (case-study body, About bio/timeline, Contact). Page sections use a consistent vertical rhythm of `py-14`/`16`/`20` (3.5rem–5rem) with a `px-6` horizontal gutter that holds at every breakpoint.

The project grid is `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`, the same grid used for the About tech-stack groups. The header is a `sticky top-0` bar with a hairline bottom border; on desktop, opening the chat assistant pushes all page content left by animating `padding-right` to 420px on the body wrapper (`ChatLayoutShift`) rather than overlaying it — on mobile the same panel overlays with a scrim instead, since there's no room to reflow.

## Elevation & Depth

The system is flat by default. Depth between surfaces comes from a single background-lightening step (Void → Surface) plus a 1px Hairline border — never from a shadow — and the case-study/About/Contact pages carry no shadows at all. Shadows are reserved for the small set of elements that genuinely float above page content: the floating chat-launcher button, the chat sidebar panel, the lightbox's nav arrows and portal image, and the inline "View Case Study" pill inside chat messages.

### Shadow Vocabulary
- **Floating affordance** (`box-shadow` ≈ Tailwind `shadow-lg`): the chat launcher FAB and the lightbox's prev/next circular buttons — anything that hovers over content rather than sitting in the document flow.
- **Overlay** (`box-shadow` ≈ Tailwind `shadow-2xl`): the chat sidebar panel and the lightbox's portalled image/video — full takeover surfaces.
- **Inline accent** (`box-shadow` ≈ Tailwind `shadow-sm`): small inline action pills embedded in chat markdown text (`ProjectButton`, `FilterButton`).

### Named Rules
**The Borders-Over-Shadows Rule.** Surfaces are flat at rest. A shadow only appears on an element that is layered on top of the page (portal, fixed overlay, floating button) — never on a card, button, or panel that lives in normal document flow.

**The Dot-Grid Texture Rule.** A faint radial-dot pattern (`radial-gradient(var(--color-border) 1px, transparent 1px)`, 18–32px grid, ≤50% opacity) is the system's only background texture, reused verbatim between the home-hero backdrop and the empty-state project-thumbnail placeholder. It never carries color and never appears above ~50% opacity.

## Shapes

Corner radius scales with how "conversational" a surface is. Structural content — cards, buttons, the nav, thumbnails — uses a tight **6px** (`rounded-md`) radius. Small inline elements (inline code, tiny chips) use **4px**. Pills, dots, and circular icon buttons are fully round (`rounded-full`). The chat system is the one place radius opens up to **12–16px** (`rounded-xl`/`rounded-2xl`), giving message bubbles and the filter drawer a softer, more conversational feel that visually separates "the assistant" from "the document." Thumbnails and galleries are locked to fixed aspect ratios (`aspect-16/10` for cards, `aspect-video` for case-study media) so imagery never distorts or shifts layout.

## Components

### Buttons
- **Shape:** 6px radius (`rounded-md`), `px-5 py-3`, `text-sm font-semibold`.
- **Primary:** Signal Blue fill, Void text. Hover fades fill to 90% opacity — no color change, no lift.
- **Ghost:** transparent fill, Hairline border, Ink text. Hover shifts border and text to a 40–50%-opacity Signal Blue tint.
- **Disabled:** shown as a translucent primary fill (`bg-accent/30`, `text-accent/50`) with a helper caption underneath rather than being hidden — used for project links awaiting a live URL.

### Chips (Badges & Tech Chips)
- **Status badges:** `-950` background / `-400` text / `-700`–`-800` ring, one of the five quarantined semantic hues, 4px radius, `text-xs font-medium`. Label is a static role name ("Full-time", "Freelance", "Personal Project"), not the raw enum value.
- **Tech chips:** neutral — Surface background, Hairline border, Ash text, JetBrains Mono, 4px radius. Unlike status badges, tech chips never carry color; color is reserved for classification, not for every tag.
- **Filter chips:** same 5-hue vocabulary as status badges but rendered as toggleable pill buttons (`rounded-md`) with an `aria-pressed` state; inactive state drops to a plain Hairline ring with Ash text.

### Cards / Containers
- **Corner Style:** 6px radius (`rounded-md`).
- **Background:** Surface on Void.
- **Shadow Strategy:** none at rest (see Elevation & Depth).
- **Border:** 1px Hairline, tinting toward Signal Blue at 40% opacity on hover.
- **Internal Padding:** `p-4` (project cards) to `p-6`/`p-8`/`p-10`–`16` for larger promotional panels (the "Currently" card, the closing CTA panel).

### Inputs / Fields
- **Style:** Void background inside a Surface-toned panel, no visible border at rest, `rounded-xl` corners (chat textarea is the only text input in the system).
- **Focus:** a 1px Signal-Blue-at-50%-opacity ring (`focus:ring-1 focus:ring-accent/50`), no border-color shift, no glow.
- **Disabled:** reduced-opacity placeholder copy ("Conversation limit reached") rather than a grayed-out visual treatment.

### Navigation
- Sticky top bar, `bg-void/95` with `backdrop-blur-sm` and a hairline bottom border — an opacity-based scroll-legibility aid, not a glass panel. Links are `text-sm font-medium`; the active route is Signal Blue, inactive routes are Ink with a Signal-Blue hover transition. Logo/name uses the display face at `text-lg font-extrabold`. No mobile-specific nav pattern exists yet (the same horizontal link row is used at all widths) — treat this as an open gap, not an established mobile convention.

### Chat Assistant (signature component)
The one component that's allowed to look different from the rest of the site. A circular Signal-Blue floating action button (bottom-right, `shadow-lg`) opens a 420px right-hand sidebar (`shadow-2xl`, Void background, Hairline borders between header/body/input) that pushes page content left on desktop and overlays with a scrim on mobile. Assistant messages render in Surface-toned bubbles (`rounded-2xl rounded-bl-md`), the welcome message alone uses the Signal-Dim wash, and user messages are solid Signal-Blue with Void text (`rounded-2xl rounded-br-md`) — the only place in the system where the accent is used as a large fill rather than a small highlight. Inline assistant replies can render live "View Case Study" / "Show only these" action pills using the primary/ghost-accent button vocabulary at a smaller scale.

## Do's and Don'ts

### Do:
- **Do** treat Signal Blue (`#38bdf8`) as the only accent — reach for opacity/tint variants of it before introducing a new hue.
- **Do** set anything metadata-shaped (dates, tech names, counts, inline code) in JetBrains Mono; never in the display or body face.
- **Do** separate surfaces with a 1px Hairline border and the single Void→Surface background step instead of a shadow.
- **Do** keep the five semantic chip hues (emerald/amber/sky/violet/cyan) confined to classification chips — badges, company tags, tech tags, filter pills — never on primary UI.
- **Do** respect `prefers-reduced-motion`: parallax drift, magnetic pull, and scroll-reveal must disable per the global media query in `globals.css`.
- **Do** use the styled monogram placeholder (`ProjectThumbnail`'s initial-letter + dot-grid pattern) for any project without real screenshots — never fabricate a fake screenshot or stock photo, per PRODUCT.md.

### Don't:
- **Don't** add drop shadows to cards, buttons, or any at-rest surface in normal document flow — shadows exist only for portals and fixed overlays (chat FAB/sidebar, lightbox).
- **Don't** push the sticky nav's `bg-void/95` + `backdrop-blur-sm` toward more transparency or blur — PRODUCT.md bans glassmorphism/frosted panels outright, and the current treatment is a near-opaque legibility aid, not a glass surface.
- **Don't** extend the chat panel's pulsing-dot "thinking" indicator (`TypingDots`) to any other surface. It's a known deviation from PRODUCT.md's explicit ban on pulsing dots / AI-thinking spinners and should be replaced, not reused as a pattern.
- **Don't** introduce warm cream/terracotta tones, "developer blue" card-grid clichés, acid-green-on-black, italic serif display type, or "Introducing…" hero eyebrows — all explicitly out of bounds per PRODUCT.md's anti-references.
- **Don't** use skeleton loaders for async states; the existing loading treatment for chat is copy-based ("Conversation limit reached") rather than a placeholder-shape pattern.
