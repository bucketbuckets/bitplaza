"use client";

import { Section, SectionHeader } from "@/components/layout/section";
import { InterestSelector } from "@/components/interest/interest-selector";
import { PlazaPreview } from "@/components/interest/plaza-preview";
import { PLAZA_BUILDER } from "@/content/plaza-builder";

/**
 * District — Build your plaza (#plaza-builder). The interest selector and the
 * live preview, side by side on desktop so choosing and seeing are one motion,
 * stacked on mobile with the preview after the chips.
 */
export function PlazaBuilder() {
  return (
    <Section id="plaza-builder" tone="surface" ruled>
      <SectionHeader
        eyebrow={PLAZA_BUILDER.eyebrow}
        heading={PLAZA_BUILDER.heading}
        lead={PLAZA_BUILDER.lead}
      />

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14">
        <InterestSelector />
        <PlazaPreview />
      </div>
    </Section>
  );
}
