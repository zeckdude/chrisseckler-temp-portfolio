export const siteConfig = {
  name: "Chris Seckler",
  title: "Senior Frontend Engineer",
  email: "chrisseckler@gmail.com",
  linkedin: "https://linkedin.com/in/chrisseckler",
  github: "https://github.com/zeckdude",
};

export const home = {
  positioning:
    "I build products people actually use — from zero to launch and everything after.",
  currently:
    "Currently job searching, deep in the Newline AI Engineering Bootcamp, and shipping side projects in the open.",
};

export const about = {
  headline: "15 years of shipping. Still building.",
  bio: [
    "I'm a Senior Frontend Engineer with 15+ years of experience building products that scale — from a language learning Chrome extension with 1M+ users (Toucan, early engineer) to enterprise cloud consoles for distributed databases (Aerospike). I specialize in React, TypeScript, and Next.js, and I'm deep in the world of AI engineering: currently enrolled in the Newline AI Engineering Bootcamp, studying LLM architecture, RAG pipelines, embeddings, and multimodal systems.",
    "I build side projects the way most people watch TV. If something frustrates me, I build a fix for it.",
    "I'm an OIF Army Reserve veteran, based in Las Vegas, and open to senior IC, founding engineer, and AI-forward roles — remote or Las Vegas-based.",
  ],
  techStack: [
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind", "Material UI", "Framer Motion"] },
    { category: "State & Data", items: ["GraphQL", "Redux", "Zustand", "REST APIs"] },
    { category: "Testing", items: ["Vitest", "Playwright", "Jest"] },
    { category: "Infrastructure", items: ["Docker", "AWS", "Google Cloud", "Railway", "Vercel"] },
    { category: "AI/ML", items: ["LLMs", "RAG", "Embeddings", "Prompt Engineering"] },
    { category: "Other", items: ["Node.js", "MySQL", "Stripe", "SendGrid", "Clerk", "Cloudflare R2"] },
  ],
  timeline: [
    { org: "US Army Reserve", role: "Team Leader, Sergeant", detail: "OIF Veteran — deployed Mar 2003–Jul 2004" },
    { org: "Trailer Park", role: "Web Developer → Production Manager", detail: "Nov 2010–Oct 2014" },
    { org: "Chrome River", role: "Software Engineer, Front End", detail: "Dec 2015–Mar 2018" },
    { org: "Dave.com", role: "Full Stack → Senior Front-End Engineer", detail: "200K → 4M+ users; unicorn" },
    { org: "Toucan", role: "Senior Software Engineer I → II (early engineer)", detail: "Architected Next.js site; extension year 1" },
    { org: "Adim", role: "Senior Frontend Engineer", detail: "May 2023–Mar 2024" },
    { org: "Aerospike", role: "Senior Frontend Engineer, Cloud Team", detail: "Sep 2024–Jan 2026" },
    { org: "Now", role: "Building, learning AI, open to what's next" },
  ],
};

