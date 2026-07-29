"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { COMMUNITY_BUILDERS } from "@/content/community-builders";
import { capture } from "@/lib/analytics/client";

/**
 * Addressed to a different reader than the rest of the page, so it is given a
 * different ground and its own full band — a leader scrolling past should feel
 * the page turn toward them rather than find a paragraph aimed at someone else.
 */
export function CommunityBuilders() {
  return (
    <section id="for-builders" className="border-t border-rule bg-surface py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal className="flex flex-col gap-5">
            <p className="eyebrow text-accent-text">{COMMUNITY_BUILDERS.eyebrow}</p>
            <h2 className="font-display text-display-sm text-ink">{COMMUNITY_BUILDERS.heading}</h2>
            <p className="measure text-lg leading-relaxed text-muted">
              {COMMUNITY_BUILDERS.lead}
            </p>

            <div className="mt-3 flex flex-col gap-4">
              <Button asChild size="lg" className="self-start">
                <Link
                  href={COMMUNITY_BUILDERS.cta.href}
                  onClick={() => capture("community_application_started", {})}
                >
                  {COMMUNITY_BUILDERS.cta.label}
                  <ArrowRight className="size-4" aria-hidden="true" strokeWidth={2} />
                </Link>
              </Button>
              <p className="measure text-sm leading-relaxed text-faint">
                {COMMUNITY_BUILDERS.cta.note}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <ul className="flex flex-col gap-px overflow-hidden rounded-card border border-edge bg-edge">
              {COMMUNITY_BUILDERS.points.map((point) => (
                <li key={point.id} className="flex flex-col gap-2 bg-surface p-7 sm:p-8">
                  <h3 className="font-display text-xl text-ink">{point.title}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-muted">{point.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
