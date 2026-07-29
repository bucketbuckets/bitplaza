"use client";

import { Container } from "@/components/layout/container";
import { Colonnade } from "@/components/plaza/colonnade";
import { Button } from "@/components/ui/button";
import { HERO } from "@/content/hero";
import { capture } from "@/lib/analytics/client";

/**
 * District 1 — Enter Bitplaza. design.md §16.
 *
 * The composition is deliberately NOT the left-headline-plus-right-graphic
 * startup layout §15 rules out. The headline sits high and left at signage
 * scale; the colonnade runs full-bleed across the lower half as ground the copy
 * stands on, not as an illustration beside it.
 *
 * Everything here is static. Ambient drift is CSS, so the district renders
 * complete with no JavaScript — which is the Phase 1 exit gate.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-paper">
      {/* Paper grain, so the large cream field is not a flat CSS colour. */}
      <div className="grain pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <Container>
        <div className="relative z-10 flex flex-col gap-6 pt-14 sm:pt-20 lg:pt-24">
          <p className="eyebrow text-apricot-ink">{HERO.eyebrow}</p>

          {/* Expanded width is the typographic signature — used once, here, at
              the largest size on the site. Lines are authored, not wrapped. */}
          <h1
            id="hero-heading"
            className="font-display text-display-hero text-ink"
            style={{ fontStretch: "112%", fontWeight: 800, letterSpacing: "-0.035em" }}
          >
            {HERO.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="measure-wide text-body-lg text-ink-muted">{HERO.supporting}</p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button asChild size="xl">
              <a
                href={HERO.primaryCta.href}
                onClick={() => capture("hero_cta_clicked", { cta: "primary" })}
              >
                {HERO.primaryCta.label}
              </a>
            </Button>

            <Button asChild size="xl" variant="secondary">
              <a
                href={HERO.secondaryCta.href}
                onClick={() => {
                  capture("hero_cta_clicked", { cta: "secondary" });
                  capture("waitlist_started", { source: "hero", prefilled: false });
                }}
              >
                {HERO.secondaryCta.label}
              </a>
            </Button>

            <Button asChild variant="link" className="sm:ml-2">
              <a
                href={HERO.tertiaryCta.href}
                onClick={() => capture("vision_clicked", { location: "hero" })}
              >
                {HERO.tertiaryCta.label}
              </a>
            </Button>
          </div>

          <p className="font-mono text-sm text-ink-faint">{HERO.trustLine}</p>
        </div>
      </Container>

      {/* The plaza itself — full-bleed and wider than the container, sitting on
          the bottom edge so the arches read as architecture rather than as a
          picture of architecture. The height is bounded in rem, not vh: it must
          share the first viewport with the headline, and a vh-sized band is
          what pushed it below the fold. */}
      <div className="relative mt-10 sm:mt-12">
        <Colonnade className="h-48 w-[125%] max-w-none -translate-x-[12%] sm:h-60 sm:w-[112%] sm:-translate-x-[6%] lg:h-72 lg:w-full lg:translate-x-0" />
      </div>

      <span className="sr-only">{HERO.sceneLabel}</span>
    </section>
  );
}
