import type { Metadata } from "next";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { TechChip } from "@/components/ui/tech-chip";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chris Seckler is a Senior Frontend Engineer with 15+ years of experience shipping React, TypeScript, and Next.js products.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <Reveal className="max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
          {about.headline}
        </h1>
      </Reveal>

      <RevealGroup className="mt-8 flex max-w-case-study flex-col gap-5 text-lg leading-relaxed text-text-secondary">
        {about.bio.map((paragraph) => (
          <Reveal key={paragraph} as="div">
            <p>{paragraph}</p>
          </Reveal>
        ))}
      </RevealGroup>

      <section className="mt-20">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold text-text-primary">Tech Stack</h2>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {about.techStack.map((group) => (
            <Reveal key={group.category}>
              <h3 className="font-mono text-xs tracking-wide text-text-secondary uppercase">
                {group.category}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechChip key={item} label={item} />
                ))}
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      <section className="mt-20 pb-8">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold text-text-primary">
            Career Timeline
          </h2>
        </Reveal>

        <RevealGroup className="mt-10 flex max-w-case-study flex-col">
          {about.timeline.map((item) => (
            <Reveal
              key={`${item.org}-${item.role}`}
              className="relative flex gap-6 border-l border-border py-1 pb-8 pl-6 last:pb-0"
            >
              <span className="absolute top-2 left-[-5px] h-2.5 w-2.5 rounded-full bg-accent" />
              <div>
                <p className="font-display text-lg font-bold text-text-primary">{item.org}</p>
                <p className="text-text-secondary">{item.role}</p>
                {item.detail && (
                  <p className="mt-1 font-mono text-sm text-accent">{item.detail}</p>
                )}
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>
    </div>
  );
}
