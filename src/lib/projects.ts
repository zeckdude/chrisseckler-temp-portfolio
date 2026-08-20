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
  whatIBuilt?: string[];
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
      "Sole front-end owner of the Aerospike Cloud Console — the enterprise product that turns prospects into paying customers. Starting with the revenue-critical provisioning wizard, then expanding across the platform.",
    techStack: ["React", "TypeScript", "React Context", "Material UI", "Vitest", "Playwright", "GraphQL"],
    overview:
      "Aerospike Cloud is an enterprise platform for deploying and running high-performance distributed databases in the cloud. I joined as the sole front-end engineer on the Cloud team — no other FE devs, no handoffs. The most critical piece of the product was the provisioning wizard: the multi-step flow where a prospect configures and creates their first database. That's the moment a trial becomes revenue. When I arrived, it was fragmented, stateless on refresh, and running alongside a separate legacy admin console (ACMS) that hadn't been unified into the main platform. I owned fixing it — architecture, delivery, testing, and the engineering culture work around it.",
    myRole: {
      title: "Senior Front-End Engineer, Cloud Team",
      context:
        "Sole FE owner on a cross-functional team with backend engineers and product. No other frontend engineers on this flow.",
      scope:
        "Full ownership from architecture to delivery — components, state management, testing, legacy integration, mentorship, and tooling.",
    },
    problem:
      "Enterprise customers dropping off mid-setup meant lost revenue. The provisioning flow had no clear progress tracking, state wasn't persisted across steps (a refresh meant starting over), and the business logic — availability zones, replication factors, cluster sizing — was deeply interdependent in ways no existing library handled cleanly. On top of that, a separate legacy console (ACMS) existed alongside the main platform, creating a disjointed experience during a live customer migration window where mistakes were costly.",
    whatIBuilt: [
      "`StepIndicator` — solved user drop-off from a confusing multi-step setup: a flow-aware progress tracker where business logic (not just position) controlled which steps were navigable, with conditional rendering for completed, active, error, and upcoming states",
      "Smart defaults and presets — solved misconfiguration by less technical users: surfaced sensible defaults based on use case, company type, or earlier selections in the flow",
      "Inline validation and error messaging — solved undetected errors at submission time: step-level validation prevented users from progressing with bad configurations",
      "Review-before-launch summary screen — solved costly mistakes on launch: full configuration visible and editable before cluster creation was triggered",
      "Conditional and branching steps — solved one-size-fits-all form friction: flow adapted based on prior answers, reducing irrelevant options for each cluster path",
      "Conditional state reset — solved silent breakage from stale upstream data: changing availability zone count automatically invalidated and recalculated downstream node sizing constraints",
      "Async-dependent field handling — solved mid-flow blocking on API data (regions, instance types): fields loaded without breaking or blocking user progress",
      "Back navigation with data preservation — solved re-entry friction: all entered data persisted when navigating back a step",
      "`DatabaseSelectionTable` with persistent cross-step state — solved progress loss on refresh: React Context state hydrated from `localStorage` so users never lost their work on page reload or return visit",
      "Contextual inline docs panel — solved users leaving the flow to get help: fetched Aerospike documentation and rendered it in a collapsible sidebar formatted to match the console design system, context-aware to the current page",
      "Dual-mode JSON/YAML config editor with conflict detection — solved inaccessible advanced settings: gave developers an escape hatch to configure any Aerospike option not yet exposed in the UI, with conflict detection that surfaced clashes with values already set via the wizard steps",
      "Access Manager — full organizational settings surface: member roles and access control, API key management, secrets, and audit logs",
      "ACMS legacy console integration — reconciled two different state models into a single coherent experience under a tight deadline, without disrupting the live customer migration in flight",
      "Vitest unit tests across component logic and Playwright end-to-end tests covering the full provisioning flow",
      "Mentored two junior front-end engineers on component architecture and testing patterns",
      "Introduced AI-assisted development workflows (LLM-powered IDE tooling) to the team — first person to bring that practice to Aerospike engineering",
    ],
    outcome:
      "The unified flow drove successful enterprise migrations away from the legacy ACMS console. Persistent state across steps measurably reduced drop-off during provisioning. The component patterns I introduced became the architectural foundation for subsequent Cloud UI work — they outlasted my tenure.",
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
    slug: "adim-placeholder",
    title: "Design System & Platform Engineering",
    company: "Adim",
    badge: "professional",
    category: "professional",
    dates: "May 2023 – Mar 2024",
    tagline: "Led design system development and platform engineering at a TV/movie industry creative collaboration startup.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Storybook"],
    overview:
      "Adim is a platform that fosters creative collaboration in the TV and movie industry. I spearheaded the development of a design system that refined the developer experience and met precise design needs, while collaborating closely with stakeholders in a fast-paced startup environment.",
    myRole: {
      title: "Senior Front-End Engineer",
      context: "Cross-functional collaboration with product and design in a startup environment.",
      scope: "Design system ownership, Storybook, Tailwind implementation, and marketing site redesign.",
    },
    whatIBuilt: [
      "Scalable design system using Next.js and TypeScript, establishing reusable component libraries and UI standards that improved development velocity and product consistency",
      "Enhanced Storybook setup to set rigorous UI standards, improving the frontend team's ability to ship polished interfaces",
      "Streamlined and refined Tailwind CSS implementation for a cohesive, efficient styling framework across the platform",
      "Redesigned the marketing website, enhancing brand presence and user engagement through a modern, intuitive interface",
      "Proactively tackled documentation challenges through direct stakeholder communication, ensuring smooth project flow",
    ],
    links: { company: "https://adim.io" },
  },
  {
    slug: "toucan-placeholder",
    title: "Language Learning Chrome Extension",
    company: "Toucan",
    badge: "professional",
    category: "professional",
    dates: "Dec 2019 – Mar 2023",
    tagline: "A language-learning Chrome extension that teaches vocabulary as you browse the web.",
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "GraphQL", "MongoDB", "Chrome Extension APIs", "Material UI", "Amplitude", "Jest"],
    overview:
      "Toucan is a browser extension that translates select words on the pages you're already reading into a language you're learning, turning ordinary browsing into passive vocabulary practice. I joined as employee #1 and founding engineer, building the product from the ground up alongside the founders. Promoted from Senior Software Engineer I to Senior Software Engineer II over the course of 3+ years.",
    myRole: {
      title: "Founding Engineer, Employee #1 (Senior Software Engineer I → II)",
      context: "Joined pre-product as the first engineering hire; team grew to 30 employees over 3+ years.",
      scope: "A full case-study write-up of specific ownership areas is in progress.",
    },
    whatIBuilt: [
      "Core browser extension features: sidebar, contextless learning moments, games, and mobile Safari launch — contributing to 1M+ users",
      "Homepage, dashboard, subscription, login/signup flows on a Next.js website that scaled to 13M+ lifetime page views",
      "Component library and design system for UI uniformity and developer productivity",
      "Massively improved site performance through refactoring and modern best practices — Core Web Vitals score from 35 → 98, enabling SEO-driven growth",
      "A/B testing infrastructure to improve user acquisition and retention, providing data to the product team that drove subscription growth",
      "RFCs to identify technical bottlenecks, increasing team knowledge and delivering better business outcomes",
      "Mentored junior engineers and conducted employment interviews",
    ],
    outcome:
      "Toucan grew from zero to 1M+ users, 13M lifetime page views, and 30 employees during my time there. Core Web Vitals improved from 35 → 98.",
    links: { company: "https://jointoucan.com" },
  },
  {
    slug: "dave-placeholder",
    title: "Front-End Engineering at Scale",
    company: "Dave.com",
    badge: "professional",
    category: "professional",
    dates: "Mar 2018 – Oct 2019",
    tagline: "Building banking and customer support interfaces during a period of hypergrowth — from 200K to 4M+ users.",
    techStack: ["TypeScript", "React", "Redux", "React Native", "Node.js", "GraphQL", "MySQL", "Firebase", "Docker", "Google Cloud Platform"],
    overview:
      "Dave.com is a banking app built to help members avoid overdraft fees and manage cash flow. I joined as a Full Stack Engineer and was promoted to Senior Front-End Engineer, playing an integral role in scaling the startup to a $1B+ unicorn during a period of rapid growth.",
    myRole: {
      title: "Full Stack Engineer → Senior Front-End Engineer",
      context: "Joined during early hypergrowth; promoted within 7 months.",
      scope: "Customer support dashboard, mobile app components, public website, and test infrastructure.",
    },
    whatIBuilt: [
      "Suite of customer support tools enabling quick access to and analysis of bank data",
      "System to pause and unpause user accounts, reducing churn rates and improving retention",
      "Automated scripts for customer ticket handling, reducing response times",
      "Entire Dave.com public-facing informational website, built independently while consulting with designers and product",
      "Modular React Native components and screens for the Dave mobile app",
      "Unit and integration tests to reduce errors; conducted 50+ employment interviews",
    ],
    outcome:
      "Dave scaled from 200K to 4M+ users and reached unicorn status ($1B+ valuation) during this period.",
    links: { company: "https://dave.com" },
  },
  {
    slug: "chrome-river-placeholder",
    title: "Expense & Invoice Management Software",
    company: "Chrome River",
    badge: "professional",
    category: "professional",
    dates: "Dec 2015 – Mar 2018",
    tagline: "Front-end engineering on enterprise expense and invoice management software — large-scale Backbone.js app in a fintech environment.",
    techStack: ["JavaScript", "Backbone.js", "AJAX", "REST APIs", "HTML", "CSS"],
    overview:
      "Chrome River (now Emburse Enterprise) builds expense and invoice management software used by large, global organizations to automate travel and expense reporting. I implemented modular front-end views using functional JavaScript, collaborating closely with product managers and back-end engineers in an agile environment.",
    myRole: {
      title: "Software Engineer, Front End",
      context: "Agile team; close collaboration with PMs and back-end engineers.",
      scope: "Front-end views, REST API integration, bug resolution, and pixel-accurate Figma implementation.",
    },
    whatIBuilt: [
      "Modular front-end views in a large-scale Backbone.js application, using AJAX to interface with REST API endpoints",
      "Pixel-accurate implementation of Figma/design specs, ensuring consistent user experience",
      "Bug resolution and story delivery within an agile workflow",
    ],
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
        "Led all front-end development — component architecture, JavaScript interactivity, CMS integration, and mobile-responsive layout across every section of the site.",
    },
    problem:
      "Fox needed a single portal that could serve audiences across multiple countries while letting regional teams control their own content — different titles, different release dates, different retailer partnerships — without touching code. At the same time, the site had to handle a wide range of content types: hero carousels promoting current theatrical releases, structured catalog grids for TV seasons, multi-tab movie detail pages with purchase flows, and promotional campaign tiles, all on a CMS-editable foundation.",
    whatIBuilt: [
      "A full-bleed hero carousel on the homepage promoting current theatrical releases, with dot navigation, directional controls, and smooth transitions — driving traffic to individual title pages",
      "Multi-tab movie and TV detail pages covering Movie Info (synopsis, cast and crew), Digital HD (retailer purchase grid), Blu-ray, and DVD — each with its own sub-navigation and content zones",
      "A Digital HD purchasing flow displaying region-appropriate retailers (iTunes, Google Play, Amazon, Xbox 360, Sky Store, and others) per title, driven by CMS configuration",
      "A photo slider on movie detail pages for cast and production imagery",
      "Promotional campaign tiles configurable by Fox's regional teams — used for franchise campaigns like the James Bond Collection and Bridge of Spies",
      "A large-format catalog grid for TV series available to own, handling a wide range of titles with consistent card layouts and metadata",
      "A fully mobile-responsive layout across every page, built on the Yii PHP MVC framework with a CMS layer that let Fox's non-technical regional teams update content, swap imagery, and configure the retailer grid per country without engineering involvement",
    ],
    outcome:
      "The portal launched internationally and served a large audience across multiple Fox regions. The CMS architecture gave Fox's local teams genuine autonomy over their regional content — a key deliverable that separated this from a typical static build.",
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
    slug: "trailer-park-placeholder",
    title: "Front-End Engineering for Entertainment Marketing",
    company: "Trailer Park",
    badge: "professional",
    category: "professional",
    dates: "Dates to be confirmed",
    tagline: "Front-end engineering for campaigns and products at an entertainment marketing agency — clients included Apple, Warner Bros., Fox Entertainment Group, and major streaming platforms.",
    techStack: [],
    overview:
      "Trailer Park Group is an entertainment marketing and content production agency behind trailers and campaigns for major film, TV, and streaming releases. A full write-up of this role is in progress.",
    myRole: {
      title: "Frontend Engineer",
      context: "Details on team and scope coming soon.",
      scope: "Details on scope of ownership coming soon.",
    },
    links: { company: "https://trailerparkgroup.com" },
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
    whatIBuilt: [
      "Embedded YouTube trailers with responsive video layout",
      "Character profiles and plot synopsis sections",
      "Movie poster download functionality",
      "Social sharing features for Facebook, Twitter, and other platforms",
      "Fully mobile-responsive layout across all devices",
    ],
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
    whatIBuilt: [
      "Full front-end redesign and rebuild of the parents' portal",
      "Drupal customization for the CMS layer managing portal content",
      "Zend PHP framework integration for the application tier",
      "SOAP API integration connecting the portal to the Warner Bros. Cartoon Universe game backend",
    ],
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
    whatIBuilt: [
      "An order form for employees to customize their business card details with live validation",
      "PDF preview functionality so employees could review the card layout before submitting",
      "A manager approval workflow with email notifications — orders routed through approval before going to print",
      "A custom CMS for Pro Print & Services employees to track all orders, statuses, and approval history",
      "Database-backed order management with full order history and status tracking",
    ],
    outcome:
      "Reduced the manual workload for the print team and sped up the ordering cycle for Applied Materials' employees, replacing a slow back-and-forth email process with a self-service, approval-gated system.",
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
      "NumPy Dojo is a self-contained learning platform for NumPy — the foundational Python library for numerical computing. Most NumPy tutorials require a local Python environment to run code, which creates friction for beginners. NumPy Dojo removes that barrier entirely: it runs a custom JavaScript engine that mirrors real NumPy syntax directly in the browser. Anyone can open the site and start writing and running NumPy code immediately.",
    problem:
      "Learning NumPy typically means setting up Python, installing packages, and configuring a local environment before writing a single line of code. That setup friction is a real barrier — especially for people who are new to Python or just want to explore. Existing browser-based options (like Google Colab) are overkill for focused NumPy practice.",
    whatIBuilt: [
      "A custom Python-to-JavaScript transpiler and NumPy engine (NDArray + np.* API) — no external dependencies, runs entirely client-side",
      "22 progressive lessons covering array creation through linear algebra, each with a built-in code editor and automated output validation",
      "12 real-world scenarios (data analysis, finance, image processing, engineering) teaching when and why to use NumPy",
      "A quiz system with configurable question count (10–25), mixed formats (multiple choice, true/false, code output), retry logic for wrong answers, and full quiz history",
      "Progress tracking with a completion meter, code persistence across sessions via localStorage, keyboard shortcuts, and adjustable editor font size",
      "PostHog analytics integration (client and server-side) for product tracking and error monitoring",
      "CI/CD via GitHub Actions, deployed to Vercel with zero config",
    ],
    outcome:
      "Live and publicly accessible. Built to support my own AI engineering bootcamp work and open-sourced for other learners.",
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
    tagline: "A real estate search UI demo built in React, showcasing MLS data browsing and filtering.",
    techStack: ["React"],
    overview:
      "HomeSearch is a front-end demo project exploring how to build a clean, responsive real estate search experience on top of MLS data. It demonstrates filtering, listing display, and property detail views in a modern React architecture.",
    problem:
      "Real estate search UIs are notoriously cluttered and hard to navigate. This project was an exercise in building a simpler, more focused browsing experience — and a chance to work with real-world listing data structures.",
    links: { github: "https://github.com/zeckdude/mls-demo-react" },
  },
  {
    slug: "exact-recall",
    title: "Exact Recall",
    badge: "personal",
    category: "personal-freelance",
    dates: "2024 – Present",
    tagline: "An AI-powered event memory logger — capture moments through conversation, recall them with semantic search later.",
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
      "Exact Recall helps you capture, organize, and retrieve important life events through natural conversation instead of forms. You chat with an AI that asks the right follow-up questions, then it stores a structured, searchable summary you can revisit later. It's built around the idea that human memory is lossy — important details from meetings, interactions, and experiences fade quickly, and most note-taking tools are too general-purpose to fix that.",
    problem:
      "Important conversations, decisions, and moments get forgotten or misremembered. Existing note-taking tools require too much upfront structure and friction to use in the moment, and even when something does get written down, finding it again later by keyword alone often fails — you remember the gist of a memory, not the exact words you used to describe it.",
    whatIBuilt: [
      "A conversational logging flow where Claude (via the Anthropic API) interviews the user one question at a time, then runs a finalization pass that produces a summary, structured fields, tags, people, location, dates, and a completeness score",
      "Automatic follow-up reminders (SMS via Twilio and web push) on a smart cadence for any event that finalizes below a 75% completeness score",
      "Three distinct search modes: live keyword SQL search, semantic search using OpenAI embeddings ranked by pgvector cosine distance, and an AI search mode where Claude answers directly with citations back to source events",
      "An event dashboard (/events) with filtering and a \"needs attention\" strip, plus a detail view with the full transcript, structured fields, and file attachments",
      "File attachment support (images, HEIC/HEIF, PDFs, documents) stored in Cloudflare R2 and linked to event records",
      "Clerk-based Google OAuth, with user preferences synced to Postgres via webhooks",
    ],
    outcome:
      "Live and in active use for my own event logging. The three-mode search system (keyword, semantic, AI-with-citations) was the most technically interesting part to get right — each mode trades off speed, recall, and precision differently.",
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
    dates: "Dates to be confirmed",
    tagline: "A YouTube subscription tagging and organization tool for power users managing large channel libraries.",
    techStack: ["Next.js", "MUI", "Turso", "TypeScript", "Resend"],
    overview:
      "Tag My Web connects to your YouTube account, pulls in every channel you're subscribed to, and lets you tag and filter them however makes sense to you. It's built for people who follow a large number of channels and need a better way to categorize and find content than YouTube's native subscription list allows.",
    problem:
      "YouTube's native tools for organizing subscriptions are minimal — no tagging, no custom categories, no filtering by topic. Power users following hundreds of channels have no good way to organize or navigate their subscriptions beyond one long alphabetical list.",
    whatIBuilt: [
      "OAuth connection to the YouTube Data API v3 to sync a user's full subscription list, including profile images, names, and subscriber counts",
      "A tagging system for categorizing channels, with multi-tag AND/OR filtering",
      "One-click access from any account card straight to that channel on YouTube",
      "Turso (SQLite at the edge) as the data layer and Resend for transactional email",
    ],
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
    tagline: "A Chrome extension sidebar that organizes your LinkedIn recruiter conversations so nothing falls through the cracks.",
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
      "Job searching means juggling dozens of recruiter conversations at once — different stages, different companies, different follow-up timelines. HuntCalm injects a sidebar directly into LinkedIn (rendered in a shadow DOM so it never conflicts with LinkedIn's own styles) that gives job seekers a clear, organized view of every recruiter thread: what's pinned, what's tagged, what needs follow-up, and what's gone quiet. It was built out of personal frustration during my own job search after being laid off from Aerospike.",
    problem:
      "LinkedIn's native messaging interface isn't built for job seekers — it's built for recruiters. There's no way to see all your active conversations at a glance, tag or annotate them, track where each one stands, or get reminded to follow up. Important conversations get buried and opportunities slip through.",
    whatIBuilt: [
      "A Chrome MV3 extension with a React sidebar injected into LinkedIn, toggled by keyboard shortcut or a floating button",
      "Pin, search, and tag conversations, with a default tag set (Promising, Follow Up, Waiting, Not a Fit, Offer/Interview) and multi-tag AND/OR filtering",
      "Per-conversation notes and a stats bar (total tracked, pinned count, reminders due, tag breakdown)",
      "A recurring reminder system with flexible cadences (3 days, weekly, biweekly, monthly, or custom) that fires native Chrome notifications linking straight back to the thread",
      "A TypeScript monorepo split into an extension app (Vite + React), an Express/Drizzle/PostgreSQL API, and a shared types package",
      "Clerk authentication so conversations, tags, notes, and reminders sync across devices",
    ],
    outcome:
      "Core data model, REST API, and the extension sidebar (pin/tag/search/filter/notifications) are complete and working end to end. In-context LinkedIn thread tagging and scheduled email reminders are in active development ahead of a public launch.",
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
      "A PHP and JavaScript event-tracking layer that captured page loads, button clicks, and custom user actions, sending each one to a MySQL database over AJAX with rich contextual metadata",
      "A Users dashboard with a custom date-range picker (presets like Today, Last 7 Days, Last 30 Days, plus arbitrary custom ranges) charting activity trends split by user type",
      "A Hotels module with a 'Most Hotels by State' chart and a sortable, paginated table of every hotel, its rep, status, and page views",
      "Drill-down hotel detail pages showing RFPs received, page views, and every bride/groom who viewed that hotel",
      "A Finance module for logging and tracking client checks — payment status, check numbers, and paid/logged dates",
      "Mobile-responsive admin views built on an MVC architecture (Laravel) so the client could check reports from any device",
    ],
    outcome:
      "Gave a non-technical client clear visibility into how their two-sided marketplace was actually being used, replacing guesswork with real usage data across hotels, reps, and couples.",
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
      "A month-by-month calendar builder with a dedicated print-layout view separate from the editing UI",
      "Zustand for calendar configuration state and Dexie (IndexedDB) so custom calendars persist locally across sessions without an account",
      "Form-driven customization built with React Hook Form and Headless UI components",
    ],
    links: {
      live: "https://printcustomcalendar.com",
      github: "https://github.com/zeckdude/printable-calendar",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
