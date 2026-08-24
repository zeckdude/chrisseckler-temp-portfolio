export type BadgeType = "personal" | "freelance" | "professional";
export type ProjectCategory = "professional" | "personal-freelance";

export interface ProjectLinks {
  live?: string;
  /** Shown as a disabled button with this text as a tooltip/label when there's no live URL. */
  liveNote?: string;
  github?: string;
  company?: string;
}

export interface MyRole {
  title: string;
  context: string;
  scope: string;
}

export interface WhatIBuiltDetailBlock {
  heading: string;
  body: string;
  images?: string[];
  imageCaptions?: Array<{ headline?: string; caption?: string } | null>;
}

export interface WhatIBuiltItem {
  title: string;
  problem: string;
  fix: string;
  result: string;
  /** Single screenshot shorthand. Use `images` for multiple. */
  image?: string;
  /** Multiple screenshots for this feature. Takes precedence over `image` when set. */
  images?: string[];
  /** Optional captions indexed parallel to `images` (or the lone `image`). */
  imageCaptions?: Array<{ headline?: string; caption?: string } | null>;
  /** Grouped detail sections with their own copy and screenshots. */
  detailBlocks?: WhatIBuiltDetailBlock[];
}

export interface Project {
  slug: string;
  title: string;
  company?: string;
  badge: BadgeType;
  category: ProjectCategory;
  dates: string;
  tagline: string;
  techStack: string[];
  overview: string;
  myRole?: MyRole;
  problem?: string;
  whatIBuilt?: WhatIBuiltItem[];
  outcome?: string;
  links: ProjectLinks;
  featured?: boolean;
  /** Screenshots/photos for the project detail page gallery, in display order. */
  images?: string[];
  /**
   * Optional captions for images, indexed parallel to the `images` array.
   * A null/undefined entry means no caption for that image.
   */
  imageCaptions?: Array<{ headline?: string; caption?: string } | null>;
  /** Optional demo video (MP4 path under /public). Shown as the first slide in the gallery. */
  videoSrc?: string;
  /** Optional demo videos in display order. Takes precedence over `videoSrc` when set. */
  videoSrcs?: string[];
  /** Optional poster images keyed by video path (under /public). */
  videoPosters?: Record<string, string>;
}

