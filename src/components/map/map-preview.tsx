"use client";

import { useId, useState } from "react";

import { TERRITORIES } from "@/content/hub-preview";
import { MAP_PREVIEW, PREVIEW_GOALS, type PreviewGoal } from "@/content/map-preview";
import { capture } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

/**
 * The hero's interactive product preview: choose a goal, the map responds.
 *
 * Entirely frontend-driven from structured mock data in
 * src/content/map-preview.ts, with the illustrative disclaimer in visible
 * text. The default state server-renders complete, so the preview reads
 * without JavaScript; interaction is enhancement, not requirement.
 *
 * Native radio inputs carry the goal choice: the browser gives arrow-key
 * movement and a single tab stop for free, which is exactly the roving
 * behavior a custom tablist would need JS to fake.
 */
export function MapPreview({ className }: { className?: string }) {
  const [goalId, setGoalId] = useState<string>(PREVIEW_GOALS[0].id);
  const groupName = useId();
  const goal: PreviewGoal = PREVIEW_GOALS.find((g) => g.id === goalId) ?? PREVIEW_GOALS[0];

  const choose = (next: PreviewGoal) => {
    setGoalId(next.id);
    capture("preview_engaged", {
      choice: next.id as "learn" | "build" | "meet" | "work",
    });
    // Choosing a goal selects its path — the preview is the one place a path
    // is genuinely selectable before launch.
    capture("path_selected", { path_id: next.pathId, location: "home" });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-card border border-edge bg-raised p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      {/* Goal selector. */}
      <fieldset>
        <legend className="text-sm font-semibold text-ink">{MAP_PREVIEW.label}</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {PREVIEW_GOALS.map((g) => (
            <label
              key={g.id}
              className={cn(
                "flex min-h-10 cursor-pointer items-center rounded-pill border-[1.5px] px-4 text-sm font-semibold transition-colors",
                g.id === goal.id
                  ? "border-ink bg-ink text-paper"
                  : "border-edge-strong text-ink-muted hover:border-ink hover:text-ink",
              )}
            >
              <input
                type="radio"
                name={groupName}
                value={g.id}
                checked={g.id === goal.id}
                onChange={() => choose(g)}
                className="sr-only"
              />
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* The map: territories as a compact field, one lit by the chosen goal. */}
      <div>
        <ul className="flex flex-wrap gap-1.5" aria-label="Territories of the Bitcoin map">
          {TERRITORIES.map((territory) => {
            const active = territory.id === goal.highlightedTerritory;
            return (
              <li
                key={territory.id}
                className={cn(
                  "rounded-sticker border px-2.5 py-1.5 text-[0.8125rem] leading-tight transition-colors duration-300",
                  active
                    ? "border-apricot bg-apricot font-semibold text-[#1a1310]"
                    : "border-edge bg-surface text-ink-muted",
                )}
              >
                {territory.name}
                {active ? <span className="sr-only"> (highlighted for this goal)</span> : null}
              </li>
            );
          })}
        </ul>
      </div>

      {/* What lights up: one person, one resource, one action. */}
      <ul className="flex flex-col divide-y divide-edge border-y border-edge" aria-live="polite">
        <PreviewRow kind="Person" primary={goal.person.role} secondary={goal.person.note} />
        <PreviewRow kind={goal.resource.kind} primary={goal.resource.name} secondary="On the map" />
        <PreviewRow kind={goal.action.kind} primary={goal.action.name} secondary="One click away" />
      </ul>

      {/* Your next step. */}
      <div className="rounded-field border border-edge bg-surface p-4">
        <p className="eyebrow text-apricot-ink">{MAP_PREVIEW.nextStepHeading}</p>
        <p className="mt-2 font-display text-lg leading-snug text-ink">{goal.nextStep.title}</p>
        <p className="mt-1 font-mono text-xs text-ink-faint" data-numeric>
          {goal.nextStep.meta}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{goal.nextStep.endsWhen}</p>
      </div>

      <p className="font-mono text-xs text-ink-faint">{MAP_PREVIEW.disclaimer}</p>
    </div>
  );
}

function PreviewRow({
  kind,
  primary,
  secondary,
}: {
  kind: string;
  primary: string;
  secondary: string;
}) {
  return (
    <li className="flex items-baseline gap-3 py-2.5">
      <span className="eyebrow w-24 shrink-0 text-ink-faint">{kind}</span>
      <span className="text-sm font-medium text-ink">{primary}</span>
      <span className="hidden text-sm text-ink-faint sm:inline">{secondary}</span>
    </li>
  );
}
