"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import WorkWithMeMenu, { workWithMeOptions } from "@/components/work-with-me-menu";
import ThemeSwitcher from "@/components/theme-switcher";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Nav() {
  const pathname = usePathname();
  const menuId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobile();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, closeMobile]);

  function toggleMobile() {
    setMobileOpen((current) => {
      const next = !current;
      if (next) {
        track("nav mobile menu opened");
      }
      return next;
    });
  }

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

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const isActive = isLinkActive(pathname, link.href);
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
          <WorkWithMeMenu />
          <li>
            <ThemeSwitcher />
          </li>
        </ul>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobile}
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
          >
            {mobileOpen ? (
              <X size={20} strokeWidth={1.75} aria-hidden />
            ) : (
              <Menu size={20} strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id={menuId}
          className="border-t border-border md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="mx-auto max-w-content px-6 py-5">
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive = isLinkActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => track("nav clicked", { href: link.href, label: link.label })}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                        isActive
                          ? "bg-accent-dim/40 text-accent"
                          : "text-text-primary hover:bg-surface hover:text-accent",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 border-t border-border pt-5">
              <p className="px-3 font-mono text-xs font-medium uppercase tracking-wider text-text-secondary">
                Work with me
              </p>
              <ul className="mt-2 space-y-1">
                {workWithMeOptions.map((option) => {
                  const isActive = pathname.startsWith(option.href);
                  return (
                    <li key={option.href}>
                      <Link
                        href={option.href}
                        onClick={() =>
                          track("nav clicked", { href: option.href, label: option.label })
                        }
                        className={cn(
                          "block rounded-md px-3 py-2.5 transition-colors",
                          isActive
                            ? "bg-accent-dim/40"
                            : "hover:bg-surface",
                        )}
                      >
                        <span
                          className={cn(
                            "block text-base font-semibold",
                            isActive ? "text-accent" : "text-text-primary",
                          )}
                        >
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-sm text-text-secondary">
                          {option.description}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
