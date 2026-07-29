import type { Metadata } from "next";

import { ApplicationForm } from "@/components/community/application-form";
import { Container } from "@/components/layout/container";
import { COMMUNITY_BUILDERS } from "@/content/community-builders";
import { COMMUNITY_BUILDERS_PAGE } from "@/content/community-builders-page";

/**
 * /for-community-builders — design.md §17 "Start a plaza": a workshop. Warm,
 * form-led, characters only in the header (we have none yet, so none at all).
 * The three points from the homepage section repeat here in compressed form
 * because most arrivals come from outside the homepage funnel.
 */

export const metadata: Metadata = {
  title: COMMUNITY_BUILDERS_PAGE.meta.title,
  description: COMMUNITY_BUILDERS_PAGE.meta.description,
};

export default function CommunityBuildersPage() {
  return (
    <article className="py-20 sm:py-28">
      <Container width="narrow">
        <header className="flex flex-col gap-4">
          <p className="eyebrow text-apricot-ink">{COMMUNITY_BUILDERS_PAGE.eyebrow}</p>
          <h1 className="font-display text-display-1 text-ink">
            {COMMUNITY_BUILDERS_PAGE.heading}
          </h1>
          <p className="measure text-body-lg text-ink-muted">{COMMUNITY_BUILDERS_PAGE.lead}</p>
        </header>

        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {COMMUNITY_BUILDERS.points.map((point) => (
            <li key={point.id} className="rounded-card border border-edge bg-surface p-5">
              <h2 className="font-display text-lg text-ink">{point.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{point.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 border-l-2 border-apricot pl-4 text-ink-muted">
          {COMMUNITY_BUILDERS_PAGE.honesty}
        </p>

        <div className="mt-14 border-t border-edge pt-12">
          <h2 className="font-display text-display-2 text-ink">
            {COMMUNITY_BUILDERS_PAGE.form.heading}
          </h2>
          <div className="mt-8">
            <ApplicationForm />
          </div>
        </div>
      </Container>
    </article>
  );
}