export const fullTime = {
  hero: {
    headline: "Senior frontend engineer. Ready for the right team.",
    subtext:
      "15+ years shipping products at every company stage — from founding-engineer zero-to-one to enterprise infrastructure. I own what I build, raise the bar around me, and stay unblocked.",
    badge: "Actively looking",
  },

  stats: [
    { value: "15+", label: "Years shipping production code", subtext: "At every stage: startup, scale-up, and enterprise." },
    { value: "1M+", label: "Users on a product I joined as an early engineer", subtext: "Architected the web platform; company grew to 30 engineers." },
    { value: "4M+", label: "Users reached at a pre-unicorn startup", subtext: "Real scale, real pressure, real stakes." },
    { value: "2", label: "Junior engineers mentored at my last role", subtext: "Architectural patterns I taught are still in the codebase." },
  ],

  brings: {
    capabilities: [
      {
        name: "Full ownership of frontend surfaces",
        body: "I don't just implement tickets — I architect, deliver, test, and maintain. At Aerospike I planned the provisioning wizard architecture and built many of its pages; other frontend engineers on the Cloud team shipped additional wizard and console work following those patterns.",
      },
      {
        name: "Founding-engineer judgment",
        body: "I've picked the stack before there was a stack. At Toucan I architected the Next.js site from scratch and took over a scrappy extension prototype in year one — early technical decisions that had to last through 1M users.",
      },
      {
        name: "AI-assisted development workflows",
        body: "I use LLM-powered IDE tooling daily for research, implementation, and review. Comfortable folding AI into how I ship — without treating it as a substitute for judgment on product and architecture.",
      },
      {
        name: "Design system & component architecture",
        body: "I build component foundations that outlast the sprint. The patterns I introduced at Aerospike became the architectural baseline for subsequent Cloud UI work after I left.",
      },
    ],
    workingStyle: [
      {
        name: "Async-first communicator",
        body: "I write clearly, document my decisions, and produce Loom walkthroughs instead of redundant meetings. I don't need to be in the room to move things forward.",
      },
      {
        name: "I raise the bar around me",
        body: "Junior engineers get better. The codebase gets cleaner. I mentored two engineers on architecture and testing at Aerospike — not because I was asked to, but because it was the right thing to do.",
      },
      {
        name: "I think in products, not tickets",
        body: "I ask why before I ask how. If the ticket doesn't make sense for the product, I say so. I've worked closely enough with product and design to know when engineering should push back.",
      },
    ],
  },

  proof: [
    {
      org: "Aerospike",
      role: "Senior Frontend Engineer, Cloud Team",
      headline: "Wizard architecture lead. Revenue-critical surface. Team shipped against those patterns.",
      body: "Cross-functional Cloud team with other frontend engineers, backend engineers, and product. I architected the provisioning wizard (where trials become paying customers) and built many of its pages; the team shipped the rest against those patterns — plus testing, legacy integration, and mentorship.",
    },
    {
      org: "Toucan",
      role: "Senior Software Engineer I → II (early engineer)",
      headline: "Early engineer. Architected the web platform.",
      body: "Joined at inception with a small engineering cohort. Took over the extension from a CTO prototype in year one and built the Next.js site from scratch. The company grew to 30 employees and 1M+ users.",
    },
    {
      org: "Dave.com",
      role: "First Senior Frontend Engineer",
      headline: "First Senior FE at a pre-unicorn fintech.",
      body: "Joined during hypergrowth as the company's first Senior Frontend Engineer. Shipped product features across a banking app that scaled from 200K to 4M+ users and hit unicorn status.",
    },
  ],

  fit: {
    good: [
      "Product companies that give senior engineers real ownership over a surface or domain — not just tickets",
      "Early-stage startups where a generalist mindset and founding-engineer judgment are an asset",
      "Teams building AI-adjacent products or exploring AI engineering seriously",
      "Async-friendly, remote-first engineering cultures where output matters more than presence",
    ],
    notFit: [
      "Environments where senior engineers are assigned tickets and never consulted on architecture",
      "Roles that require in-office presence outside of Las Vegas",
      "Frontend work scoped entirely to UI component assembly with no product context or ownership",
    ],
    openTo: [
      { label: "Senior IC / Staff Engineer", note: "Primary interest — want to own a real surface" },
      { label: "Founding / Early Engineer", note: "Done it before, happy to do it again" },
      { label: "AI-forward role", note: "Actively deepening AI engineering skills right now" },
      { label: "Contract / Staff-aug", note: "Available for the right short or long engagement" },
    ],
  },

  availability: {
    status: "Actively looking — available to start soon.",
    location: "Remote (preferred) or Las Vegas-based. US timezone.",
    comp: "Compensation discussed in the interview process.",
    note: "I move fast. If you're evaluating candidates, I'll keep pace with your process.",
  },

  cta: {
    headline: "Let's find out if we're a match.",
    subtext: "Reach out directly, or start with the resume. I respond to everything.",
    resumeUrl: "/resume.pdf",
  },
};

