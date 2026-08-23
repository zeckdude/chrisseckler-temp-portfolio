import Link from "next/link";
import Button from "@/components/ui/button";
import ProjectCard from "@/components/ui/project-card";
import Magnetic from "@/components/motion/magnetic";
import { ParallaxHero, ParallaxLayer } from "@/components/motion/parallax-hero";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getFeaturedProjects } from "@/lib/projects";
import { home } from "@/lib/content";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <ParallaxHero className="relative overflow-hidden px-6 pt-28 pb-32 sm:pt-36 sm:pb-40">
        <ParallaxLayer depth={0.02} className="hero-atmosphere pointer-events-none absolute inset-0 -z-20" />

        <ParallaxLayer
          depth={0.05}
          className="pointer-events-none absolute inset-0 -z-10 opacity-20 light:opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(var(--hero-grid-dot) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="mx-auto max-w-content">
          <ParallaxLayer depth={0.12}>
            <h1
              className="text-balance font-display font-extrabold leading-[0.95] tracking-tight text-text-primary"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              Chris Seckler
            </h1>
          </ParallaxLayer>

          <ParallaxLayer depth={0.08} className="mt-5 max-w-2xl">
            <p className="font-display text-xl font-semibold text-accent sm:text-2xl">
              Senior Frontend Engineer
            </p>
            <p className="mt-5 text-lg text-text-secondary sm:text-xl">
              {home.positioning}
            </p>
          </ParallaxLayer>

          <div className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <Button href="/projects">See all projects</Button>
            </Magnetic>
            <Magnetic>
              <Button href="/contact" variant="ghost" event="contact intent" eventProps={{ source: "home-hero" }}>
                Get in touch
              </Button>
            </Magnetic>
          </div>
        </div>
      </ParallaxHero>

      <section className="mx-auto max-w-content px-6 py-14">
        <Reveal>
          <div className="rounded-md border border-border bg-surface p-6 sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-text-primary">
              Currently
            </h2>
            <p className="mt-3 max-w-2xl text-base text-text-secondary sm:text-lg">
              {home.currently}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-content px-6 py-16">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold text-text-primary">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            View all projects →
          </Link>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <Reveal key={project.slug} className="h-full">
              <Magnetic strength={6} className="block h-full">
                <ProjectCard project={project} />
              </Magnetic>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-content px-6 py-20">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-md border border-border bg-surface p-10 text-center sm:p-16">
            <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
              Let&rsquo;s build something.
            </h2>
            <p className="max-w-xl text-text-secondary">
              Open to senior IC, founding engineer, and AI-forward roles — remote or
              Las Vegas-based. Available for select freelance work.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/projects" variant="ghost">
                See all projects
              </Button>
              <Button href="/freelance">Freelance</Button>
              <Button href="/full-time" variant="ghost">
                Full-time
              </Button>
              <Button href="/contact" variant="ghost" event="contact intent" eventProps={{ source: "home-footer" }}>Get in touch</Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
