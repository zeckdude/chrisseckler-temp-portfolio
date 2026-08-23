import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/button";
import Magnetic from "@/components/motion/magnetic";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/content";
import {
  featuredRecommendations,
  recommendationsMeta,
} from "@/lib/recommendations";

export const metadata: Metadata = {
  title: "Recommendations — What Colleagues Say",
  description:
    "28 LinkedIn recommendations from managers, peers, and cross-functional partners — spanning Toucan, Dave.com, Trailer Park, and more.",
};

const eraLabels: Record<string, string> = {
  toucan: "Toucan",
  dave: "Dave.com",
  "trailer-park": "Trailer Park",
  "pro-print": "Pro Print & Services",
  "early-career": "Early career",
  education: "Art Institute",
};

export default function RecommendationsPage() {
  return (
    <div className="mx-auto max-w-content px-6">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -top-25 left-1/2 h-100 w-175 -translate-x-1/2 rounded-full bg-hero-glow opacity-40 blur-[100px] light:opacity-30" />

        <Reveal>
          <div className="mb-6 flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-accent">
              {recommendationsMeta.totalCount} recommendations · {recommendationsMeta.dateRange}
            </span>
          </div>
        </Reveal>

        <Reveal>
          <h1
            className="text-balance font-display font-extrabold tracking-tight text-text-primary"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            {recommendationsMeta.headline}
          </h1>
        </Reveal>

        <Reveal>
          <p className="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            {recommendationsMeta.subtext}
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <Button href={siteConfig.linkedin} external>
                View on LinkedIn
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="/about" variant="ghost">
                About Chris
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ── FEATURED QUOTES ───────────────────────────────────────── */}
      <section className="py-12">
        <Reveal className="mb-10">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            Selected highlights
          </h2>
          <p className="mt-3 max-w-xl text-text-secondary">
            The strongest signal from direct managers and close collaborators — not cherry-picked
            adjectives, but specific patterns that repeat across every era of my career.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          {featuredRecommendations.map((rec) => (
            <Reveal key={rec.name}>
              <figure className="flex h-full flex-col rounded-md border border-border bg-surface px-7 py-8">
                <blockquote className="flex-1 text-base leading-relaxed text-text-primary">
                  &ldquo;{rec.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5">
                  <p className="font-display font-bold text-text-primary">{rec.name}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {rec.title} · {rec.company}
                  </p>
                  <p className="mt-1 font-mono text-xs text-accent/80">
                    {rec.relationship} · {rec.date}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* ── RECURRING THEMES ──────────────────────────────────────── */}
      <section className="py-20">
        <Reveal className="mb-10">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            What keeps coming up
          </h2>
          <p className="mt-3 max-w-xl text-text-secondary">
            The same traits show up whether the recommender was a CTO, a designer, a TPM, or a
            creative producer — from agency work in 2010 through Toucan in 2023.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {recommendationsMeta.themes.map((theme) => (
            <Reveal key={theme.label}>
              <div className="flex h-full flex-col gap-2 bg-surface px-6 py-7">
                <h3 className="font-display font-bold text-text-primary">{theme.label}</h3>
                <p className="text-sm text-text-secondary">{theme.detail}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* ── ERA SPAN ──────────────────────────────────────────────── */}
      <section className="py-12">
        <Reveal>
          <div className="rounded-md border border-border bg-surface px-8 py-10 sm:px-12">
            <h2 className="font-display text-xl font-extrabold text-text-primary sm:text-2xl">
              A career arc, not a one-off team
            </h2>
            <p className="mt-4 max-w-2xl text-text-secondary">
              Recommendations span direct managers at Toucan and Trailer Park, product designers
              at Dave.com and Toucan, TPMs, creative directors, and faculty from the Art
              Institute — {recommendationsMeta.totalCount} total from{" "}
              {recommendationsMeta.dateRange}.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {Object.entries(eraLabels).map(([key, label]) => (
                <li
                  key={key}
                  className="rounded border border-border px-3 py-1.5 font-mono text-xs text-text-secondary"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-md border border-border bg-surface p-10 text-center sm:p-16">
            <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
              Want to work together?
            </h2>
            <p className="max-w-md text-text-secondary">
              These recommendations are about what it&rsquo;s like to work with Chris — whether
              on a team or on a project. Pick the path that fits how you&rsquo;re evaluating him.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic>
                <Button href="/full-time">Join your team</Button>
              </Magnetic>
              <Magnetic>
                <Button href="/freelance" variant="ghost">
                  Hire for a project
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/contact" variant="ghost" event="contact intent" eventProps={{ source: "recommendations" }}>
                  Get in touch
                </Button>
              </Magnetic>
            </div>
            <p className="text-sm text-text-secondary">
              Full recommendation history on{" "}
              <Link
                href={siteConfig.linkedin}
                className="font-medium text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
