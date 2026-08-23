"use client";

import Link from "next/link";
import { footer, home, siteConfig } from "@/lib/content";
import { recommendationsMeta } from "@/lib/recommendations";
import { track } from "@/lib/analytics";
import type { FooterLink } from "@/lib/content";

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className =
    "group block rounded-sm transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50";

  function onClick() {
    if (link.event) {
      track(link.event);
      return;
    }
    track("footer link clicked", { href: link.href, label: link.label });
  }

  const content = (
    <>
      <span className="font-medium text-text-primary transition-colors group-hover:text-accent">
        {link.label}
      </span>
      {link.description && (
        <span className="mt-0.5 block text-xs text-text-secondary">{link.description}</span>
      )}
    </>
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              onClick={() => track("footer link clicked", { href: "/", label: "wordmark" })}
              className="font-display text-lg font-extrabold tracking-tight text-text-primary transition-colors hover:text-accent"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-1 text-sm text-text-secondary">{siteConfig.title}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {home.positioning}
            </p>
            <Link
              href="/recommendations"
              onClick={() =>
                track("footer link clicked", { href: "/recommendations", label: "recommendations-callout" })
              }
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              What colleagues say
              <span className="font-mono text-xs text-text-secondary">
                ({recommendationsMeta.totalCount})
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Link columns */}
          {footer.sections.map((section) => (
            <div key={section.title}>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
                {section.title}
              </p>
              <ul className="mt-5 space-y-4">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-secondary/60">
              Connect
            </p>
            <ul className="mt-5 space-y-3">
              {footer.social.map((item) => {
                const href = item.mailto ? `mailto:${item.href}` : item.href;
                return (
                  <li key={item.label}>
                    <a
                      href={href}
                      target={item.mailto ? undefined : "_blank"}
                      rel={item.mailto ? undefined : "noopener noreferrer"}
                      onClick={() =>
                        track("outbound link clicked", { href, kind: item.kind })
                      }
                      className="text-sm font-medium text-text-primary transition-colors hover:text-accent"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-8 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="text-xs">Las Vegas, NV · Remote-friendly</p>
        </div>
      </div>
    </footer>
  );
}