export const contact = {
  headline: "Let's talk.",
  body: "Whether you have a project in mind, a role to discuss, or just want to connect — reach out. I respond to everything.",
  hire: {
    headline: "Work with me",
    links: [
      { href: "/freelance", label: "Freelance", description: "Project-based engagements" },
      { href: "/full-time", label: "Full-time", description: "Senior IC and founding roles" },
    ],
  },
};

export type FooterLink = {
  href: string;
  label: string;
  description?: string;
  external?: boolean;
  event?: "resume downloaded";
};

export const footer = {
  sections: [
    {
      title: "Explore",
      links: [
        { href: "/projects", label: "Projects", description: "Case studies and shipped work" },
        { href: "/about", label: "About", description: "Background, stack, and timeline" },
        {
          href: "/recommendations",
          label: "Recommendations",
          description: "28 LinkedIn recommendations from colleagues",
        },
      ] satisfies FooterLink[],
    },
    {
      title: "Work with me",
      links: [
        { href: "/freelance", label: "Freelance", description: "Project-based engagements" },
        { href: "/full-time", label: "Full-time", description: "Senior IC and founding roles" },
        { href: "/contact", label: "Contact", description: "Start a conversation" },
        {
          href: "/resume.pdf",
          label: "Resume",
          description: "PDF download",
          external: true,
          event: "resume downloaded",
        },
      ] satisfies FooterLink[],
    },
  ] as const,
  social: [
    { href: siteConfig.email, label: "Email", kind: "email" as const, mailto: true },
    { href: siteConfig.linkedin, label: "LinkedIn", kind: "linkedin" as const },
    { href: siteConfig.github, label: "GitHub", kind: "github" as const },
  ],
};

