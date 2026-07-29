"use client";

import { useState } from "react";

import { Section, SectionHeader } from "@/components/layout/section";
import { SuccessState } from "@/components/waitlist/success-state";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WAITLIST } from "@/content/waitlist";
import type { WaitlistSuccess } from "@/lib/waitlist/types";

/**
 * District — the waitlist (#waitlist). The moment of commitment: the form,
 * then the celebration-and-share state in its place. Narrow width — a form
 * that spans a wide container reads as paperwork.
 */
export function WaitlistSection() {
  const [result, setResult] = useState<WaitlistSuccess | null>(null);

  return (
    <Section id="waitlist" width="narrow" ruled>
      {result ? (
        <SuccessState result={result} />
      ) : (
        <>
          <SectionHeader
            eyebrow={WAITLIST.eyebrow}
            heading={WAITLIST.heading}
            lead={WAITLIST.lead}
          />
          <div className="mt-12">
            <WaitlistForm onSuccess={setResult} />
          </div>
        </>
      )}
    </Section>
  );
}
