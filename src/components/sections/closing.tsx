"use client";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { CLOSING_SECTION } from "@/content/closing";
import { WAITLIST } from "@/content/waitlist";
import { WaitlistBlock } from "@/components/sections/waitlist-section";
import { capture } from "@/lib/analytics/client";

/**
 * The final conversion: the two pathways restated, then the email capture.
 * The form's first field is the goal, so the address is asked for only after
 * the visitor has picked a path.
 */
export function Closing() {
  return (
    <Section id="waitlist" tone="surface" ruled>
      <div className="flex flex-col gap-6">
        <p className="eyebrow text-apricot-ink">{CLOSING_SECTION.eyebrow}</p>
        <h2 className="font-display text-display-1 text-ink">
          {CLOSING_SECTION.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <a
              href={CLOSING_SECTION.primaryCta.href}
              onClick={() => capture("hero_cta_clicked", { cta: "primary" })}
            >
              {CLOSING_SECTION.primaryCta.label}
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a
              href={CLOSING_SECTION.secondaryCta.href}
              onClick={() => capture("leader_cta_clicked", { location: "closing" })}
            >
              {CLOSING_SECTION.secondaryCta.label}
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-16 border-t border-edge pt-12">
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-display-2 text-ink">{WAITLIST.heading}</h3>
          <p className="measure text-lg text-ink-muted">{WAITLIST.lead}</p>
        </div>
        <div className="mt-8 max-w-3xl">
          <WaitlistBlock />
        </div>
      </div>
    </Section>
  );
}
