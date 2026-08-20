import Link from "next/link";
import Button from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center gap-6 px-6 py-32 text-center">
      <p className="font-mono text-sm text-text-secondary">404</p>
      <h1 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="max-w-md text-text-secondary">
        The page you&rsquo;re looking for was moved, renamed, or never existed.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button href="/">Back to home</Button>
        <Link
          href="/projects"
          className="text-sm font-medium text-text-secondary transition-colors hover:text-accent"
        >
          Or see the projects →
        </Link>
      </div>
    </div>
  );
}