export const freelance = {
  hero: {
    headline: "Your project deserves a senior engineer.",
    subtext:
      "I've shipped products used by millions — from day one at startups to enterprise infrastructure teams. Now I take on focused freelance work for clients who care about the outcome.",
    badge: "Available for new projects",
  },

  stats: [
    { value: "15+", label: "Years of professional experience", subtext: "No junior mistakes on your dime." },
    { value: "1M+", label: "Users on a product I joined as an early engineer", subtext: "I know how to build from zero and scale." },
    { value: "4M+", label: "Users reached at a unicorn startup", subtext: "I've worked at every company size." },
    { value: "< 24h", label: "Typical first response time", subtext: "You won't be left wondering." },
  ],

  services: {
    buildNew: [
      {
        name: "Custom Web Application",
        what: "A purpose-built product — a SaaS tool, client portal, internal dashboard, or anything that needs more than a website template.",
        why: "When off-the-shelf software doesn't fit your business exactly the way you need it to.",
      },
      {
        name: "Startup MVP",
        what: "Full product from zero. I handle the frontend completely and connect to backend APIs or third-party services to get you to launch.",
        why: "When you need to validate your idea quickly and can't afford to get it wrong.",
      },
      {
        name: "Marketing & Landing Pages",
        what: "Fast, high-quality pages built to convert — not a template, built to your brand.",
        why: "When your current site isn't doing the selling it should be.",
      },
      {
        name: "E-commerce",
        what: "Online stores that work — Shopify, WooCommerce, or a fully custom checkout flow.",
        why: "When you need a storefront that's fast, reliable, and actually drives revenue.",
      },
    ],
    fixImprove: [
      {
        name: "Performance Audit & Optimization",
        what: "If your site is slow, I find out exactly why and fix it.",
        why: "Faster sites rank better and convert more — this often pays for itself.",
      },
      {
        name: "Codebase Refactor & Migration",
        what: "If your existing site or app is hard to maintain or falling apart, I can rebuild it properly.",
        why: "Technical debt compounds — earlier is cheaper.",
      },
      {
        name: "Figma-to-Code",
        what: "You have designs from a designer and need them built precisely — I do that.",
        why: "When pixel-perfect implementation matters and you can't afford drift between design and production.",
      },
      {
        name: "Design System & Component Library",
        what: "Consistent, reusable UI components your team can build on.",
        why: "When your product team wastes time recreating the same UI patterns over and over.",
      },
      {
        name: "Code Review & Tech Lead Consulting",
        what: "A senior eye on your team's work, architecture decisions, or codebase.",
        why: "When you have developers but need someone who's seen this problem before.",
      },
      {
        name: "Ongoing Maintenance & Support",
        what: "A reliable developer in your corner month-to-month.",
        why: "When you need someone you can call, not a one-and-done engagement.",
      },
    ],
  },

  process: [
    {
      step: "01",
      title: "Discovery Call",
      body: "Free 30-min call. We talk through what you need, what success looks like, and whether we're a good fit. No pressure, no pitch.",
    },
    {
      step: "02",
      title: "Project Intake",
      body: "For projects beyond a simple page, I send a structured questionnaire. This isn't busywork — it's how I make sure I understand exactly what you need before writing a single line of code. Clients who fill it out thoroughly get better results, faster.",
    },
    {
      step: "03",
      title: "Proposal & Agreement",
      body: "A clear quote — fixed-price or time-based — with scope, timeline, and deliverables spelled out. No surprises.",
    },
    {
      step: "04",
      title: "Build",
      body: "Weekly updates, async Loom walkthroughs, and a shared workspace so you always know where things stand. You're never in the dark.",
    },
    {
      step: "05",
      title: "Ship & Hand Off",
      body: "Deployed, documented, and yours. If you want ongoing support, we can arrange that too.",
    },
  ],

  fit: {
    good: [
      "Small businesses and founders who want senior engineering depth without hiring full-time",
      "Startups that need founding-level ownership, not a ticket-taker",
      "Clients with a clear goal who are willing to participate in the scoping process",
    ],
    notFit: [
      "Projects requiring native iOS or Android apps (Swift/Kotlin) — I work in web",
      "Work that is purely backend or database with no frontend component",
      "Clients who aren't open to defining what they want — vague projects produce vague results",
    ],
    comms: [
      "Based in Las Vegas (Pacific Time), remote-friendly, async-first",
      "I use Slack, Figma, GitHub, Linear, and Loom — you don't need all of them",
      "I respond within 24 hours, usually much faster",
    ],
  },

  engagement: {
    availability: "Available for new projects now.",
    types: [
      { label: "Project-based", note: "Preferred for defined work with clear scope" },
      { label: "Hourly", note: "Available for audits, consulting, and short engagements" },
      { label: "Monthly retainer", note: "Available for ongoing support and maintenance" },
    ],
    ratesNote:
      "Rates discussed on the discovery call. You'll have a number in the first conversation, not after weeks of back-and-forth.",
  },

  proof: [
    {
      org: "Toucan",
      headline: "Early engineer. Architected the web platform.",
      body: "Took over a scrappy extension prototype and built the Next.js site from scratch in year one. The company grew to 30 employees and over a million users.",
    },
    {
      org: "Dave.com",
      headline: "First Senior Frontend Engineer. 200K → 4M+ users.",
      body: "Joined during hypergrowth and helped scale a fintech app to unicorn status. I've built under real pressure with real consequences.",
    },
    {
      org: "Aerospike",
      headline: "Architected the provisioning wizard on a revenue-critical enterprise product.",
      body: "Planned the wizard flow architecture and built many of its pages; other Cloud frontend engineers shipped additional wizard and console work following those patterns. High stakes during a live ACMS migration.",
    },
  ],

  cta: {
    headline: "Have a project in mind?",
    subtext: "Let's talk through it. First call is free, no commitment.",
  },
};
