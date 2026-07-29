"use client";

import { Container } from "@/components/layout/container";
import { MapPreview } from "@/components/map/map-preview";
import { Button } from "@/components/ui/button";
import { HERO } from "@/content/hero";
import { capture } from "@/lib/analytics/client";

/**
 * The hero: one idea and a working preview of the product, both inside the
 * first viewport. Copy left, the interactive map right; on mobile the copy
 * leads and the preview follows immediately after the actions.
 *
 * Static apart from the preview's own state. The section renders complete
 * with no JavaScript.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-paper">
      {/* Paper grain, so the large cream field is not a flat CSS colour. */}
      <div className="grain pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <Container width="wide">
        <div className="grid gap-10 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-24">
          <div className="flex flex-col gap-6">
            <p className="eyebrow text-apricot-ink">{HERO.eyebrow}</p>

            {/* Expanded width is the typographic signature — used once, here,
                at the largest size on the site. Lines are authored, not
                wrapped. */}
            <h1
              id="hero-heading"
              className="font-display text-display-1 text-ink xl:text-[4.25rem]"
              style={{ fontStretch: "112%", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              {HERO.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="measure text-body-lg text-ink-muted">{HERO.supporting}</p>

            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <a
                  href={HERO.primaryCta.href}
                  onClick={() => capture("hero_cta_clicked", { cta: "primary" })}
                >
                  {HERO.primaryCta.label}
                </a>
              </Button>

              <Button asChild size="lg" variant="secondary">
                <a
                  href={HERO.secondaryCta.href}
                  onClick={() => {
                    capture("hero_cta_clicked", { cta: "secondary" });
                    capture("leader_cta_clicked", { location: "hero" });
                  }}
                >
                  {HERO.secondaryCta.label}
                </a>
              </Button>
            </div>

            <p className="font-mono text-sm text-ink-faint">{HERO.trustLine}</p>
          </div>

          <MapPreview />
        </div>
      </Container>
    </section>
  );
}
