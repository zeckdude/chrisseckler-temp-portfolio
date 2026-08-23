import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/button";
import Magnetic from "@/components/motion/magnetic";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { TechChip } from "@/components/ui/tech-chip";
import RecommendationsTeaser from "@/components/recommendations-teaser";
import { fullTime, about } from "@/lib/content";

export const metadata: Metadata = {
  title: "Full-time — Senior Frontend Engineer",
  description:
    "Senior frontend engineer actively looking for the right team. 15+ years at every company stage. React, TypeScript, Next.js, AI. Remote or Las Vegas.",
};

export default function FullTimePage() {
  return (
    <div className="mx-auto max-w-content px-6">

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="pointer-events-none absolute -top-25 left-1/2 h-100 w-175 -translate-x-1/2 rounded-full bg-hero-glow opacity-40 blur-[100px] light:opacity-30" />

        <Reveal>
          <div className="mb-6 flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-accent">{fullTime.hero.badge}</span>
          </div>
        </Reveal>

        <Reveal>
          <h1
            className="text-balance font-display font-extrabold tracking-tight text-text-primary"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            {fullTime.hero.headline}
          </h1>
        </Reveal>

        <Reveal>
          <p className="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            {fullTime.hero.subtext}
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <Button href={fullTime.cta.resumeUrl} external event="resume downloaded">Download Resume</Button>
            </Magnetic>
            <Magnetic>
              <Button href="/contact" variant="ghost" event="contact intent" eventProps={{ source: "full-time" }}>Get in touch</Button>
            </Magnetic>
            <Magnetic>
              <Button href="https://linkedin.com/in/chrisseckler" variant="ghost" external>
                LinkedIn
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ── 2. AT A GLANCE — stats ────────────────────────────────── */}
      <section className="py-6">
        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
          {fullTime.stats.map((stat) => (
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

      {/* ── 3. WHAT I BRING ───────────────────────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-12">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            What I bring to your team
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Not just a skillset — a way of working. Here&rsquo;s what changes when I join a team.
          </p>
        </Reveal>

        <Reveal className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
            Capabilities
          </p>
        </Reveal>
        <RevealGroup className="mb-14 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {fullTime.brings.capabilities.map((item) => (
            <Reveal key={item.name}>
              <div className="flex h-full flex-col gap-2 bg-surface px-6 py-7">
                <h3 className="font-display font-bold text-text-primary">{item.name}</h3>
                <p className="text-sm text-text-secondary">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
            How I work
          </p>
        </Reveal>
        <RevealGroup className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {fullTime.brings.workingStyle.map((item) => (
            <Reveal key={item.name}>
              <div className="flex h-full flex-col gap-2 bg-surface px-6 py-7">
                <h3 className="font-display font-bold text-text-primary">{item.name}</h3>
                <p className="text-sm text-text-secondary">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* ── 4. CAREER HIGHLIGHTS ──────────────────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-10">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            Where I&rsquo;ve worked and what I owned
          </h2>
          <p className="mt-3 max-w-xl text-text-secondary">
            Three roles that show the range — founding scale, unicorn growth, and enterprise infrastructure.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-3">
          {fullTime.proof.map((item) => (
            <Reveal key={item.org}>
              <div className="flex h-full flex-col gap-3 rounded-md border border-border bg-surface px-6 py-7">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent/80">
                    {item.org}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary/60">{item.role}</p>
                </div>
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

      {/* ── 5. TECH STACK ─────────────────────────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-10">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            Technical depth
          </h2>
          <p className="mt-3 max-w-xl text-text-secondary">
            Production-proven across 15 years. Not a list of things I&rsquo;ve touched — a stack
            I&rsquo;ve shipped real products with.
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

      {/* ── 6. ROLE FIT ───────────────────────────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-10">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            What I&rsquo;m looking for
          </h2>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-md border border-border bg-surface px-6 py-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent/80">
                Good fit
              </p>
              <ul className="space-y-3">
                {fullTime.fit.good.map((item) => (
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
                {fullTime.fit.notFit.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-text-secondary">
                    <span className="mt-0.5 shrink-0 text-text-secondary/40">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </RevealGroup>

        <Reveal className="mt-6">
          <div className="rounded-md border border-border bg-surface px-6 py-7">
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
              Open to
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {fullTime.fit.openTo.map((role) => (
                <div key={role.label} className="rounded border border-border px-4 py-4">
                  <p className="font-display font-bold text-text-primary">{role.label}</p>
                  <p className="mt-1 text-xs text-text-secondary">{role.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 7. AVAILABILITY ───────────────────────────────────────── */}
      <section className="py-20">
        <Reveal>
          <div className="rounded-md border border-border bg-surface px-8 py-10 sm:px-12">
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                <span className="text-sm font-semibold text-accent">
                  {fullTime.availability.status}
                </span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
                Availability & logistics
              </h2>
            </div>

            <div className="grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                  Location
                </p>
                <p className="text-sm text-text-secondary">{fullTime.availability.location}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                  Compensation
                </p>
                <p className="text-sm text-text-secondary">{fullTime.availability.comp}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                  Timeline
                </p>
                <p className="text-sm text-text-secondary">{fullTime.availability.note}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <RecommendationsTeaser />

      {/* ── 8. CTA ────────────────────────────────────────────────── */}
      <section className="py-20">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-md border border-border bg-surface p-10 text-center sm:p-16">
            <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
              {fullTime.cta.headline}
            </h2>
            <p className="max-w-md text-text-secondary">{fullTime.cta.subtext}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic>
                <Button href={fullTime.cta.resumeUrl} external event="resume downloaded">Download Resume</Button>
              </Magnetic>
              <Magnetic>
                <Button href="/contact" variant="ghost" event="contact intent" eventProps={{ source: "full-time" }}>Get in touch</Button>
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
