import type { Metadata } from "next";

import { DepthBlock, DomainsGrid, PathsBlock } from "@/components/bitcoin/hub-details";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { BITCOIN_HUB } from "@/content/bitcoin-hub";
import { BITCOIN_HUB_PAGE } from "@/content/bitcoin-hub-page";

/**
 * /bitcoin — the Bitcoin Culture Hub's page: the doorway Bitplaza sends
 * traffic through into the first plaza. design.md §16 district 7: tangible
 * and immediately explorable; Bitcoin's orange leads HERE and nowhere else,
 * as marks and accents — never as a ground behind text (it fails contrast
 * with both ink roles at text sizes below display).
 *
 * Copy comes from content/bitcoin-hub{,-page}.ts. The owner's specific launch
 * material lands in those files, not here.
 */

export const metadata: Metadata = {
  title: BITCOIN_HUB_PAGE.meta.title,
  description: BITCOIN_HUB_PAGE.meta.description,
};

const bitcoinText = "var(--color-c-bitcoin-text)";

export default function BitcoinHubPage() {
  const { hero, inside, closing } = BITCOIN_HUB_PAGE;

  return (
    <article>
      {/* ── Doorway ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-edge py-20 sm:py-28">
        <div className="grain pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <Container>
          <div className="flex flex-col gap-5">
            <p className="eyebrow flex items-center gap-2.5" style={{ color: bitcoinText }}>
              <span aria-hidden="true" className="inline-block size-2 rounded-full bg-c-bitcoin" />
              {hero.eyebrow}
            </p>

            <h1 className="font-display text-display-1 text-ink">{hero.heading}</h1>

            <p className="font-display text-xl sm:text-2xl" style={{ color: bitcoinText }}>
              {hero.tagline}
            </p>

            <p className="measure-wide text-body-lg text-ink-muted">{hero.supporting}</p>

            <p className="font-mono text-sm text-ink-faint">{hero.status}</p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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

      {/* ── What the map holds ──────────────────────────────────────── */}
      <section aria-labelledby="bh-inside" className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4">
            <h2 id="bh-inside" className="font-display text-display-2 text-ink">
              {inside.heading}
            </h2>
            <p className="measure-wide text-lg leading-relaxed text-ink-muted">{inside.body}</p>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3">
            {inside.categories.map((category) => (
              <li
                key={category.id}
                className="flex min-h-12 items-center gap-3 rounded-pill border-[1.5px] border-edge-strong px-5 py-2"
              >
                <span className="font-semibold text-ink">{category.name}</span>
                <span className="text-sm text-ink-muted">{category.scope}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── The twelve domains ──────────────────────────────────────── */}
      <section aria-labelledby="bh-domains" className="border-t border-edge py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4">
            <h2 id="bh-domains" className="font-display text-display-2 text-ink">
              Twelve territories
            </h2>
            <p className="measure-wide text-lg leading-relaxed text-ink-muted">
              {BITCOIN_HUB.lead}
            </p>
          </div>
          <div className="mt-10">
            <DomainsGrid />
          </div>
        </Container>
      </section>

      {/* ── Depth and paths ─────────────────────────────────────────── */}
      <section aria-label={BITCOIN_HUB.depth.heading} className="border-t border-edge py-16 sm:py-24">
        <Container>
          <DepthBlock headingLevel="h2" />
          <div className="mt-16">
            <PathsBlock headingLevel="h2" />
          </div>
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
