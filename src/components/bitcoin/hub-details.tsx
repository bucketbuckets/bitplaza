import { BITCOIN_HUB } from "@/content/bitcoin-hub";

/**
 * The three detail blocks of the Bitcoin Culture Hub — domains, depth levels,
 * paths — shared by the homepage section (#bitcoin) and the dedicated
 * /bitcoin page so the two can never drift. Server components, no motion;
 * callers wrap in <Reveal> where they want it.
 *
 * `headingLevel` exists because the same block sits under an h2 on the
 * homepage and under the h1 on /bitcoin — heading order is a §21 rule, not a
 * style preference.
 */

type HeadingTag = "h2" | "h3";
type SubTag = "h3" | "h4";

const SUB: Record<HeadingTag, SubTag> = { h2: "h3", h3: "h4" };

export function DomainsGrid({ cellTone = "paper" }: { cellTone?: "paper" | "raised" }) {
  const cell = cellTone === "paper" ? "bg-paper" : "bg-raised";
  return (
    <ul className="grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
      {BITCOIN_HUB.domains.map((domain) => (
        <li key={domain.id} className={`flex flex-col gap-1.5 p-5 sm:p-6 ${cell}`}>
          <h3 className="text-[0.9375rem] font-semibold text-ink">{domain.name}</h3>
          <p className="text-sm leading-relaxed text-ink-faint">{domain.scope}</p>
        </li>
      ))}
    </ul>
  );
}

export function DepthBlock({ headingLevel = "h3" }: { headingLevel?: HeadingTag }) {
  const Heading = headingLevel;
  return (
    <div className="flex flex-col gap-5">
      <Heading className="font-display text-2xl text-ink">{BITCOIN_HUB.depth.heading}</Heading>
      <p className="measure-wide text-[0.9375rem] leading-relaxed text-ink-muted">
        {BITCOIN_HUB.depth.body}
      </p>
      <ol className="grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-3">
        {BITCOIN_HUB.depth.levels.map((level, i) => (
          <li key={level.id} className="flex flex-col gap-2 bg-paper p-6">
            <div className="flex items-baseline gap-3">
              {/* Depth IS sequential, so a numeric marker encodes something
                  true here — unlike on the pillars, where it would not. */}
              <span className="eyebrow text-ink-faint" data-numeric aria-hidden="true">
                {`L${i + 1}`}
              </span>
              <span className="font-display text-lg text-ink">{level.label}</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">{level.meaning}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PathsBlock({ headingLevel = "h3" }: { headingLevel?: HeadingTag }) {
  const Heading = headingLevel;
  const Sub = SUB[headingLevel];
  return (
    <div className="flex flex-col gap-5">
      <Heading className="font-display text-2xl text-ink">{BITCOIN_HUB.paths.heading}</Heading>
      <p className="measure-wide text-[0.9375rem] leading-relaxed text-ink-muted">
        {BITCOIN_HUB.paths.body}
      </p>
      <ul className="grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
        {BITCOIN_HUB.paths.items.map((path) => (
          <li key={path.id} className="flex flex-col gap-1.5 bg-paper p-6">
            <Sub className="text-[0.9375rem] font-semibold text-ink">{path.name}</Sub>
            <p className="text-sm leading-relaxed text-ink-muted">
              <span className="text-ink-faint">Ends when — </span>
              {path.end}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
