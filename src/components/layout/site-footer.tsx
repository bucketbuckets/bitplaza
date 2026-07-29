import Link from "next/link";

import { Container } from "./container";
import { Wordmark } from "./wordmark";
import { AnalyticsOptOut } from "@/components/analytics/analytics-opt-out";
import { BRAND_PROMISE, FOOTER_GROUPS, OPENNESS_LINE } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-surface">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Wordmark />
            <p className="font-display text-xl leading-snug text-ink measure">{BRAND_PROMISE}</p>
            {/* The positioning resolved in docs §9.1, stated once, plainly. */}
            <p className="max-w-sm text-sm leading-relaxed text-muted">{OPENNESS_LINE}</p>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <h2 className="eyebrow text-faint">{group.heading}</h2>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("#") ? (
                        <a
                          href={link.href}
                          className="inline-block py-1 text-sm text-muted transition-colors hover:text-ink"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="inline-block py-1 text-sm text-muted transition-colors hover:text-ink"
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

        <div className="flex flex-col gap-4 border-t border-rule py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            © {year} Bitplaza. Starting with Bitcoin. Built for every meaningful community.
          </p>
          <AnalyticsOptOut />
        </div>
      </Container>
    </footer>
  );
}
