import Link from "next/link";

import { Container } from "./container";
import { Wordmark } from "./wordmark";
import { AnalyticsOptOut } from "@/components/analytics/analytics-opt-out";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BRAND_PROMISE, FOOTER_GROUPS, OPENNESS_LINE } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-edge bg-surface">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Wordmark />
            <p className="font-display text-xl leading-snug text-ink measure">{BRAND_PROMISE}</p>
            <p className="max-w-sm text-sm leading-relaxed text-ink-muted">{OPENNESS_LINE}</p>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <h2 className="eyebrow text-ink-faint">{group.heading}</h2>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.href.includes("#") ? (
                        <a
                          href={link.href}
                          className="inline-block py-1 text-sm text-ink-muted transition-colors hover:text-ink"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="inline-block py-1 text-sm text-ink-muted transition-colors hover:text-ink"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-edge py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-faint">
            © {year} Bitplaza. Starting with Bitcoin. Built for every community.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <AnalyticsOptOut />
            {/* The one appearance control on the page, per the navigation rule. */}
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
}
