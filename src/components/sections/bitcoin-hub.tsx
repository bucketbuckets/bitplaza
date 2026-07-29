import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
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
 */
export function BitcoinHub() {
  return (
    <section id="bitcoin" className="border-t border-rule py-20 sm:py-28 lg:py-36">
      <Container>
        <Reveal className="flex flex-col gap-4">
          <p className="eyebrow flex items-center gap-2.5 text-accent-text">
            <span
              aria-hidden="true"
              className="inline-block size-2 rounded-full bg-c-bitcoin"
            />
            {BITCOIN_HUB.eyebrow}
          </p>
          <h2 className="font-display text-display-sm text-ink">{BITCOIN_HUB.heading}</h2>
          <p className="font-display text-xl text-accent-text sm:text-2xl">
            {BITCOIN_HUB.tagline}
          </p>
          <p className="measure-wide text-lg leading-relaxed text-muted">{BITCOIN_HUB.lead}</p>
        </Reveal>

        {/* Twelve domains. Dense on purpose — the density is the argument. */}
        <Reveal className="mt-14">
          <ul className="grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
            {BITCOIN_HUB.domains.map((domain) => (
              <li key={domain.id} className="flex flex-col gap-1.5 bg-ground p-5 sm:p-6">
                <h3 className="text-[0.9375rem] font-semibold text-ink">{domain.name}</h3>
                <p className="text-sm leading-relaxed text-faint">{domain.scope}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Depth and paths each run full width rather than sitting side by
            side. Three items beside six left roughly a screen of dead space in
            the shorter column, and the depth levels are a progression — reading
            them left to right says something a stacked list does not. */}
        <Reveal className="mt-16 flex flex-col gap-5">
          <h3 className="font-display text-2xl text-ink">{BITCOIN_HUB.depth.heading}</h3>
          <p className="measure-wide text-[0.9375rem] leading-relaxed text-muted">
            {BITCOIN_HUB.depth.body}
          </p>
          <ol className="grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-3">
            {BITCOIN_HUB.depth.levels.map((level, i) => (
              <li key={level.id} className="flex flex-col gap-2 bg-ground p-6">
                <div className="flex items-baseline gap-3">
                  {/* Depth IS sequential, so a numeric marker encodes something
                      true here — unlike on the pillars, where it would not. */}
                  <span className="eyebrow text-faint" data-numeric aria-hidden="true">
                    {`L${i + 1}`}
                  </span>
                  <span className="font-display text-lg text-ink">{level.label}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted">{level.meaning}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-14 flex flex-col gap-5">
          <h3 className="font-display text-2xl text-ink">{BITCOIN_HUB.paths.heading}</h3>
          <p className="measure-wide text-[0.9375rem] leading-relaxed text-muted">
            {BITCOIN_HUB.paths.body}
          </p>
          <ul className="grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
            {BITCOIN_HUB.paths.items.map((path) => (
              <li key={path.id} className="flex flex-col gap-1.5 bg-ground p-6">
                <h4 className="text-[0.9375rem] font-semibold text-ink">{path.name}</h4>
                <p className="text-sm leading-relaxed text-muted">
                  <span className="text-faint">Ends when — </span>
                  {path.end}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <p className="measure-wide text-lg leading-relaxed text-muted">{BITCOIN_HUB.closing}</p>
        </Reveal>
      </Container>
    </section>
  );
}
