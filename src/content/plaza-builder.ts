import { MAX_COMMUNITIES } from "@/lib/communities";

/**
 * District — Build your plaza (#plaza-builder). The interest selector and its
 * deterministic preview. Voice rules apply: imperative, concrete nouns, and
 * the preview is labelled as a preview in VISIBLE text — the numbers are
 * illustrative and pretending otherwise would spend the site's only asset,
 * credibility (docs/00 R5).
 */
export const PLAZA_BUILDER = {
  eyebrow: "Build your plaza",
  heading: "What would your plaza look like?",
  lead: `Pick up to ${MAX_COMMUNITIES} interests. See what could be waiting inside.`,

  /** Announced to screen readers as selection changes. */
  selectionStatus: (count: number) =>
    count === 0
      ? "Nothing selected yet."
      : `${count} of ${MAX_COMMUNITIES} interests selected.`,
  /** Announced when a fourth selection is attempted. */
  capNotice: `That's ${MAX_COMMUNITIES} — remove one to choose another.`,

  preview: {
    /** Visible label, not a tooltip. Honesty is load-bearing. */
    disclaimer: "Product preview — illustrative numbers",
    emptyPrompt: "Choose an interest to open the doors.",
    heading: "Your first week could hold",
    units: {
      people: "people to meet",
      projects: "projects underway",
      events: "events coming up",
      opportunities: "open opportunities",
    },
  },

  cta: { label: "Reserve your place", href: "#waitlist" },
} as const;
