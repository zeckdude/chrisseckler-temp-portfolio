"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/employed", label: "Join Your Team", highlight: true },
  { href: "/freelance", label: "Hire Me", highlight: true },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={() => track("nav clicked", { href: "/", label: "wordmark" })}
          className="font-display text-lg font-extrabold tracking-tight text-text-primary transition-colors hover:text-accent"
        >
          Chris Seckler
        </Link>
        <ul className="flex items-center gap-6">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            if (link.highlight) {
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => track("nav clicked", { href: link.href, label: link.label })}
                    className={cn(
                      "text-[0.9rem] font-semibold transition-colors",
                      isActive
                        ? "text-bg bg-accent px-3 py-1.5 rounded"
                        : "text-accent border border-accent/40 px-3 py-1.5 rounded hover:bg-accent hover:text-bg",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => track("nav clicked", { href: link.href, label: link.label })}
                  className={cn(
                    "text-[0.9rem] font-medium transition-colors",
                    isActive ? "text-accent" : "text-text-primary hover:text-accent",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
