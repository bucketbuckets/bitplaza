import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { BITCOIN_HUB_PAGE } from "@/content/bitcoin-hub-page";
import {
  DATA_DISCLAIMER,
  DEPTH_LEVELS,
  TERRITORIES,
} from "@/content/hub-preview";
import { FEATURED_PATHS, MORE_PATHS } from "@/content/paths";

/**
 * /bitcoin — the first map's page: a real preview, not a homepage copy.
 * Server-rendered and static. Bitcoin's orange leads HERE and nowhere else,
 * as marks and accents, never as a ground behind text.
 *
 * Copy comes from content modules. The owner's launch material lands there,
 * not here.
 */

export const metadata: Metadata = {
  title: BITCOIN_HUB_PAGE.meta.title,
  description: BITCOIN_HUB_PAGE.meta.description,
};

const ALL_PATHS = [...FEATURED_PATHS, ...MORE_PATHS];

export default function BitcoinPage() {
  const { hero, territories, depth, paths, closing } = BITCOIN_HUB_PAGE;

  return (
    <article>
      {/* ── Doorway ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-edge py-20 sm:py-28">
        <div className="grain pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <Container>
          <div className="flex flex-col gap-5">
            <p className="eyebrow flex items-center gap-2.5 text-c-bitcoin-text">
              <span aria-hidden="true" className="inline-block size-2 rounded-full bg-c-bitcoin" />
              {hero.eyebrow}
            </p>

            <h1 className="font-display text-display-1 text-ink">{hero.heading}</h1>

            <p className="measure-wide text-body-lg text-ink-muted">{hero.supporting}</p>

            <p className="font-mono text-sm text-ink-faint">{hero.status}</p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <a href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* ── Territories ─────────────────────────────────────────────── */}
      <section aria-labelledby="bh-territories" className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4">
            <h2 id="bh-territories" className="font-display text-display-2 text-ink">
              {territories.heading}
            </h2>
            <p className="measure-wide text-lg leading-relaxed text-ink-muted">
              {territories.body}
            </p>
          </div>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
            {TERRITORIES.map((territory) => (
              <li key={territory.id} className="flex flex-col gap-2 bg-paper p-5 sm:p-6">
                <h3 className="text-[0.9375rem] font-semibold text-ink">{territory.name}</h3>
                <p className="font-mono text-sm text-ink-muted" data-numeric>
                  {territory.activity}
                </p>
                <p className="text-sm text-ink-faint">{territory.start}</p>
              </li>
            ))}
          </ul>

          <p className="mt-4 font-mono text-xs text-ink-faint">{DATA_DISCLAIMER}</p>
        </Container>
      </section>

      {/* ── Depth ───────────────────────────────────────────────────── */}
      <section aria-labelledby="bh-depth" className="border-t border-edge py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4">
            <h2 id="bh-depth" className="font-display text-display-2 text-ink">
              {depth.heading}
            </h2>
            <p className="measure-wide text-lg leading-relaxed text-ink-muted">{depth.body}</p>
          </div>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-3">
            {DEPTH_LEVELS.map((level, i) => (
              <li key={level.id} className="flex flex-col gap-2 bg-paper p-6">
                <div className="flex items-baseline gap-3">
                  <span className="eyebrow text-ink-faint" data-numeric aria-hidden="true">
                    {`0${i + 1}`}
                  </span>
                  <span className="font-display text-lg text-ink">{level.label}</span>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{level.meaning}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Paths ───────────────────────────────────────────────────── */}
      <section aria-labelledby="bh-paths" className="border-t border-edge py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4">
            <h2 id="bh-paths" className="font-display text-display-2 text-ink">
              {paths.heading}
            </h2>
            <p className="measure-wide text-lg leading-relaxed text-ink-muted">{paths.body}</p>
          </div>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-4">
            {ALL_PATHS.map((path) => (
              <li key={path.id} className="flex flex-col gap-1.5 bg-paper p-6">
                <h3 className="text-[0.9375rem] font-semibold text-ink">{path.name}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{path.outcome}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── The invitation ──────────────────────────────────────────── */}
      <section aria-labelledby="bh-closing" className="border-t border-edge bg-surface py-16 sm:py-24">
        <Container width="narrow">
          <div className="flex flex-col items-start gap-5">
            <h2 id="bh-closing" className="font-display text-display-2 text-ink">
              {closing.heading}
            </h2>
            <p className="measure text-lg leading-relaxed text-ink-muted">{closing.body}</p>
            <Button asChild size="xl">
              <a href={closing.cta.href}>{closing.cta.label}</a>
            </Button>
          </div>
        </Container>
      </section>
    </article>
  );
}
