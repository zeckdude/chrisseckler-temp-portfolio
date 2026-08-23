import Link from "next/link";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { featuredRecommendations, recommendationsMeta } from "@/lib/recommendations";

type RecommendationsTeaserProps = {
  /** Which featured quotes to show (by recommender name). Defaults to the two strongest manager quotes. */
  highlightNames?: string[];
};

const defaultHighlights = ["David Cutherell", "Shaun Merritt"];

export default function RecommendationsTeaser({
  highlightNames = defaultHighlights,
}: RecommendationsTeaserProps) {
  const highlights = highlightNames
    .map((name) => featuredRecommendations.find((r) => r.name === name))
    .filter((r): r is NonNullable<typeof r> => r != null);

  return (
    <section className="py-20">
      <Reveal className="mb-10">
        <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
          What colleagues say
        </h2>
        <p className="mt-3 max-w-xl text-text-secondary">
          {featuredRecommendations.length} selected highlights from{" "}
          {recommendationsMeta.totalCount} LinkedIn recommendations — managers, peers, and
          cross-functional partners from {recommendationsMeta.dateRange}.
        </p>
      </Reveal>

      <RevealGroup className="grid gap-6 sm:grid-cols-2">
        {highlights.map((rec) => (
          <Reveal key={rec.name}>
            <figure className="flex h-full flex-col rounded-md border border-border bg-surface px-6 py-7">
              <blockquote className="flex-1 text-sm leading-relaxed text-text-primary sm:text-base">
                &ldquo;{rec.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-display text-sm font-bold text-text-primary">{rec.name}</p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {rec.title} · {rec.company}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </RevealGroup>

      <Reveal className="mt-8">
        <Link
          href="/recommendations"
          className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
        >
          Read all recommendations →
        </Link>
      </Reveal>
    </section>
  );
}
