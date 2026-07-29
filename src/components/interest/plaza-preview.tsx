"use client";

import { PLAZA_BUILDER } from "@/content/plaza-builder";
import { capture } from "@/lib/analytics/client";
import { getCommunity } from "@/lib/communities";
import { deriveCounts, type PreviewCounts } from "@/lib/preview/derive-counts";
import { useSelectedCommunities } from "@/lib/waitlist/selection-store";
import { Button } from "@/components/ui/button";

/**
 * The deterministic preview. Same selection, same numbers, every render —
 * a value that changed on re-render would read as the fabrication it is
 * (docs/00 R5). The "Product preview — illustrative" label is visible copy,
 * not a tooltip, for the same reason.
 */
export function PlazaPreview() {
  const selected = useSelectedCommunities();
  const counts = deriveCounts(selected);
  const hasSelection = selected.length > 0;

  return (
    <div className="rounded-card border border-edge bg-raised p-6 shadow-soft sm:p-8">
      {/* The arches: one per selected community, in its identity colour. */}
      <div aria-hidden="true" className="flex h-16 items-end gap-3">
        {hasSelection ? (
          selected.map((id) => {
            const community = getCommunity(id);
            return (
              <div
                key={id}
                className="w-12 rounded-t-full transition-[height] duration-300 ease-out sm:w-14"
                style={{ backgroundColor: community?.fill, height: "100%" }}
              />
            );
          })
        ) : (
          <div className="w-12 rounded-t-full border-2 border-dashed border-edge-strong sm:w-14" style={{ height: "100%" }} />
        )}
      </div>

      <div className="mt-6" aria-live="polite">
        {hasSelection ? (
          <>
            <p className="font-display text-heading-1 text-ink">
              {PLAZA_BUILDER.preview.heading}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
              {(Object.keys(PLAZA_BUILDER.preview.units) as (keyof PreviewCounts)[]).map(
                (unit) => (
                  <div key={unit} className="flex items-baseline gap-2">
                    <dt className="sr-only">{PLAZA_BUILDER.preview.units[unit]}</dt>
                    <dd className="font-display text-3xl font-bold text-ink tabular-nums">
                      {counts[unit]}
                    </dd>
                    <span aria-hidden="true" className="text-sm text-ink-muted">
                      {PLAZA_BUILDER.preview.units[unit]}
                    </span>
                  </div>
                ),
              )}
            </dl>
          </>
        ) : (
          <p className="text-lg text-ink-muted">{PLAZA_BUILDER.preview.emptyPrompt}</p>
        )}
      </div>

      {/* Honesty, visibly. */}
      <p className="mt-6 font-mono text-xs text-ink-faint">
        {PLAZA_BUILDER.preview.disclaimer}
      </p>

      <div className="mt-6">
        <Button asChild size="lg">
          <a
            href={PLAZA_BUILDER.cta.href}
            onClick={() =>
              capture("waitlist_started", {
                source: "interest_preview",
                prefilled: hasSelection,
              })
            }
          >
            {PLAZA_BUILDER.cta.label}
          </a>
        </Button>
      </div>
    </div>
  );
}