export const projects: Project[] = [
  {
    slug: "aerospike-cloud-console",
    title: "Aerospike Cloud Console",
    company: "Aerospike",
    badge: "professional",
    category: "professional",
    dates: "Sep 2024 – Jan 2026",
    tagline:
      "Architected the Aerospike Cloud Console provisioning wizard — the enterprise flow that turns prospects into paying customers — and built many of its pages while the Cloud FE team shipped the rest against those patterns.",
    techStack: ["React", "TypeScript", "React Context", "Material UI", "REST APIs", "Vitest", "Playwright"],
    overview:
      "Aerospike Cloud is an enterprise platform for deploying and running high-performance distributed databases in the cloud. I joined the Cloud team as a senior front-end engineer alongside other frontend engineers. The most critical piece of the product was the provisioning wizard: the multi-step flow where a prospect configures and creates their first database. That's the moment a trial becomes revenue. When I arrived, it was fragmented, stateless on refresh, and running alongside a separate legacy admin console (ACMS) that hadn't been unified into the main platform. I planned the wizard's overall architecture and built many of its pages; other frontend engineers on the team shipped additional wizard and console work following those patterns. I also drove testing strategy, legacy integration, and mentorship during a live customer migration where mistakes were costly.",
    myRole: {
      title: "Senior Front-End Engineer, Cloud Team",
      context:
        "Senior FE on a cross-functional Cloud team with other frontend engineers, backend engineers, and product. I architected the provisioning wizard; the team built against those patterns.",
      scope:
        "Wizard architecture and many core pages; component patterns, state management, testing, legacy integration, Access Manager, and mentorship across the console.",
    },
    problem:
      "Enterprise customers dropping off mid-setup meant lost revenue. The provisioning flow had no clear progress tracking, state wasn't persisted across steps (a refresh meant starting over), and the business logic — availability zones, replication factors, cluster sizing — was deeply interdependent in ways no existing library handled cleanly. On top of that, a separate legacy console (ACMS) existed alongside the main platform, creating a disjointed experience during a live customer migration window where mistakes were costly.",
    whatIBuilt: [
      {
        title: "`StepIndicator`",
        problem: "Users dropped off a confusing multi-step setup with no sense of place.",
        fix: "A flow-aware tracker where business logic, not position, controlled which steps were navigable.",
        result: "Completed, active, error, and upcoming states were explicit; only valid steps were jumpable.",
      },
      {
        title: "Smart defaults and presets",
        problem: "Less technical users misconfigured clusters when every option was raw.",
        fix: "Surfaced sensible defaults from use case, company type, or earlier selections.",
        result: "Users could progress with a valid starting config instead of guessing.",
      },
      {
        title: "Inline validation and error messaging",
        problem: "Bad configurations only surfaced at submission, after the work was already done.",
        fix: "Step-level validation blocked progress until the current step was valid.",
        result: "Errors were caught in place, not after a failed launch attempt.",
      },
      {
        title: "Review-before-launch summary",
        problem: "Launching a cluster from a half-seen config made costly mistakes easy.",
        fix: "A summary screen showed the full configuration and kept it editable.",
        result: "Users confirmed or corrected everything before cluster creation ran.",
      },
      {
        title: "Conditional and branching steps",
        problem: "A one-size-fits-all form showed irrelevant options for every cluster path.",
        fix: "The flow adapted based on prior answers, hiding unused steps and fields.",
        result: "Each path only asked what that cluster actually needed.",
      },
      {
        title: "Conditional state reset",
        problem: "Changing an upstream value left stale downstream data that silently broke sizing.",
        fix: "Changing availability zone count invalidated and recalculated node sizing constraints.",
        result: "Downstream fields stayed consistent with the current upstream choices.",
      },
      {
        title: "Async-dependent field handling",
        problem: "Regions and instance types loaded from APIs and blocked the flow mid-step.",
        fix: "Fields loaded asynchronously without freezing or blocking progress.",
        result: "Users could keep working while dependent options arrived.",
      },
      {
        title: "Back navigation with data preservation",
        problem: "Going back a step felt like starting over.",
        fix: "All entered data persisted when navigating to a previous step.",
        result: "Users could revise earlier answers without re-entering the rest.",
      },
      {
        title: "`DatabaseSelectionTable`",
        problem: "A refresh wiped in-progress work and forced users to start over.",
        fix: "React Context state hydrated from `localStorage` across steps.",
        result: "Users never lost their configuration on reload or a return visit.",
      },
      {
        title: "Contextual inline docs panel",
        problem: "Users left the flow to look up Aerospike docs, and often didn't come back.",
        fix: "Fetched docs into a collapsible sidebar styled to the console, scoped to the current page.",
        result: "Help stayed in-context instead of sending people out of the wizard.",
      },
      {
        title: "Dual-mode JSON/YAML config editor",
        problem: "Advanced Aerospike options weren't exposed in the UI, so power users were stuck.",
        fix: "A JSON/YAML editor with conflict detection against values already set in the wizard.",
        result: "Developers could configure any option, with clashes surfaced before launch.",
      },
      {
        title: "Access Manager",
        problem: "Org admin — members, API keys, secrets, audit logs — needed a home in the console.",
        fix: "Tabbed list-and-dialog CRUD per entity: fetch rows, add/edit via dialogs, REST calls.",
        result: "Admins could manage org settings without leaving the Cloud Console.",
      },
      {
        title: "ACMS legacy console integration",
        problem: "ACMS (Aerospike Cloud Managed Service) ran on a human ops model while Cloud DBaaS needed self-serve provisioning — both during a live migration.",
        fix: "Unified the legacy request-style console with the new self-serve wizard, replacing rigid RJSF schema forms on the provisioning path.",
        result: "Customers could migrate without disrupting the in-flight cutover.",
      },
      {
        title: "Async launch error handling",
        problem: "Cluster creation after Review could fail asynchronously with no clear recovery path.",
        fix: "Surfaced errors on the launch step; users could fix config and retry from the same draft.",
        result: "A failed launch did not force starting the wizard over or risk double-creating.",
      },
      {
        title: "Vitest and Playwright coverage",
        problem: "A revenue-critical wizard had no automated coverage for component logic or the full flow.",
        fix: "Playwright on critical paths and major happy paths; Vitest on smaller funnels and unit-level logic.",
        result: "Must-not-break provisioning paths had E2E coverage; supporting logic had unit tests.",
      },
      {
        title: "Mentorship",
        problem: "Junior engineers on the Cloud team needed consistent patterns to ship wizard and console work safely.",
        fix: "Mentored two junior front-end engineers on the wizard architecture, component patterns, and testing.",
        result: "They shipped later Cloud UI work reusing the wizard and step patterns established here.",
      },
    ],
    outcome:
      "The unified flow drove successful enterprise migrations away from the legacy ACMS console. Customers reported that persistence meant they no longer lost the wizard on refresh or leaving the page — they could finish later without starting over. The component patterns I introduced became the architectural foundation for subsequent Cloud UI work — they outlasted my tenure.",
    links: {
      live: "https://console.aerospike.com",
      company: "https://aerospike.com",
    },
    featured: true,
    videoSrc: "/projects/aerospike-cloud-console/demo.mp4",
    images: [
      "/projects/aerospike-cloud-console/1-home.png",
      "/projects/aerospike-cloud-console/2-step1-cluster-details.png",
      "/projects/aerospike-cloud-console/3-step2-region-layout.png",
      "/projects/aerospike-cloud-console/4-step3-availability.png",
      "/projects/aerospike-cloud-console/5-step4-node-sizing.png",
      "/projects/aerospike-cloud-console/6-step5-server-config-json.png",
      "/projects/aerospike-cloud-console/7-step6-review-launch.png",
    ],
  },
  {
    slug: "adim-platform",
    title: "Design System & Platform Engineering",
    company: "Adim",
    badge: "professional",
    category: "professional",
    dates: "May 2023 – Mar 2024",
    tagline:
      "Design system, Storybook, and FE process at a TV/movie creative collaboration startup — consistency and speed where there was no system before.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Storybook"],
    overview:
      "Adim is a creative collaboration platform for TV and movie production. When I joined, the startup was moving fast but had no real design system — duplicated components, visual drift, messy Tailwind, and no Storybook standard. I built shared React components on Next.js and TypeScript, established Storybook and Tailwind discipline, and introduced FE process (PR template, regular FE-only meetings, proactive technical-debt identification) to ship more consistently with fewer preventable bugs.",
    myRole: {
      title: "Senior Front-End Engineer",
      context: "Cross-functional startup; primary FE owner of design system and team practices.",
      scope:
        "Design system and component library, Storybook, Tailwind refinement, marketing site redesign, and FE team process.",
    },
    problem:
      "The product shipped fast but UI was duplicated and inconsistent — no shared component layer, undisciplined Tailwind, and no FE process to catch debt or align the team before it compounded.",
    whatIBuilt: [
      {
        title: "Design system and component library",
        problem: "Engineers rebuilt the same UI every sprint; screens drifted from each other and from design.",
        fix: "Shared React component library on Next.js and TypeScript — product screens import shared components instead of one-offs.",
        result: "A reusable UI layer the team could build on consistently.",
      },
      {
        title: "Storybook",
        problem: "No rigorous catalog for what polished UI looked like before it hit the app.",
        fix: "Storybook as the surface to set and review UI standards before shipping.",
        result: "Engineers built and reviewed interfaces against a shared catalog.",
      },
      {
        title: "Tailwind CSS",
        problem: "Utility styling was copied ad hoc with no shared conventions.",
        fix: "Streamlined and refined Tailwind across the platform on top of the component layer.",
        result: "Cohesive styling the team could apply the same way every time.",
      },
      {
        title: "FE team process",
        problem: "Inconsistent PRs, silent tech debt, and too little FE alignment slowed production and let bugs through.",
        fix: "PR template, regular FE-only sync meetings, and proactive identification of future technical debt.",
        result: "More cohesive FE team and fewer preventable issues — no velocity metric claimed.",
      },
      {
        title: "Marketing website",
        problem: "The marketing site didn't match the product's brand or feel current.",
        fix: "Redesigned it with a modern, intuitive interface.",
        result: "Stronger brand presence and a clearer first impression for users.",
      },
      {
        title: "Stakeholder documentation",
        problem: "Documentation gaps were stalling project flow.",
        fix: "Direct stakeholder communication to unblock docs and decisions.",
        result: "Work kept moving instead of waiting on unanswered questions.",
      },
    ],
    outcome:
      "Consistency and shipping speed improved for the FE team — fewer one-offs, clearer reviews, better alignment — but I don't claim a hard velocity number. In ~10 months I left foundation work: design system, Storybook, Tailwind discipline, and FE process that would outlast individual features.",
    videoSrcs: [
      "/projects/adim-platform/product-explainer.mp4",
      "/projects/adim-platform/product-demo-1.mp4",
      "/projects/adim-platform/product-demo-2.mp4",
      "/projects/adim-platform/product-demo-3.mp4",
    ],
    videoPosters: {
      "/projects/adim-platform/product-explainer.mp4":
        "/projects/adim-platform/video-poster.png",
    },
    links: { company: "https://adim.io" },
  },
  {
    slug: "toucan-browser-extension",
    title: "Language Learning Browser Extension",
    company: "Toucan",
    badge: "professional",
    category: "professional",
    dates: "Dec 2019 – Mar 2023",
    tagline:
      "Took over Toucan's browser extension from a scrappy CTO prototype and shipped the learning UI the product scaled on.",
    techStack: ["Browser Extension APIs", "JavaScript", "TypeScript", "React", "Material UI", "Jest"],
    overview:
      "Toucan replaces select words on pages you're reading with vocabulary in a language you're learning — on desktop browsers, not Chrome-only. I joined at company inception alongside two other engineers who started the same day. The CTO and a contractor had built a basic extension that swapped words clumsily and changed few of them. I took over extension development in year one — reworking logic and shipping sidebar, contextless learning moments, and in-extension games — before moving to the web platform full time. Porting Toucan to mobile Safari was separate work I owned solo; that story lives in the [Mobile Safari extension case study](/projects/toucan-safari-extension).",
    myRole: {
      title: "Senior Software Engineer I → II (early engineer)",
      context:
        "Joined at inception with a small engineering cohort; browser extension was my primary focus in year one.",
      scope: "Extension architecture and features after inheriting the prototype; year one before specializing on the Next.js site.",
    },
    problem:
      "The prototype extension swapped words clumsily and covered too little of each page to feel useful — the core product loop wasn't shippable yet.",
    whatIBuilt: [
      {
        title: "Extension sidebar shell",
        problem:
          "The browser action popup — the default toolbar panel — was too small for settings, navigation, and learning features. MV2 had no native side panel API, so the product needed a larger persistent surface while users browsed.",
        fix:
          "Built a custom page-overlay sidebar from scratch via content scripts — React and Material UI for the chrome: global on/off, close, bottom navigation, and a module slot pattern so features could plug in over time.",
        result:
          "A reusable home for the extension: the team could ship new modules without reworking the shell, and learners could find and control Toucan on any site.",
        image: "/projects/toucan-browser-extension/sidebar-settings-shell.png",
      },
      {
        title: "Pause with duration options",
        problem:
          "Turning Toucan off was all-or-nothing — disable entirely or uninstall. Users who wanted a break often turned it off and forgot to turn it back on, so they lost learning momentum or churned.",
        fix:
          "Built a pause toggle with duration presets — 1 hour, until 6 p.m., until tomorrow, daily 9 a.m.–6 p.m., indefinitely — plus paused-state UI, clear copy, and a warning when paused indefinitely.",
        result:
          "A friendlier off-ramp without uninstalling; timed presets auto-resume learning so users don't have to remember to re-enable.",
        images: [
          "/projects/toucan-browser-extension/pause-duration-options.png",
          "/projects/toucan-browser-extension/pause-duration-indefinitely.png",
        ],
        imageCaptions: [
          {
            headline: "Pause duration options",
            caption: "Preset timers so users can step away without uninstalling.",
          },
          {
            headline: "Indefinitely selected",
            caption: "Clear warning when Toucan stays off with no return timer.",
          },
        ],
      },
      {
        title: "Saved words and practice quizzes",
        problem:
          "Inline word swaps were passive — users couldn't collect vocabulary or actively review what they'd encountered while browsing.",
        fix:
          "Built the full flow: save from the inline translation dialog, a Saved sidebar panel with sort, mastery status, and completion tracking, plus randomized practice quizzes (five module types) with stage-specific UI (empty state, in-progress, daily goals). During practice, swapped words on the page are obfuscated so users recall from memory.",
        result:
          "Turned passive browsing into active recall — users owned a personal vocabulary list and could practice it without leaving the page.",
        images: [
          "/projects/toucan-browser-extension/saved-words-save-dialog.png",
          "/projects/toucan-browser-extension/saved-words-empty-state.png",
          "/projects/toucan-browser-extension/saved-words-list.png",
          "/projects/toucan-browser-extension/saved-words-practice-cta.png",
          "/projects/toucan-browser-extension/saved-words-quiz-multiple-choice.png",
          "/projects/toucan-browser-extension/saved-words-quiz-matching.png",
        ],
        imageCaptions: [
          {
            headline: "Save from inline dialog",
            caption: "Bookmark a swapped word from the hover card.",
          },
          {
            headline: "Empty state",
            caption: "Onboarding when the nest is empty; 10 words unlock practice.",
          },
          {
            headline: "Saved words list",
            caption: "Sort, mastery bars, and daily practice progress.",
          },
          {
            headline: "Practice prompt",
            caption: "Daily goal CTA while browsing a live page.",
          },
          {
            headline: "Multiple-choice quiz",
            caption: "One of five randomized quiz module types.",
          },
          {
            headline: "Matching quiz",
            caption: "Match words to translations in-sidebar.",
          },
        ],
      },
      {
        title: "Toucan Tips",
        problem:
          "Users didn't know what Toucan could do — features were buried in the sidebar with no guided discovery.",
        fix:
          "Built a Tips hub in the sidebar: an Explore Toucan checklist for core actions, a standalone refresher that replays the onboarding-style simulated browser, and Extra Practice — an injectable on-page quiz on known sites with user-controlled launch and dismiss.",
        result:
          "Self-serve help at their fingertips — discover features, relearn how Toucan works, and get extra practice without support.",
        detailBlocks: [
          {
            heading: "Toucan Tips hub",
            body:
              "A discovery panel listing Tips, shortcuts to the Explore checklist, refresher tutorial, and Extra Practice — plus contextual cards like keyboard pause hints.",
            images: [
              "/projects/toucan-browser-extension/toucan-tips-hub.png",
              "/projects/toucan-browser-extension/toucan-tips-explore-checklist.png",
            ],
            imageCaptions: [
              {
                headline: "Toucan Tips hub",
                caption: "Central place to discover features and open tutorials.",
              },
              {
                headline: "Explore Toucan checklist",
                caption: "Guided actions with progress tracking until users feel confident.",
              },
            ],
          },
          {
            heading: "Refresher tutorial",
            body:
              "Launches the simulated browser experience from onboarding on a standalone page — users can relearn hover translations, progress tracking, and pause at any time.",
            images: [
              "/projects/toucan-browser-extension/toucan-tips-refresher-welcome.png",
              "/projects/toucan-browser-extension/toucan-tips-refresher-hover.png",
              "/projects/toucan-browser-extension/toucan-tips-refresher-progress.png",
              "/projects/toucan-browser-extension/toucan-tips-refresher-pause.png",
            ],
            imageCaptions: [
              {
                headline: "Ready for more?",
                caption: "Entry point to replay the onboarding-style walkthrough.",
              },
              {
                headline: "Hover to learn",
                caption: "Step 1 — hover a swapped word for the translation.",
              },
              {
                headline: "Track your progress",
                caption: "Step 2 — see how mastery unlocks more context.",
              },
              {
                headline: "Press pause",
                caption: "Step 3 — pause Toucan for a set duration from the popup.",
              },
            ],
          },
          {
            heading: "Extra Practice",
            body:
              "Injects a practice module into a known area of a known site — users can launch when ready, dismiss permanently, and quiz on words they've already seen while browsing.",
            images: [
              "/projects/toucan-browser-extension/toucan-tips-extra-practice-cta.png",
              "/projects/toucan-browser-extension/toucan-tips-extra-practice-quiz.png",
              "/projects/toucan-browser-extension/toucan-tips-extra-practice-success.png",
            ],
            imageCaptions: [
              {
                headline: "Extra Practice CTA",
                caption: "Injectable prompt on Wikipedia — user chooses when to begin.",
              },
              {
                headline: "In-page quiz",
                caption: "Practice saved vocabulary without leaving the article.",
              },
              {
                headline: "Session complete",
                caption: "Success feedback with option to keep practicing.",
              },
            ],
          },
        ],
      },
      {
        title: "Extension settings modules",
        problem:
          "Extension settings were scattered or unreachable — users couldn't control language, blocking, audio, shortcuts, or account without friction.",
        fix:
          "Built five settings modules inside the sidebar — language switcher, blocked sites, audio controls, keyboard hotkeys, and delete account — each wired to backend behavior so users stayed in the extension.",
        result:
          "Users could self-serve — switch languages, block sites, tune audio, use hotkeys, and leave cleanly without leaving the extension.",
        detailBlocks: [
          {
            heading: "Language switcher",
            body:
              "Switch source and target language from Settings; triggers a new translation set download when needed — no leaving the extension.",
            images: [
              "/projects/toucan-browser-extension/settings-language-light.png",
              "/projects/toucan-browser-extension/settings-language-dark.png",
            ],
            imageCaptions: [
              {
                headline: "Settings — light mode",
                caption: "Language picker and module entry points in the sidebar settings panel.",
              },
              {
                headline: "Settings — dark mode",
                caption: "Same panel in dark theme.",
              },
            ],
          },
          {
            heading: "Blocked sites",
            body:
              "URL input and block list UI that sends blocked domains to the backend — blocking logic already existed; this let users manage sites from Settings or the word popup.",
            images: ["/projects/toucan-browser-extension/settings-blocked-sites.png"],
            imageCaptions: [
              {
                headline: "Blocked sites",
                caption: "Add or remove domains where Toucan should not run.",
              },
            ],
          },
          {
            heading: "Audio controls",
            body:
              "Pronunciation speed with live preview and a voice picker for persona narration — researched natural-voice libraries to find quality options.",
            images: ["/projects/toucan-browser-extension/settings-audio-controls.png"],
            imageCaptions: [
              {
                headline: "Audio controls",
                caption: "Adjust speed and choose a voice with inline preview.",
              },
            ],
          },
          {
            heading: "Keyboard hotkeys",
            body:
              "Shortcuts for activate extension, open the settings sidebar, and pause/unpause Toucan — configurable from the browser's extension shortcuts UI.",
            images: ["/projects/toucan-browser-extension/settings-keyboard-hotkeys.png"],
            imageCaptions: [
              {
                headline: "Keyboard hotkeys",
                caption: "Extension shortcuts for activate, open sidebar, and pause.",
              },
            ],
          },
          {
            heading: "Delete account",
            body:
              "Warning step before deletion — progress and settings would be lost — then confirm. Respectful offboarding so frustrated users could leave without bad reviews.",
            images: ["/projects/toucan-browser-extension/settings-delete-account.png"],
            imageCaptions: [
              {
                headline: "Delete account",
                caption: "Heads-up before permanent account deletion.",
              },
            ],
          },
        ],
      },
      {
        title: "RFCs",
        problem: "Extension and platform bottlenecks stayed implicit as the team grew.",
        fix: "Wrote RFCs to surface technical constraints and align the team before building.",
        result: "Shared context for extension and platform decisions.",
      },
    ],
    outcome:
      "Toucan reached 1M+ users during my tenure — a company outcome I do not claim sole credit for. I owned browser extension engineering in year one, turning a scrappy prototype into the learning UI the product scaled on.",
    links: {
      live: "https://chromewebstore.google.com/detail/toucan-by-babbel-language/lokjgaehpcnlmkebpmjiofccpklbmoci",
      company: "https://jointoucan.com",
    },
    featured: true,
    images: [
      "/projects/toucan-browser-extension/1-brand-hero.png",
      "/projects/toucan-browser-extension/2-how-it-works.png",
      "/projects/toucan-browser-extension/3-wikipedia-inline-learning.png",
      "/projects/toucan-browser-extension/4-sidebar-settings.png",
      "/projects/toucan-browser-extension/5-language-picker.png",
      "/projects/toucan-browser-extension/6-highlight-to-translate.png",
      "/projects/toucan-browser-extension/7-contextless-quiz-success.png",
      "/projects/toucan-browser-extension/8-contextless-quiz-minions.png",
      "/projects/toucan-browser-extension/9-practice-activities.png",
      "/projects/toucan-browser-extension/10-extra-practice-modal.png",
      "/projects/toucan-browser-extension/11-shortcuts-dining-out.png",
      "/projects/toucan-browser-extension/12-toucan-tips.png",
      "/projects/toucan-browser-extension/13-onboarding-checklist.png",
      "/projects/toucan-browser-extension/14-saved-words-empty.png",
      "/projects/toucan-browser-extension/15-saved-words.png",
      "/projects/toucan-browser-extension/16-practice-progress.png",
      "/projects/toucan-browser-extension/17-chrome-web-store.png",
    ],
    imageCaptions: [
      { headline: "Toucan browser extension", caption: "Language learning while you browse — Editor's Picks on Chrome and Edge." },
      { headline: "How Toucan works", caption: "Words swap inline on pages you already read; hover for translation and practice." },
      { headline: "Inline learning on Wikipedia", caption: "Real-page word swaps, hover card, and the extension sidebar — the core product loop." },
      { headline: "Extension settings", caption: "Per-site permissions, learning level, highlight-to-translate, extra practice, and dark mode." },
      { headline: "Language picker", caption: "Switch learning languages from the sidebar with instant confirmation." },
      { headline: "Highlight to translate", caption: "Select any word on a page and translate it on demand." },
      { headline: "Contextless quiz", caption: "Learning moments that appear on arbitrary sites — with success feedback when you get it right." },
      { headline: "Contextless quiz on any site", caption: "The same learning moments work on entertainment pages — vocabulary practice wherever you browse." },
      { headline: "Practice activities", caption: "In-extension games that reinforce vocabulary throughout the day." },
      { headline: "Extra practice", caption: "Quick practice sessions on sites like YouTube and Reddit when you have a spare moment." },
      { headline: "Spanish Shortcuts", caption: "Curriculum paths for phrases you'll actually use — like dining out." },
      { headline: "Toucan Tips", caption: "In-context guidance to help users discover features as they browse." },
      { headline: "Onboarding checklist", caption: "Guided setup that walks new users through permissions, settings, and first practice." },
      { headline: "Saved words", caption: "Empty state before users start building their personal vocabulary list." },
      { headline: "Saved words in action", caption: "Bookmark vocabulary from the wild and see it highlighted when you browse again." },
      { headline: "Practice progress", caption: "Daily practice sessions and mastery tracking on saved words." },
      { headline: "Chrome Web Store", caption: "Editor's Picks listing — 300K+ users and strong reviews at scale." },
    ],
  },
  {
    slug: "toucan-safari-extension",
    title: "Mobile Safari Extension Port",
    company: "Toucan",
    badge: "professional",
    category: "professional",
    dates: "Dec 2019 – Mar 2023",
    tagline:
      "Solo port of Toucan's browser extension to mobile Safari — sparse docs, heavy tinkering, one of the first extensions on Apple's marketplace.",
    techStack: ["Safari Web Extensions", "iOS", "JavaScript", "TypeScript"],
    overview:
      "Toucan wanted a mobile Safari extension — the company's first attempt. I was tasked solo with porting the desktop browser extension to mobile Safari. Apple’s extension model had very little documentation at the time. When the obvious path failed, I relied on tinkering and educated guesses from prior extension experience until it worked. It shipped as one of the first mobile extensions on the App Store extension marketplace.",
    myRole: {
      title: "Senior Software Engineer I → II (early engineer)",
      context: "Solo owner of the mobile Safari port; separate from the main browser extension team flow in year one.",
      scope: "End-to-end port from desktop extension to mobile Safari with no playbook.",
    },
    problem:
      "Toucan had no mobile Safari presence and almost no internal knowledge of how to get there — Apple's extension APIs and docs were thin, and this was the company's first try.",
    whatIBuilt: [
      {
        title: "Chrome-to-Safari mobile port",
        problem: "The desktop extension couldn't run on mobile Safari without a ground-up port, and documentation didn't explain how.",
        fix: "Solo port of extension logic and behavior to mobile Safari — experimenting when docs ran out and guessing from extension experience when builds failed.",
        result: "A working mobile Safari extension where none existed before.",
      },
      {
        title: "First marketplace ship",
        problem: "Mobile extension distribution was new territory for both Toucan and the App Store ecosystem.",
        fix: "Pushed the port through Apple's extension submission path until it was accepted.",
        result: "Shipped among the first mobile extensions on the App Store extension marketplace — early proof that Toucan could live outside desktop browsers.",
      },
    ],
    outcome:
      "I got Toucan's first mobile Safari extension live with no template to follow — solo, under-documented APIs, and iterative debugging. Do not claim to be the absolute first extension on the store; it was one of the early mobile extensions on the marketplace when that surface was new.",
    links: { live: "https://jointoucan.com", company: "https://jointoucan.com" },
  },
  {
    slug: "toucan-website",
    title: "Web Platform & Marketing Site",
    company: "Toucan",
    badge: "professional",
    category: "professional",
    dates: "Dec 2019 – Mar 2023 (site: year 1 → ongoing)",
    tagline:
      "Architected Toucan's Next.js web platform from scratch — signup, billing, and a marketing site that scored 98 on Core Web Vitals.",
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "GraphQL", "MongoDB", "Material UI", "Amplitude", "Jest"],
    overview:
      "The extension needed a real web platform for signup, billing, account management, and SEO-driven growth. I architected the Next.js site from the beginning while also working the extension in year one; after that I focused on the website full time. A designer joined around the same time — I paired with her so the design system would transfer cleanly into the component library I chose.",
    myRole: {
      title: "Senior Software Engineer I → II (early engineer)",
      context:
        "Architected the site from day one; primary focus after year one as the team grew to 30.",
      scope: "Next.js platform, component library, marketing performance, experimentation, and mentorship as the web team scaled.",
    },
    problem:
      "There was no production web platform for signup, billing, or SEO — and the public marketing site eventually scored 35 on Core Web Vitals, blocking organic growth.",
    whatIBuilt: [
      {
        title: "Next.js website",
        problem: "No in-house site existed for signup, billing, or account management.",
        fix: "Architected and built the platform from scratch — homepage, dashboard, subscription, and login/signup flows.",
        result: "Web surfaces handled signup, billing, and marketing traffic as the company grew.",
      },
      {
        title: "Component library",
        problem: "UI was inconsistent without shared primitives aligned to design.",
        fix: "Picked the component library and paired with a new designer so the design system transferred cleanly into code.",
        result: "Developers shipped consistent UI faster as the team grew.",
      },
      {
        title: "Marketing site performance",
        problem: "Core Web Vitals on the public marketing site scored 35 — LCP, JavaScript weight, and late-loading fonts and layout hurt SEO.",
        fix: "Optimized first paint — lighter JS, faster LCP, and fixing assets that loaded a beat late and tanked the score.",
        result: "Marketing-site Core Web Vitals improved from 35 → 98, supporting SEO-driven growth.",
      },
      {
        title: "A/B testing infrastructure",
        problem: "Acquisition and retention decisions lacked experiment data.",
        fix: "A/B testing infrastructure feeding the product team.",
        result: "Data that drove subscription growth.",
      },
      {
        title: "Mentorship and hiring",
        problem: "A growing web team needed hiring signal and junior support.",
        fix: "Mentored junior engineers and conducted employment interviews.",
        result: "The team could hire and ramp people as it scaled to 30.",
      },
    ],
    outcome:
      "The company reached 13M lifetime page views and 1M+ users — metrics I attribute to the product, not solely to my work. I architected the Next.js platform from scratch and raised marketing-site Core Web Vitals from 35 → 98 by fixing LCP, JavaScript weight, and late-loading fonts and layout.",
    links: { live: "https://jointoucan.com", company: "https://jointoucan.com" },
    images: [
      "/projects/toucan-website/1-homepage-hero.png",
      "/projects/toucan-website/2-onboarding-language.png",
      "/projects/toucan-website/3-onboarding-tutorial.png",
      "/projects/toucan-website/4-extension-permission.png",
      "/projects/toucan-website/5-account-settings.png",
    ],
    imageCaptions: [
      { headline: "Marketing homepage", caption: "SEO-driven landing page with language picker, social proof, and in-context product demo." },
      { headline: "Onboarding — language picker", caption: "Signup flow where users choose source and target languages." },
      { headline: "Onboarding tutorial", caption: "In-product walkthrough teaching hover-to-learn and progress tracking." },
      { headline: "Extension permission", caption: "Browser permission step with security messaging before install." },
      { headline: "Account settings", caption: "Authenticated account management — profile, email, and password." },
    ],
  },
  {
    slug: "dave-support-tooling",
    title: "Customer Support Tooling",
    company: "Dave.com",
    badge: "professional",
    category: "professional",
    dates: "Mar 2018 – Oct 2019",
    tagline:
      "Internal support tooling during fintech hypergrowth — Zendesk embeds, pause/unpause, and faster agent workflows.",
    techStack: ["JavaScript", "TypeScript", "React", "GraphQL", "Node.js", "MySQL", "Zendesk"],
    overview:
      "Dave is a banking app helping members avoid overdraft fees. During hypergrowth (200K → 4M+ users), support needed to resolve member issues at scale — growth made it urgent, but the broken part was agents lacking fast, safe access to account data in the tools they already used. I joined as a Full Stack Engineer and was promoted to Senior Front-End Engineer within seven months.",
    myRole: {
      title: "Full Stack Engineer → Senior Front-End Engineer",
      context: "Joined during early hypergrowth; promoted within 7 months.",
      scope: "Internal support surfaces — Zendesk integrations, member account actions, and support workflow automation.",
    },
    problem:
      "Support agents worked in Zendesk but couldn't see Dave member and bank-linked account data in that view — and members who needed a pause were churning instead.",
    whatIBuilt: [
      {
        title: "Zendesk customer data modules",
        problem: "Support lived in Zendesk but couldn't see member and account data in the view they used all day.",
        fix: "Custom JavaScript modules embedded in Zendesk surfacing customer and account information inline.",
        result: "Agents diagnosed accounts without leaving Zendesk or waiting on engineering for basic lookups.",
      },
      {
        title: "Pause and unpause accounts",
        problem: "Members who needed a break were churning instead of pausing.",
        fix: "Built pause and unpause flows for member accounts.",
        result: "Members could take a break without fully canceling — better retention than hard churn.",
      },
      {
        title: "Ticket automation",
        problem: "Customer tickets were handled slowly and by hand.",
        fix: "Automated scripts for ticket handling.",
        result: "Faster response times for common support workflows.",
      },
    ],
    outcome:
      "Dave reached unicorn status and 4M+ users during this period — company outcomes, not mine alone. I shipped support tooling that let agents see account data inside Zendesk, pause/unpause for retention, and ticket automation — and helped scale hiring through 50+ interviews.",
    links: { live: "https://dave.com", company: "https://dave.com" },
  },
  {
    slug: "dave-mobile-app",
    title: "Mobile App (React Native)",
    company: "Dave.com",
    badge: "professional",
    category: "professional",
    dates: "Mar 2018 – Oct 2019",
    tagline:
      "React Native UI during Dave's hypergrowth — modular screens and components as the member app scaled to millions of users.",
    techStack: ["React Native", "TypeScript", "React", "Redux", "GraphQL", "Firebase"],
    overview:
      "Dave's member-facing banking app scaled from 200K to 4M+ users while I was there. I built modular React Native screens and components so the mobile team could ship UI without rewriting every surface from scratch — part of the same promotion from Full Stack to Senior Front-End Engineer within seven months.",
    myRole: {
      title: "Full Stack Engineer → Senior Front-End Engineer",
      context: "Mobile and web contributions during the same hypergrowth window.",
      scope: "React Native member app UI — reusable screens and components.",
    },
    problem:
      "The mobile app needed reusable screens and components that could keep pace with product growth — one-off UI wouldn't scale as membership exploded.",
    whatIBuilt: [
      {
        title: "React Native screens",
        problem: "New member-facing flows needed to ship quickly without rewriting UI each time.",
        fix: "Modular React Native components and screens shared across the app.",
        result: "The team could ship mobile UI faster as the user base grew.",
      },
      {
        title: "Tests",
        problem: "Rapid growth increased the cost of mobile regressions.",
        fix: "Unit and integration tests on critical mobile and shared UI paths.",
        result: "Fewer errors reaching production during hypergrowth.",
      },
    ],
    outcome:
      "Dave scaled from 200K to 4M+ users during this period — a company result, not a personal metric. I contributed modular React Native UI and test coverage as the member app grew; promoted to Senior Front-End Engineer within seven months.",
    links: { live: "https://dave.com", company: "https://dave.com" },
    featured: true,
  },
  {
    slug: "dave-public-website",
    title: "Public Marketing Website",
    company: "Dave.com",
    badge: "professional",
    category: "professional",
    dates: "Mar 2018 – Oct 2019",
    tagline:
      "Built Dave.com's public marketing site from scratch — no dedicated web team, shipped with design and product.",
    techStack: ["TypeScript", "React", "Redux", "Node.js", "GraphQL"],
    overview:
      "Dave needed a public-facing site for marketing and member acquisition, and there wasn't one owned in-house — no dedicated web team. I was the sole front-end owner: React, TypeScript, and Redux, implementing from design comps and product requirements while partners owned visuals and specs. Whatever SEO shipped with the site, I don't claim a strong SEO metric. The company scaled from 200K to 4M+ users in that window — a company outcome, not mine alone.",
    myRole: {
      title: "Full Stack Engineer → Senior Front-End Engineer",
      context: "Same tenure as support tooling and mobile app work; promoted within 7 months.",
      scope:
        "Solo FE owner of the public marketing site — implementation end to end; design and product owned visuals and requirements.",
    },
    problem:
      "Dave had no in-house public marketing site — acquisition and brand depended on shipping dave.com without a web team standing behind it.",
    whatIBuilt: [
      {
        title: "Dave.com public website",
        problem: "Marketing and product needed a production public site and no one owned it internally.",
        fix: "Built the full public site as sole FE — React, TypeScript, Redux — implementing design comps and product requirements.",
        result: "Production marketing site live at dave.com without a dedicated in-house web team; no traffic or SEO metric claimed beyond shipping.",
      },
    ],
    outcome:
      "I owned the public marketing site implementation during hypergrowth. Dave reached unicorn status in that period — a company metric. The honest result for this project is a live marketing presence built solo on the front end with design and product partners.",
    links: { live: "https://dave.com", company: "https://dave.com" },
  },
  {
    slug: "chrome-river-expense-reporting",
    title: "Expense Reporting Software",
    company: "Chrome River",
    badge: "professional",
    category: "professional",
    dates: "Dec 2015 – Mar 2018",
    tagline:
      "Front-end engineering on enterprise expense reporting — employee submit flows in a large-scale Backbone.js fintech app.",
    techStack: ["JavaScript", "Backbone.js", "AJAX", "REST APIs", "HTML", "CSS"],
    overview:
      "Chrome River (now Emburse Enterprise) builds expense and invoice management software used by large, global organizations. For two-plus years I worked on the expense reporting side — modular Backbone.js views for employee submit flows, wired to REST endpoints, shipped on sprint cadence with pixel-accurate Figma specs.",
    myRole: {
      title: "Software Engineer, Front End",
      context: "Agile team; close collaboration with PMs and back-end engineers.",
      scope:
        "Expense reporting surfaces — employee submit flows, REST integration, bug fixes, and pixel-accurate Figma implementation.",
    },
    problem:
      "A large Backbone.js expense reporting app needed new employee submit views wired to REST data and shipped every sprint — in fintech, design specs had to match production UI.",
    whatIBuilt: [
      {
        title: "Employee expense submit views",
        problem: "Expense reporting needed new employee-facing views wired to live REST data.",
        fix: "Modular Backbone.js views using AJAX against REST endpoints.",
        result: "New submit surfaces shipped inside the existing expense reporting app.",
      },
      {
        title: "Pixel-accurate specs",
        problem: "Design specs weren't translating into a consistent UI.",
        fix: "Pixel-accurate implementation of Figma and design specs.",
        result: "A consistent experience across the expense views I owned.",
      },
      {
        title: "Agile delivery",
        problem: "Bugs and stories stacked up in an agile fintech workflow.",
        fix: "Resolved bugs and delivered stories in sprint cadence.",
        result: "Work shipped on the team's schedule — no single hero bug story; honest routine enterprise FE.",
      },
    ],
    outcome:
      "Two-plus years of reliable sprint delivery on expense reporting surfaces — pixel-accurate Figma implementation and modular Backbone views. No single project metric claimed.",
    links: { company: "https://emburse.com" },
  },
  {
    slug: "fox-international-portal",
    title: "Fox International Portal",
    company: "Trailer Park",
    badge: "professional",
    category: "professional",
    dates: "Aug 2014",
    tagline:
      "A multi-country entertainment portal for Fox Entertainment Group — full movie and TV catalog, Digital HD purchasing flows, and a CMS-driven content layer built to scale across regions.",
    techStack: ["JavaScript", "jQuery", "PHP", "Yii Framework", "HTML", "CSS", "MVC"],
    overview:
      "Fox Entertainment Group needed an international web portal that could showcase their full library of movies and TV titles, drive Digital HD, Blu-ray, and DVD sales, and be managed independently by local teams across multiple countries — all from a single codebase. I joined the project at Trailer Park as the lead front-end developer on a small team and owned the entire client-side experience from the homepage down to individual title pages.",
    myRole: {
      title: "Lead Front-End Developer",
      context: "Small team at Trailer Park, building for Fox Entertainment Group.",
      scope:
        "Led all front-end development — JavaScript interactivity, CMS integration, mobile-responsive layout. Back-end/CMS teammates owned Yii/PHP.",
    },
    problem:
      "Fox needed a single portal that could serve audiences across multiple countries while letting regional teams control their own content — different titles, different release dates, different retailer partnerships — without touching code. At the same time, the site had to handle a wide range of content types: hero carousels promoting current theatrical releases, structured catalog grids for TV seasons, multi-tab movie detail pages with purchase flows, and promotional campaign tiles, all on a CMS-editable foundation.",
    whatIBuilt: [
      {
        title: "Homepage hero carousel",
        problem: "Theatrical releases needed a homepage moment that drove people into titles.",
        fix: "Full-bleed hero with dots, directional controls, and smooth transitions.",
        result: "Current releases had a clear path to their title pages.",
      },
      {
        title: "Multi-tab detail pages",
        problem: "Movie and TV pages had to cover info, Digital HD, Blu-ray, and DVD without clutter.",
        fix: "Multi-tab pages with their own sub-nav and content zones.",
        result: "Each format had a dedicated place without dumping everything on one screen.",
      },
      {
        title: "Digital HD purchasing",
        problem: "Retailer availability differed by country and couldn't be hardcoded.",
        fix: "A CMS-driven retailer grid — iTunes, Google Play, Amazon, Xbox, Sky Store, and others. Hardest JS problem: per-region, per-title store lists from CMS without hardcoding.",
        result: "Each title showed the right stores for that region.",
      },
      {
        title: "Photo slider",
        problem: "Cast and production stills had no structured place on title pages.",
        fix: "A photo slider on movie detail pages.",
        result: "Imagery was browsable without leaving the title.",
      },
      {
        title: "Promotional campaign tiles",
        problem: "Regional teams needed campaign modules they could configure themselves.",
        fix: "CMS-configurable tiles for campaigns like Bond and Bridge of Spies.",
        result: "Local teams could run franchise campaigns without engineering.",
      },
      {
        title: "TV catalog grid",
        problem: "A large TV-to-own catalog needed a consistent, scalable layout.",
        fix: "A large-format grid with consistent cards and metadata.",
        result: "Many titles displayed uniformly instead of as one-off layouts.",
      },
      {
        title: "Responsive CMS foundation",
        problem: "Regional teams couldn't update content, imagery, or retailers without engineering.",
        fix: "Mobile-responsive Yii MVC site with a CMS for content, images, and retailer grids.",
        result: "Non-technical regional teams owned their country's site.",
      },
    ],
    outcome:
      "Shipped on deadline for Fox's international theatrical and marketing beat — portal live across multiple regions. CMS gave regional teams autonomy over content; no traffic metric claimed.",
    links: { company: "https://trailerparkgroup.com" },
    images: [
      "/projects/fox-international-portal/1-homepage-hero.png",
      "/projects/fox-international-portal/2-movie-info.png",
      "/projects/fox-international-portal/3-promo-tiles.png",
      "/projects/fox-international-portal/4-catalog-grid.png",
      "/projects/fox-international-portal/5-photos-slider.png",
      "/projects/fox-international-portal/6-digital-hd-retailers.png",
      "/projects/fox-international-portal/7-early-access.png",
    ],
  },
  {
    slug: "warner-bros-300",
    title: "Warner Bros. 300: Rise of an Empire — Movie Teaser Site",
    company: "Trailer Park",
    badge: "professional",
    category: "professional",
    dates: "Jul 2013",
    tagline:
      "A Warner Bros. movie marketing site for '300: Rise of an Empire' — videos, character profiles, movie poster downloads, and social sharing, built mobile-first.",
    techStack: ["JavaScript", "jQuery", "HTML", "CSS", "YouTube API"],
    overview:
      "Built at Trailer Park for Warner Bros., this teaser site supported the theatrical release of '300: Rise of an Empire'. It combined rich media — embedded trailers, plot synopsis, character profiles, and downloadable movie posters — in a fully mobile-responsive package with YouTube video integration and social sharing features.",
    myRole: {
      title: "Front-End Developer",
      context: "Delivered at Trailer Park as part of the Warner Bros. campaign team.",
      scope: "Front-end development across the full site: media embeds, responsive layout, and social integrations.",
    },
    problem:
      "Warner Bros. needed a mobile-first teaser site live ahead of the theatrical release — trailers, character content, poster downloads, and social sharing in one responsive package.",
    whatIBuilt: [
      {
        title: "YouTube trailers",
        problem: "Trailers needed to play on a marketing site without breaking the layout.",
        fix: "Embedded YouTube trailers in a responsive video layout.",
        result: "Trailers worked across screen sizes.",
      },
      {
        title: "Character profiles",
        problem: "The campaign needed a place for characters and plot beyond the trailer.",
        fix: "Character profile and plot synopsis sections.",
        result: "Visitors could learn the story without leaving the teaser site.",
      },
      {
        title: "Poster downloads",
        problem: "Fans had no official way to grab the movie poster from the site.",
        fix: "Movie poster download functionality.",
        result: "The poster was a one-click asset, not a screenshot.",
      },
      {
        title: "Social sharing",
        problem: "Campaign traffic needed a path onto Facebook, Twitter, and other networks.",
        fix: "Social sharing features for those platforms.",
        result: "Visitors could share the teaser without copying URLs by hand.",
      },
      {
        title: "Mobile-responsive layout",
        problem: "Movie marketing traffic was heavily mobile and the layout had to hold up.",
        fix: "A fully mobile-responsive layout across the site.",
        result: "The teaser worked on phones as well as desktop.",
      },
    ],
    outcome:
      "Shipped for the 300: Rise of an Empire marketing campaign on a theatrical deadline — no traffic or engagement metric claimed.",
    links: { company: "https://trailerparkgroup.com" },
  },
  {
    slug: "warner-bros-cartoon-universe",
    title: "Warner Bros. Cartoon Universe — Parents Portal",
    company: "Trailer Park",
    badge: "professional",
    category: "professional",
    dates: "Sep 2012 – Jan 2013",
    tagline:
      "Redesigned and rebuilt the parents' portal for Warner Bros.' MMORPG 'Cartoon Universe' — heavy jQuery, Zend PHP, Drupal, and SOAP integrations.",
    techStack: ["jQuery", "JavaScript", "PHP", "Zend Framework", "Drupal", "SOAP", "HTML", "CSS"],
    overview:
      "Warner Bros.' online MMORPG 'Cartoon Universe' had a parents' portal that needed a full redesign and rebuild. Working at Trailer Park, I was part of the team that rebuilt the portal from the ground up — handling the front-end and back-end integration work connecting the new UI to the game's underlying SOAP-based API layer.",
    myRole: {
      title: "Front-End / Full-Stack Developer",
      context: "Trailer Park team working directly with Warner Bros. on the Cartoon Universe game portal.",
      scope: "Front-end rebuild, Drupal customization, Zend PHP integration, and SOAP API connectivity.",
    },
    problem:
      "Parents of kids playing Warner Bros.' Cartoon Universe MMORPG needed a modern portal for account management and game-linked actions — the existing parents' portal was outdated and hard to maintain.",
    whatIBuilt: [
      {
        title: "Parents' portal rebuild",
        problem: "The parents' portal was outdated and needed a full visual and structural rebuild.",
        fix: "Redesigned and rebuilt the front end from the ground up.",
        result: "Parents got a new portal UI instead of a patched legacy page.",
      },
      {
        title: "Drupal CMS",
        problem: "Portal content needed a CMS layer the team could actually manage.",
        fix: "Drupal customization for portal content.",
        result: "Content could be managed without a full engineering cycle.",
      },
      {
        title: "Zend PHP application tier",
        problem: "The application tier needed a framework between the CMS and APIs.",
        fix: "Zend PHP framework integration.",
        result: "Server-side logic had a structured home in the rebuild.",
      },
      {
        title: "SOAP API integration",
        problem: "The portal had to talk to the game backend, which was SOAP.",
        fix: "SOAP API integration to the Cartoon Universe game backend.",
        result: "Parents' portal actions could reach the live game systems.",
      },
    ],
    outcome:
      "Rebuilt parents' portal shipped — Drupal and Zend tiers connected to the game's SOAP backend. No usage metric claimed.",
    links: {
      company: "https://trailerparkgroup.com",
    },
  },
  {
    slug: "applied-materials-order-center",
    title: "Applied Materials Business Card Order Center",
    company: "Pro Print & Services",
    badge: "freelance",
    category: "personal-freelance",
    dates: "Apr 2011",
    tagline:
      "An automated business card ordering system for a print shop's largest corporate client — PDF preview, manager approval, and a custom CMS for the print team.",
    techStack: ["PHP", "JavaScript", "jQuery", "MySQL", "HTML", "CSS"],
    overview:
      "Pro Print & Services, a printing company, needed a smarter way to handle recurring business card orders for their high-volume corporate client Applied Materials. The manual ordering process was slow and error-prone. I built a web-based order center that automated the workflow end to end — from employee card customization through manager approval and print-ready PDF generation, with a custom CMS so the print team could manage all orders without developer involvement.",
    myRole: {
      title: "Developer",
      context: "Built for Pro Print & Services to serve their Applied Materials corporate account.",
      scope: "Full project ownership — front-end UI, back-end order logic, PDF generation, and the admin CMS.",
    },
    problem:
      "Applied Materials employees ordered business cards through slow, error-prone email back-and-forth — typos, missing approvals, and no self-service preview before print.",
    whatIBuilt: [
      {
        title: "Business card order form",
        problem: "Employees ordered cards through slow, error-prone back-and-forth.",
        fix: "A web form with live validation for card details.",
        result: "Orders started complete and valid instead of bouncing on typos.",
      },
      {
        title: "PDF preview",
        problem: "Employees couldn't see the card layout until it was already in print.",
        fix: "Server-generated PDF preview before submit — preview matched print output.",
        result: "People caught layout mistakes before the order went to a manager.",
      },
      {
        title: "Manager approval workflow",
        problem: "Orders went to print without a gated approval step.",
        fix: "Email-notified manager approval before print.",
        result: "Only approved cards reached the print queue.",
      },
      {
        title: "Print-team CMS",
        problem: "The print team had no place to track orders, statuses, or approval history.",
        fix: "A custom CMS for Pro Print employees.",
        result: "The shop could manage the Applied Materials pipeline without a developer.",
      },
      {
        title: "Order history",
        problem: "Order history lived in email threads, not a system of record.",
        fix: "Database-backed order management with full history and status tracking.",
        result: "Any order could be looked up instead of hunted down.",
      },
    ],
    outcome:
      "Reduced manual workload for the print team and sped up ordering for Applied Materials employees — self-service, approval-gated flow replacing email back-and-forth. Internal corporate scale; don't remember exact order volume.",
    links: {},
  },
  {
    slug: "numpy-dojo",
    title: "NumPy Dojo",
    badge: "personal",
    category: "personal-freelance",
    dates: "2024 – Present",
    tagline: "An interactive, browser-based NumPy learning platform — no Python install required.",
    techStack: ["Next.js 16", "React 19", "TypeScript", "Custom JS NumPy Engine", "PostHog", "Vitest"],
    overview:
      "NumPy Dojo is a browser-based NumPy learning platform I spec'd and shipped with AI-assisted implementation. Most tutorials require a local Python environment; this runs a custom in-browser engine so anyone can open the site and practice immediately. I directed the build — lesson scope, UX, and architecture — rather than hand-writing every line of the engine myself.",
    problem:
      "Learning NumPy typically means setting up Python, installing packages, and configuring a local environment before writing a single line of code. That setup friction is a real barrier — especially for people who are new to Python or just want to explore. Existing browser-based options (like Google Colab) are overkill for focused NumPy practice.",
    whatIBuilt: [
      {
        title: "In-browser NumPy engine",
        problem: "Learning NumPy required installing Python and packages first.",
        fix: "AI-assisted build of a client-side engine targeting a curated `np.*` subset for lessons — intended to reject unimplemented ops clearly. I directed the architecture; I haven't audited every op boundary myself.",
        result: "Anyone could run NumPy-style syntax in the browser without a local install.",
      },
      {
        title: "Progressive lessons",
        problem: "Tutorials jumped around without a path from arrays to linear algebra.",
        fix: "22 progressive lessons with a built-in editor and automated output validation.",
        result: "Learners could practice and get checked without leaving the page.",
      },
      {
        title: "Real-world scenarios",
        problem: "Lessons showed syntax but not when or why to use NumPy.",
        fix: "12 scenarios across data analysis, finance, image processing, and engineering.",
        result: "Practice was tied to actual use, not just API trivia.",
      },
      {
        title: "Quiz system",
        problem: "There was no way to test retention beyond running lesson code.",
        fix: "Configurable quizzes (10–25 questions), mixed formats, retries, and history.",
        result: "Learners could measure themselves and see past attempts.",
      },
      {
        title: "Progress tracking",
        problem: "Refreshing the browser meant losing code and any sense of completion.",
        fix: "Completion meter, `localStorage` persistence, shortcuts, and adjustable editor font.",
        result: "Progress and code survived sessions without an account.",
      },
      {
        title: "PostHog analytics",
        problem: "No product or error signal from real learner usage.",
        fix: "PostHog on client and server for tracking and error monitoring.",
        result: "Usage and failures were visible after launch.",
      },
      {
        title: "CI/CD",
        problem: "Deploys and checks needed to be automatic for a solo project.",
        fix: "GitHub Actions CI/CD deployed to Vercel with zero config.",
        result: "Main stayed shippable without a manual release ritual.",
      },
    ],
    outcome:
      "Live and open-sourced for my AI bootcamp learning and other learners. No public usage metric claimed. Custom in-browser engine vs heavier options like Pyodide was the intended tradeoff (faster load, lesson-scoped control) — I directed that decision but didn't implement the engine solo.",
    links: {
      live: "https://numpydojo.com",
      github: "https://github.com/zeckdude/numpy-dojo",
    },
    featured: true,
  },
  {
    slug: "home-search",
    title: "HomeSearch",
    badge: "personal",
    category: "personal-freelance",
    dates: "Dates to be confirmed",
    tagline: "A conceptual React MLS search demo — filters, Leaflet map, and listing detail; not a production MLS product.",
    techStack: ["React", "Redux", "Leaflet", "UI Kit", "RETS API"],
    overview:
      "HomeSearch (MLS Demo React) is an honest UI exercise — a cleaner real-estate browsing experience on MLS-shaped data. Filters, a Leaflet map, listing grid, and property detail views. RETS integration exists in the codebase when you configure an API key locally; the public GitHub Pages demo is conceptual and not connected to a live MLS feed.",
    problem:
      "Real estate search UIs are notoriously cluttered and hard to navigate. This was an exercise in building a simpler, more focused browsing experience — and working with real-world listing data structures.",
    myRole: {
      title: "Front-End Developer",
      context: "Personal demo project; conceptual, not a shipped product.",
      scope: "Full React UI — filters, map, listings, detail views.",
    },
    whatIBuilt: [
      {
        title: "Filter and listing grid",
        problem: "Typical MLS UIs bury filters in clutter.",
        fix: "Filter panel driving a responsive listing grid.",
        result: "A focused browse path from search criteria to properties.",
      },
      {
        title: "Leaflet map",
        problem: "Listings without geographic context are hard to scan.",
        fix: "Leaflet map integrated with listing data.",
        result: "Properties visible on a map as well as in the grid.",
      },
      {
        title: "Property detail view",
        problem: "A demo needs a place to drill into one listing.",
        fix: "Detail view for individual property records.",
        result: "Grid → detail flow completes the browse loop.",
      },
    ],
    outcome:
      "Live conceptual demo on GitHub Pages — honest MLS UI exercise, not a production app. No usage metric claimed.",
    links: {
      live: "https://zeckdude.github.io/mls-demo-react/",
      github: "https://github.com/zeckdude/mls-demo-react",
    },
  },
  {
    slug: "exact-recall",
    title: "Exact Recall",
    badge: "personal",
    category: "personal-freelance",
    dates: "2024 – Present",
    tagline: "Capture conversations you don't want to forget — structured event logging with search, still in active development.",
    techStack: [
      "Next.js",
      "PostgreSQL",
      "Drizzle ORM",
      "pgvector",
      "Anthropic Claude",
      "OpenAI Embeddings",
      "Clerk",
      "Cloudflare R2",
      "Twilio",
    ],
    overview:
      "Exact Recall is a personal tool for conversations and moments I don't want to forget. I chat with Claude, which asks follow-ups one at a time, then stores a structured summary I can search later. Still in active development — core logging and three search modes work; retrieval quality isn't measured yet.",
    problem:
      "Important conversations and moments fade — I forget details, misremember what was said, and generic note apps need too much structure in the moment to be useful.",
    whatIBuilt: [
      {
        title: "Conversational logging",
        problem: "Capturing a memory in forms was too much friction in the moment.",
        fix: "Claude interviews one question at a time, then finalizes summary, fields, tags, people, location, dates, and a completeness score — one-shot summaries missed who/when/where too often.",
        result: "Events land as structured records without a blank form.",
      },
      {
        title: "Follow-up reminders",
        problem: "Incomplete events stayed incomplete and memories faded.",
        fix: "SMS via Twilio and web-push reminders when completeness is below 75%.",
        result: "Thin records got a prompt to fill in before they went stale.",
      },
      {
        title: "Three search modes",
        problem: "Keyword search fails when you remember the gist, not the words.",
        fix: "Live SQL keyword, pgvector semantic search, and Claude answers with citations.",
        result: "You can find an event by exact words, meaning, or a question.",
      },
      {
        title: "Event dashboard",
        problem: "Logged events had no place to scan, filter, or reopen.",
        fix: "`/events` with filters, a needs-attention strip, and a transcript detail view.",
        result: "Incomplete and complete events are visible in one list.",
      },
      {
        title: "File attachments",
        problem: "Memories often include photos and documents, not just text.",
        fix: "Images, HEIC/HEIF, PDFs, and docs stored in Cloudflare R2 and linked to events.",
        result: "Evidence sits with the event instead of in a separate folder.",
      },
      {
        title: "Google OAuth",
        problem: "Preferences and events needed to follow a signed-in user.",
        fix: "Clerk Google OAuth with preferences synced to Postgres via webhooks.",
        result: "Account state survives across sessions without a custom auth stack.",
      },
    ],
    outcome:
      "In active personal use; still in progress. Interview-then-finalize and three search modes (keyword, semantic, AI-with-citations) are built — search quality across modes is not instrumented yet; that's the main open gap.",
    links: {
      live: "https://exactrecall.com",
      github: "https://github.com/zeckdude/recall",
    },
  },
  {
    slug: "tag-my-web",
    title: "Tag My Web",
    badge: "personal",
    category: "personal-freelance",
    dates: "2025 – Present",
    tagline: "A YouTube subscription tagging and organization tool for power users managing large channel libraries.",
    techStack: ["Next.js", "MUI", "Turso", "TypeScript", "Resend"],
    overview:
      "Tag My Web connects to your YouTube account, pulls in every channel you're subscribed to, and lets you tag and filter them however makes sense to you. It's built for people who follow a large number of channels and need a better way to categorize and find content than YouTube's native subscription list allows.",
    problem:
      "YouTube's native tools for organizing subscriptions are minimal — no tagging, no custom categories, no filtering by topic. Power users following hundreds of channels have no good way to organize or navigate their subscriptions beyond one long alphabetical list.",
    whatIBuilt: [
      {
        title: "YouTube subscription sync",
        problem: "Subscriptions lived only inside YouTube, with no way to work with the full list.",
        fix: "OAuth to YouTube Data API v3 with pagination, quota-aware sync, and token refresh.",
        result: "The user's full channel list was available to tag and filter without blowing API limits.",
      },
      {
        title: "Channel tagging",
        problem: "YouTube offers no tags, categories, or topic filters on subscriptions.",
        fix: "Multi-tag AND/OR filtering on channels.",
        result: "Hundreds of channels could be sliced by topic instead of one alphabetical list.",
      },
      {
        title: "One-click channel access",
        problem: "Organizing channels is useless if getting back to YouTube takes extra steps.",
        fix: "One-click from any account card to that channel on YouTube.",
        result: "Organization didn't add friction to actually watching.",
      },
      {
        title: "Turso and Resend",
        problem: "The app needed a data layer and transactional email without a heavy backend.",
        fix: "Turso (SQLite at the edge) plus Resend for email.",
        result: "Tags persist at the edge and email has a dedicated path.",
      },
    ],
    outcome:
      "Live at tagmyweb.com — I use it occasionally for my own subscriptions. Built for power users who need tags and filters YouTube doesn't offer. No other users or usage metric claimed.",
    links: {
      live: "https://tagmyweb.com",
      github: "https://github.com/zeckdude/youtube-account-tagger",
    },
  },
  {
    slug: "huntcalm",
    title: "HuntCalm",
    badge: "personal",
    category: "personal-freelance",
    dates: "2025 – Present",
    tagline: "Product direction for a LinkedIn job-search organizer — problem, solution design, and AI-directed build; still in progress.",
    techStack: [
      "Chrome Extension (MV3)",
      "React",
      "Vite",
      "TypeScript",
      "Express",
      "Drizzle ORM",
      "PostgreSQL",
      "Clerk",
      "BullMQ",
    ],
    overview:
      "Job searching means juggling dozens of recruiter conversations — different stages, companies, and follow-up timelines. I identified the problem during my own active job search, designed the solution (sidebar in LinkedIn, pin/tag/search/reminders, cross-device sync), and directed an AI-assisted build of the Chrome extension and API. I did not hand-write the implementation myself — this project showcases product thinking, problem framing, and AI-directed delivery as much as traditional FE craft.",
    problem:
      "LinkedIn's native messaging interface isn't built for job seekers — it's built for recruiters. There's no way to see all your active conversations at a glance, tag or annotate them, track where each one stands, or get reminded to follow up. Important conversations get buried and opportunities slip through.",
    myRole: {
      title: "Product owner & AI-directed builder",
      context: "Personal side project during job search; implementation via AI-assisted development.",
      scope:
        "Problem discovery, solution design, architecture direction, and iteration on the extension + API — not solo hand-coded implementation.",
    },
    whatIBuilt: [
      {
        title: "Problem → solution design",
        problem: "Recruiter threads on LinkedIn have no job-seeker workflow — pins, tags, or follow-ups.",
        fix: "Defined the product: MV3 sidebar in LinkedIn, conversation triage, reminders, Clerk sync across devices.",
        result: "A clear spec an AI-assisted build could execute against.",
      },
      {
        title: "AI-directed implementation",
        problem: "Shipping a full extension + API solo by hand would have been slow during an active job search.",
        fix: "Directed AI to build the Chrome MV3 React sidebar, Express/Drizzle API, and shared TypeScript types.",
        result: "Working extension and backend without me claiming every line of code as hand-written.",
      },
      {
        title: "Pin, search, and tags",
        problem: "Threads get buried with no way to mark status or find them later.",
        fix: "Pin, search, and tags (Promising, Follow Up, Waiting, Not a Fit, Offer/Interview) with AND/OR filters.",
        result: "Conversations can be triaged instead of scrolled past.",
      },
      {
        title: "Follow-up reminders",
        problem: "Follow-ups slip because LinkedIn doesn't remind you.",
        fix: "Recurring reminders (3 days, weekly, biweekly, monthly, or custom) via Chrome notifications that link back to the thread.",
        result: "Quiet conversations surface before they go cold.",
      },
      {
        title: "Cross-device sync",
        problem: "Pins, tags, notes, and reminders were stuck on one browser.",
        fix: "Clerk auth so that data syncs across devices.",
        result: "The same conversation state follows you to another machine.",
      },
    ],
    outcome:
      "Still in progress. Core sidebar, API, pin/tag/search, and notifications are working; in-context thread tagging and email reminders remain ahead of a public launch. Honest ownership: I found the problem and directed the build — not traditional solo FE implementation.",
    links: { github: "https://github.com/zeckdude/huntcalm" },
    featured: true,
  },
  {
    slug: "custom-analytics-platform",
    title: "Custom Analytics Platform",
    company: "My Hotel Wedding",
    badge: "freelance",
    category: "personal-freelance",
    dates: "Nov 2014 – Jan 2017",
    tagline:
      "A custom-built tracking and analytics platform that turned raw user activity into reports a wedding-industry client could actually act on.",
    techStack: ["JavaScript", "jQuery", "PHP", "Laravel", "MySQL", "AJAX"],
    overview:
      "My Hotel Wedding, a referral platform connecting couples with wedding-friendly hotels, needed a way to track how users actually moved through their site and no off-the-shelf analytics tool fit their business model closely enough. I built a fully custom analytics platform from the ground up: a PHP and JavaScript data-collection layer paired with mobile-responsive admin dashboards for reporting.",
    myRole: {
      title: "Front & Back End Developer",
      context: "Freelance engagement, working directly with the My Hotel Wedding team.",
      scope:
        "Owned the project end to end — event tracking, data pipeline, database schema, and every admin-facing report.",
    },
    problem:
      "My Hotel Wedding needed to track unique user actions — page loads, button clicks, and other custom events across two distinct user types (hotel reps and brides/grooms) — then surface that data in reports their non-technical team could use to gauge how well the site was performing. Generic analytics tools couldn't model their specific two-sided marketplace or the custom actions they cared about.",
    whatIBuilt: [
      {
        title: "Event-tracking layer",
        problem: "Generic analytics couldn't model this two-sided marketplace or its custom actions.",
        fix: "PHP/JS tracking of page loads, clicks, and custom events into MySQL over AJAX. Small freelance client — not big-data scale; exact volume not remembered.",
        result: "Hotel-rep and couple activity landed in a database the client owned.",
      },
      {
        title: "Users dashboard",
        problem: "The team couldn't see activity trends split by user type over a chosen range.",
        fix: "Users dashboard with presets and custom date ranges, charted by user type.",
        result: "Non-technical staff could read who was active and when.",
      },
      {
        title: "Hotels module",
        problem: "Hotel inventory, reps, status, and views were not visible as a working list.",
        fix: "Most Hotels by State chart plus a sortable, paginated hotel table.",
        result: "The team could scan the marketplace geographically and by property.",
      },
      {
        title: "Hotel drill-downs",
        problem: "Aggregate hotel stats hid who viewed a property and which RFPs came in.",
        fix: "Detail pages for RFPs, page views, and every bride/groom who viewed that hotel.",
        result: "Each hotel had an audit trail, not just a count.",
      },
      {
        title: "Finance module",
        problem: "Client checks were tracked outside the same system as usage.",
        fix: "Finance module for payment status, check numbers, and paid/logged dates.",
        result: "Billing status sat next to the activity that justified it.",
      },
      {
        title: "Mobile-responsive admin",
        problem: "Reports were useless if they only worked on a desktop in the office.",
        fix: "Mobile-responsive Laravel MVC admin views.",
        result: "The client could check reports from any device.",
      },
      {
        title: "Laravel analytics admin",
        problem: "The client needed custom dashboards; I wanted to build that layer in Laravel.",
        fix: "Built analytics and admin reporting in Laravel — honest reason: I liked working with Laravel for that part of the site, not a forced incremental migration story.",
        result: "Custom reports the WordPress public site couldn't have produced off the shelf.",
      },
    ],
    outcome:
      "Gave a non-technical client clear visibility into how their two-sided marketplace was being used — replaced guesswork with real data. No proven behavior change from a specific report; the win was they could finally see the numbers.",
    links: {},
    images: [
      "/projects/custom-analytics-platform/1-users-chart.png",
      "/projects/custom-analytics-platform/2-date-range-picker.png",
      "/projects/custom-analytics-platform/3-hotels-by-state.png",
      "/projects/custom-analytics-platform/4-hotel-details.png",
      "/projects/custom-analytics-platform/5-finance-checks.png",
    ],
  },
  {
    slug: "print-custom-calendar",
    title: "Print Custom Calendar",
    badge: "personal",
    category: "personal-freelance",
    dates: "Jan 2024 – Mar 2024",
    tagline: "A free, browser-based tool for generating and printing fully customized monthly calendars.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Dexie (IndexedDB)", "React Hook Form"],
    overview:
      "Print Custom Calendar is a no-signup tool that lets anyone build a printable monthly calendar with custom layouts and formatting, directly in the browser. No account required, no watermarks, no upsells — configure it and print it.",
    problem:
      "Most printable calendar tools either require an account, push you toward a paid tier for basic features, or produce calendars that don't match what you actually need. There's a gap for a genuinely free, friction-free tool that just works.",
    whatIBuilt: [
      {
        title: "Print calendar builder",
        problem: "Printable calendar tools mixed editing with a layout that didn't match paper.",
        fix: "A month-by-month builder with a dedicated print-layout view and `@media print` styling — separate editor from print-ready output.",
        result: "What you print is a separate, print-ready view, not a screenshot of the editor.",
      },
      {
        title: "Local persistence",
        problem: "Tools demanded an account — or lost work — just to keep a calendar.",
        fix: "Zustand for config and Dexie (IndexedDB) so calendars persist locally with no account.",
        result: "Custom calendars survive sessions without signup or a server.",
      },
      {
        title: "Form-driven customization",
        problem: "Layout and formatting needed to be editable without a cluttered custom UI.",
        fix: "React Hook Form and Headless UI for the customization controls.",
        result: "Options are form-driven and accessible instead of one-off widgets.",
      },
    ],
    outcome:
      "Live and free at printcustomcalendar.com — built because most online calendar tools wanted a paid tier for basic printing. No usage metric claimed.",
    links: {
      live: "https://printcustomcalendar.com",
      github: "https://github.com/zeckdude/printable-calendar",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** First gallery video — used for grid thumbnails when there is no screenshot. */
export function getProjectPreviewVideo(project: Project): string | undefined {
  if (project.videoSrcs?.length) return project.videoSrcs[0];
  return project.videoSrc;
}

export function getVideoPoster(
  project: Project,
  videoSrc: string,
): string | undefined {
  return project.videoPosters?.[videoSrc];
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
