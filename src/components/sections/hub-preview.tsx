"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import {
  DEPTH_LEVELS,
  HUB_PREVIEW_SECTION,
  TERRITORIES,
} from "@/content/hub-preview";
import { capture } from "@/lib/analytics/client";

/**
 * The Bitcoin map preview: territories with visible evidence of activity and
 * a marked way in, not a static taxonomy. Activity lines are illustrative and
 * the disclaimer says so in visible text.
 *
 * Layout: header, depth legend and action on the left; the territory list on
 * the right. Opening a territory reveals its activity and starting point and
 * fires `territory_opened` with the stable id.
 */
export function HubPreview() {
  return (
    <Section id="bitcoin" ruled width="wide">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex flex-col items-start gap-5 lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow flex items-center gap-2.5 text-c-bitcoin-text">
            <span aria-hidden="true" className="inline-block size-2 rounded-full bg-c-bitcoin" />
            {HUB_PREVIEW_SECTION.eyebrow}
          </p>
          <h2 className="font-display text-display-2 text-ink">
            {HUB_PREVIEW_SECTION.heading}
          </h2>
          <p className="measure text-lg leading-relaxed text-ink-muted">
            {HUB_PREVIEW_SECTION.lead}
          </p>

          {/* One depth system, everywhere. */}
          <dl className="flex flex-col gap-2.5 border-l-2 border-edge pl-4">
            {DEPTH_LEVELS.map((level) => (
              <div key={level.id} className="flex items-baseline gap-3">
                <dt className="w-16 shrink-0 font-mono text-xs font-semibold tracking-[0.08em] text-ink uppercase">
                  {level.label}
                </dt>
                <dd className="text-sm text-ink-muted">{level.meaning}</dd>
              </div>
            ))}
          </dl>

          <Button asChild size="lg" className="mt-2">
            <a
              href={HUB_PREVIEW_SECTION.cta.href}
              onClick={() => capture("hero_cta_clicked", { cta: "primary" })}
            >
              {HUB_PREVIEW_SECTION.cta.label}
            </a>
          </Button>
        </div>

        <div>
          <Accordion.Root
            type="multiple"
            className="border-t border-edge"
            onValueChange={(open) => {
              const latest = open.at(-1);
              if (latest) capture("territory_opened", { territory_id: latest, location: "home" });
            }}
          >
            {TERRITORIES.map((territory) => (
              <Accordion.Item
                key={territory.id}
                value={territory.id}
                className="border-b border-edge"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-4 text-left">
                    <span className="font-display text-lg text-ink">{territory.name}</span>
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-pill border border-edge-strong text-ink-muted transition-transform duration-300 group-data-[state=open]:rotate-45"
                    >
                      <Plus className="size-4" strokeWidth={1.75} />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[faq-up_240ms_ease] data-[state=open]:animate-[faq-down_240ms_ease]">
                  <div className="flex flex-col gap-1.5 pb-5">
                    <p className="font-mono text-sm text-ink-muted" data-numeric>
                      {territory.activity}
                    </p>
                    <p className="text-sm text-ink-faint">{territory.start}</p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </Section>
  );
}
