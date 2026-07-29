import { DepthBlock, DomainsGrid, PathsBlock } from "@/components/bitcoin/hub-details";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { BITCOIN_HUB } from "@/content/bitcoin-hub";

/**
 * The first plaza.
 *
 * The only section that carries Bitcoin's colour token, and it appears once, as
 * a small mark beside the name — never as a background, a gradient, or a border
 * on anything else. That restraint is the whole point: Bitcoin is present, and
 * it is one of ten.
 *
 * The twelve domains are shown in full rather than summarised. Specificity is
 * what makes this section credible to the reader who knows the subject, and a
 * vague gesture at "twelve territories" would read as though the taxonomy did
 * not exist yet. It does — see bch/verticals/bitcoin.md §2.
 *
 * The detail blocks live in components/bitcoin/hub-details.tsx, shared with
 * /bitcoin — the hub's own page, which this section's CTA routes into.
 */
export function BitcoinHub() {
  return (
    <section id="bitcoin" className="border-t border-edge py-20 sm:py-28 lg:py-36">
      <Container>
        <Reveal className="flex flex-col gap-4">
          <p className="eyebrow flex items-center gap-2.5 text-apricot-ink">
            <span
              aria-hidden="true"
              className="inline-block size-2 rounded-full bg-c-bitcoin"
            />
            {BITCOIN_HUB.eyebrow}
          </p>
          <h2 className="font-display text-display-2 text-ink">{BITCOIN_HUB.heading}</h2>
          <p className="font-display text-xl text-apricot-ink sm:text-2xl">
            {BITCOIN_HUB.tagline}
          </p>
          <p className="measure-wide text-lg leading-relaxed text-ink-muted">{BITCOIN_HUB.lead}</p>
        </Reveal>

        {/* Twelve domains. Dense on purpose — the density is the argument. */}
        <Reveal className="mt-14">
          <DomainsGrid />
        </Reveal>

        {/* Depth and paths each run full width rather than sitting side by
            side. Three items beside six left roughly a screen of dead space in
            the shorter column, and the depth levels are a progression — reading
            them left to right says something a stacked list does not. */}
        <Reveal className="mt-16">
          <DepthBlock />
        </Reveal>

        <Reveal className="mt-14">
          <PathsBlock />
        </Reveal>

        <Reveal className="mt-14 flex flex-col items-start gap-6">
          <p className="measure-wide text-lg leading-relaxed text-ink-muted">{BITCOIN_HUB.closing}</p>
          <Button asChild size="lg">
            <a href={BITCOIN_HUB.cta.href}>{BITCOIN_HUB.cta.label}</a>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
