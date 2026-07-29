import type { Metadata } from "next";

import { ApplicationForm } from "@/components/community/application-form";
import { Container } from "@/components/layout/container";
import { COMMUNITIES_PAGE } from "@/content/communities-page";
import { LEADERS_SECTION } from "@/content/leaders";

/**
 * /communities — the conversion page for community leaders. Benefits first,
 * then the application (#apply). The four operational benefits are shared
 * with the homepage section so the two cannot drift.
 */

export const metadata: Metadata = {
  title: COMMUNITIES_PAGE.meta.title,
  description: COMMUNITIES_PAGE.meta.description,
};

export default function CommunitiesPage() {
  return (
    <article className="py-20 sm:py-28">
      <Container width="narrow">
        <header className="flex flex-col gap-4">
          <p className="eyebrow text-apricot-ink">{COMMUNITIES_PAGE.eyebrow}</p>
          <h1 className="font-display text-display-1 text-ink">
            {COMMUNITIES_PAGE.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="measure text-body-lg text-ink-muted">{COMMUNITIES_PAGE.lead}</p>
        </header>

        <ul className="mt-12 grid gap-x-10 sm:grid-cols-2">
          {LEADERS_SECTION.benefits.map((benefit) => (
            <li key={benefit.id} className="flex flex-col gap-1.5 border-t border-edge py-6">
              <h2 className="text-base font-semibold text-ink">{benefit.title}</h2>
              <p className="text-sm leading-relaxed text-ink-muted">{benefit.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 border-l-2 border-apricot pl-4 text-ink-muted">
          {COMMUNITIES_PAGE.note}
        </p>

        <div id="apply" className="mt-14 scroll-mt-24 border-t border-edge pt-12">
          <h2 className="font-display text-display-2 text-ink">
            {COMMUNITIES_PAGE.form.heading}
          </h2>
          <p className="mt-3 text-ink-muted">{COMMUNITIES_PAGE.form.intro}</p>
          <div className="mt-8">
            <ApplicationForm />
          </div>
        </div>
      </Container>
    </article>
  );
}
