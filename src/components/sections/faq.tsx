"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/section";
import { FAQ, FAQ_SECTION } from "@/content/faq";
import { capture } from "@/lib/analytics/client";

/**
 * Radix Accordion rather than <details>, because it gives correct
 * `aria-expanded` / `aria-controls` wiring and arrow-key navigation between
 * headers for free. Native <details> announces as a disclosure but does not
 * relate the group.
 *
 * `type="multiple"` — closing the answer you are reading in order to check
 * another one is a small hostility, and there is no reason for it here.
 *
 * The analytics id is the stable `question.id`, never the question text, so
 * rewriting copy does not silently reset the metric.
 */
export function Faq() {
  return (
    <Section id="faq" width="narrow" ruled>
      <SectionHeader eyebrow={FAQ_SECTION.eyebrow} heading={FAQ_SECTION.heading} />

      <Accordion.Root
        type="multiple"
        className="mt-12 border-t border-edge"
        onValueChange={(open) => {
          // Radix reports the full open set. Only the newest entry is a
          // genuine "opened" event; reporting the whole set would double-count
          // every question already on screen.
          const latest = open.at(-1);
          if (latest) capture("faq_opened", { question_id: latest });
        }}
      >
        {FAQ.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="border-b border-edge">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-start justify-between gap-6 py-6 text-left">
                <span className="font-display text-lg leading-snug text-ink sm:text-xl">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-pill border border-edge-strong text-ink-muted transition-transform duration-300 ease-plaza group-data-[state=open]:rotate-45"
                >
                  <Plus className="size-4" strokeWidth={1.75} />
                </span>
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[faq-up_240ms_ease] data-[state=open]:animate-[faq-down_240ms_ease]">
              <p className="pr-13 pb-7 leading-relaxed text-ink-muted">{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Section>
  );
}
