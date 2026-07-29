"use client";

import { Container } from "@/components/layout/container";
import { PlazaField } from "@/components/plaza/plaza-field";
import { Button } from "@/components/ui/button";
import { HERO } from "@/content/hero";
import { capture } from "@/lib/analytics/client";

/**
 * The hero opens with the plaza itself rather than a screenshot or a stock
 * photograph — the map is the product's whole argument, so it should be the
 * first thing on screen.
 *
 * The field runs full-bleed behind the copy. A directional scrim over it keeps
 * text contrast fixed at the token values rather than at whatever the canvas
 * happens to be doing underneath, which is what makes the AA guarantee hold
 * over a moving background.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Below `lg` the copy spans the full width, so the field steps back to
            a texture. Above it, the field is at full strength and the scrim
            does the separating. */}
        <div className="absolute inset-0 opacity-30 sm:opacity-40 lg:opacity-100">
          <PlazaField label={HERO.fieldLabel} />
        </div>

        {/* The scrim is fully opaque across the text column and only then
            begins to clear. Fading gradually from the left edge instead would
            leave lines crossing the headline at an unpredictable contrast —
            which is exactly what the measured token ratios are meant to rule
            out. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-ground from-55% to-transparent to-95% lg:from-46% lg:to-88%"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-ground"
        />
      </div>

      <Container>
        <div className="flex min-h-[min(88svh,46rem)] flex-col justify-center gap-7 py-24 sm:py-32 lg:max-w-[38rem] lg:py-40">
          <p className="eyebrow text-accent-text">{HERO.eyebrow}</p>

          <h1
            id="hero-heading"
            className="font-display text-display-lg text-ink"
            // The headline is one sentence and must break on its own terms.
            style={{ textWrap: "balance" }}
          >
            {HERO.headline}
          </h1>

          <p className="measure text-lg leading-relaxed text-muted sm:text-xl">
            {HERO.supporting}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a
                href={HERO.primaryCta.href}
                onClick={() => {
                  capture("hero_cta_clicked", { cta: "primary" });
                  capture("waitlist_started", { source: "hero", prefilled: false });
                }}
              >
                {HERO.primaryCta.label}
              </a>
            </Button>

            <Button asChild size="lg" variant="secondary">
              <a
                href={HERO.secondaryCta.href}
                onClick={() => {
                  capture("hero_cta_clicked", { cta: "secondary" });
                  capture("vision_clicked", { location: "hero" });
                }}
              >
                {HERO.secondaryCta.label}
              </a>
            </Button>
          </div>

          <p className="text-sm text-faint">{HERO.trustLine}</p>
        </div>
      </Container>
    </section>
  );
}
