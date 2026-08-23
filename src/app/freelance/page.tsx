import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/button";
import Magnetic from "@/components/motion/magnetic";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { TechChip } from "@/components/ui/tech-chip";
import RecommendationsTeaser from "@/components/recommendations-teaser";
import { freelance, about } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hire Me — Freelance Web Development",
  description:
    "Senior frontend engineer available for freelance work. 15+ years shipping products at scale. React, TypeScript, Next.js. Let's talk.",
};

export default function FreelancePage() {
  return (
    <div className="mx-auto max-w-content px-6">

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* accent glow — same visual treatment as homepage */}
        <div className="pointer-events-none absolute -top-25 left-1/2 h-100 w-175 -translate-x-1/2 rounded-full bg-hero-glow opacity-40 blur-[100px] light:opacity-30" />

        <Reveal>
          <div className="mb-6 flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-accent">{freelance.hero.badge}</span>
          </div>
        </Reveal>

        <Reveal>
          {/* headline size = documented `headline` step: clamp(2.25rem, 5vw, 3rem) */}
          <h1
            className="text-balance font-display font-extrabold tracking-tight text-text-primary"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            {freelance.hero.headline}
          </h1>
        </Reveal>

        <Reveal>
          <p className="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            {freelance.hero.subtext}
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <Button href="/contact" event="contact intent" eventProps={{ source: "freelance" }}>Start a conversation</Button>
            </Magnetic>
            <Magnetic>
              <Button href="/projects" variant="ghost">See my work</Button>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ── 2. AT A GLANCE — stats ────────────────────────────────── */}
      <section className="py-6">
        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
          {freelance.stats.map((stat) => (
            <Reveal key={stat.value}>
              <div className="flex h-full flex-col gap-1.5 bg-surface px-6 py-8">
                <span className="font-display text-3xl font-extrabold text-accent sm:text-4xl">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-text-primary">{stat.label}</span>
                <span className="text-xs text-text-secondary">{stat.subtext}</span>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* ── 3. SERVICES ───────────────────────────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-12">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            What I can build for you
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Not sure what you actually need from a web developer? Here&rsquo;s a plain-language
            breakdown of what I do and why it might matter to you.
          </p>
        </Reveal>

        {/* Build something new */}
        <Reveal className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
            Build something new
          </p>
        </Reveal>
        <RevealGroup className="mb-14 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {freelance.services.buildNew.map((svc) => (
            <Reveal key={svc.name}>
              <div className="flex h-full flex-col gap-2 bg-surface px-6 py-7">
                <h3 className="font-display font-bold text-text-primary">{svc.name}</h3>
                <p className="text-sm text-text-secondary">{svc.what}</p>
                <p className="mt-auto pt-3 text-xs italic text-text-secondary/70">{svc.why}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>

        {/* Fix or improve what you have */}
        <Reveal className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
            Fix or improve what you have
          </p>
        </Reveal>
        <RevealGroup className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {freelance.services.fixImprove.map((svc) => (
            <Reveal key={svc.name}>
              <div className="flex h-full flex-col gap-2 bg-surface px-6 py-7">
                <h3 className="font-display font-bold text-text-primary">{svc.name}</h3>
                <p className="text-sm text-text-secondary">{svc.what}</p>
                <p className="mt-auto pt-3 text-xs italic text-text-secondary/70">{svc.why}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* ── 4. PROCESS ────────────────────────────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-12">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            How we work together
          </h2>
          <p className="mt-3 max-w-xl text-text-secondary">
            A straightforward process designed to protect your time and money — not mine.
          </p>
        </Reveal>

        <RevealGroup className="flex flex-col">
          {freelance.process.map((step, i) => (
            <Reveal key={step.step}>
              <div
                className={`flex gap-6 py-7 ${
                  i < freelance.process.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-8 shrink-0 pt-0.5">
                  <span className="font-mono text-xs font-bold text-accent">{step.step}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary sm:text-base">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* ── 5. TECH STACK ─────────────────────────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-10">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            The tools I work with
          </h2>
          <p className="mt-3 max-w-xl text-text-secondary">
            Chosen for reliability, not trend-chasing — the same stack I&rsquo;ve shipped production
            products with.
          </p>
        </Reveal>

        <div className="space-y-8">
          {about.techStack.map((group) => (
            <Reveal key={group.category}>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <TechChip key={item} label={item} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 6. WORKING STYLE — fit & comms ───────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-10">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            Is this a good fit?
          </h2>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-md border border-border bg-surface px-6 py-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent/80">
                Good fit
              </p>
              <ul className="space-y-3">
                {freelance.fit.good.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-text-secondary">
                    <span className="mt-0.5 shrink-0 text-accent">↗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="h-full rounded-md border border-border bg-surface px-6 py-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                Not a fit
              </p>
              <ul className="space-y-3">
                {freelance.fit.notFit.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-text-secondary">
                    <span className="mt-0.5 shrink-0 text-text-secondary/40">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="h-full rounded-md border border-border bg-surface px-6 py-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                Communication
              </p>
              <ul className="space-y-3">
                {freelance.fit.comms.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-text-secondary">
                    <span className="mt-0.5 shrink-0 text-text-secondary/40">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </RevealGroup>
      </section>

      {/* ── 7. ENGAGEMENT & RATES ─────────────────────────────────── */}
      <section className="py-20">
        <Reveal>
          <div className="rounded-md border border-border bg-surface px-8 py-10 sm:px-12">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm font-semibold text-accent">
                    {freelance.engagement.availability}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
                  Engagement options
                </h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {freelance.engagement.types.map((type) => (
                <div key={type.label} className="rounded border border-border px-5 py-5">
                  <p className="font-display font-bold text-text-primary">{type.label}</p>
                  <p className="mt-1.5 text-sm text-text-secondary">{type.note}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 border-t border-border pt-6 text-sm text-text-secondary">
              {freelance.engagement.ratesNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── 8. PROOF — selected experience ───────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-10">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            Track record
          </h2>
          <p className="mt-3 max-w-xl text-text-secondary">
            Not a resume — just three moments that tell you what kind of engineer you&rsquo;re hiring.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-3">
          {freelance.proof.map((item) => (
            <Reveal key={item.org}>
              <div className="flex h-full flex-col gap-3 rounded-md border border-border bg-surface px-6 py-7">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent/80">
                  {item.org}
                </p>
                <h3 className="font-display font-bold leading-snug text-text-primary">
                  {item.headline}
                </h3>
                <p className="text-sm text-text-secondary">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal className="mt-8">
          <Link
            href="/projects"
            className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            See the full project archive →
          </Link>
        </Reveal>
      </section>

      <RecommendationsTeaser />

      {/* ── 9. CTA ────────────────────────────────────────────────── */}
      <section className="py-20">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-md border border-border bg-surface p-10 text-center sm:p-16">
            <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
              {freelance.cta.headline}
            </h2>
            <p className="max-w-md text-text-secondary">{freelance.cta.subtext}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic>
                <Button href="/contact" event="contact intent" eventProps={{ source: "freelance-cta" }}>Let&rsquo;s talk</Button>
              </Magnetic>
              <Magnetic>
                <Button
                  href="https://linkedin.com/in/chrisseckler"
                  variant="ghost"
                  external
                >
                  View LinkedIn
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
