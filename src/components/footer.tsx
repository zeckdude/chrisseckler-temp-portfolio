"use client";

import { siteConfig } from "@/lib/content";
import { track } from "@/lib/analytics";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-8 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}.</p>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${siteConfig.email}`}
            onClick={() => track("outbound link clicked", { href: `mailto:${siteConfig.email}`, kind: "email" })}
            className="transition-colors hover:text-accent"
          >
            Email
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("outbound link clicked", { href: siteConfig.linkedin, kind: "linkedin" })}
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("outbound link clicked", { href: siteConfig.github, kind: "github" })}
            className="transition-colors hover:text-accent"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
