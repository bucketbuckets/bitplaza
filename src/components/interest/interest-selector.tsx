"use client";

import { useRef, useState } from "react";

import {
  COMMUNITIES,
  MAX_COMMUNITIES,
  STATUS_LABEL,
  type CommunityId,
} from "@/lib/communities";
import { PLAZA_BUILDER } from "@/content/plaza-builder";
import { capture } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";
import {
  toggleCommunity,
  useSelectedCommunities,
} from "@/lib/waitlist/selection-store";

/**
 * The ten community chips, max three selected.
 *
 * Keyboard model: one tab stop for the whole group (roving tabindex), arrows
 * move between chips, Space/Enter toggles — the ARIA toolbar pattern, which is
 * what keeps a ten-button group from being ten tab presses on the way to the
 * form. Each chip is a real <button> with `aria-pressed`; a live region
 * announces "2 of 3 selected" and the cap notice, because a sighted user sees
 * the count change and a screen-reader user must hear the same fact.
 *
 * Colour: a selected chip takes its community's fill with the MEASURED on-fill
 * ink/white (four take ink, six take white — communities.ts); an unselected
 * chip shows the community as themed TEXT. Status is never colour alone — the
 * label rides along on every chip.
 */
export function InterestSelector() {
  const selected = useSelectedCommunities();
  const [focusIndex, setFocusIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const moveFocus = (next: number) => {
    const count = COMMUNITIES.length;
    const index = (next + count) % count;
    setFocusIndex(index);
    buttonsRef.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveFocus(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveFocus(index - 1);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(0);
        break;
      case "End":
        event.preventDefault();
        moveFocus(COMMUNITIES.length - 1);
        break;
    }
  };

  const onToggle = (id: CommunityId) => {
    const action = toggleCommunity(id);

    if (action === "blocked") {
      setNotice(PLAZA_BUILDER.capNotice);
      return;
    }

    const count = action === "add" ? selected.length + 1 : selected.length - 1;
    setNotice(PLAZA_BUILDER.selectionStatus(count));
    capture("interest_selected", { community: id, action, selected_count: count });

    if (action === "add" && count === MAX_COMMUNITIES) {
      capture("interest_preview_completed", {
        communities: [...selected, id] as CommunityId[],
      });
    }
  };

  return (
    <div>
      <div
        role="group"
        aria-label={PLAZA_BUILDER.heading}
        className="flex flex-wrap gap-3"
      >
        {COMMUNITIES.map((community, index) => {
          const isSelected = selected.includes(community.id);
          return (
            <button
              key={community.id}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              type="button"
              tabIndex={index === focusIndex ? 0 : -1}
              aria-pressed={isSelected}
              onKeyDown={(event) => onKeyDown(event, index)}
              onFocus={() => setFocusIndex(index)}
              onClick={() => onToggle(community.id)}
              className={cn(
                "inline-flex min-h-12 items-center gap-2.5 rounded-pill border-[1.5px] px-5 py-2",
                "font-semibold transition-[background-color,color,border-color,transform] duration-150",
                isSelected
                  ? "border-transparent shadow-press"
                  : "border-edge-strong bg-transparent hover:border-ink",
              )}
              style={
                isSelected
                  ? { backgroundColor: community.fill, color: community.onFill }
                  : { color: `var(--color-c-${community.id}-text)` }
              }
            >
              <span>{community.label}</span>
              <span
                className={cn(
                  "text-[0.6875rem] font-medium tracking-wide uppercase",
                  !isSelected && "text-ink-faint",
                )}
                style={isSelected ? { color: community.onFill, opacity: 0.75 } : undefined}
              >
                {STATUS_LABEL[community.status]}
              </span>
            </button>
          );
        })}
      </div>

      {/* One live region for count and cap notice alike. Polite: a chip toggle
          is never urgent enough to interrupt speech mid-sentence. */}
      <p aria-live="polite" className="mt-4 min-h-6 text-sm text-ink-muted">
        {notice}
      </p>
    </div>
  );
}
