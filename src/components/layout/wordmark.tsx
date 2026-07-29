import { cn } from "@/lib/utils";

/**
 * The arch — the governing motif of the entire identity (design.md §5, §10).
 *
 * A doorway: flat base, straight sides, fully semicircular top, open at the
 * bottom. It is the logo, the plaza portal shape, the mascot silhouette, the map
 * pin and the loading indicator. Everything in the system either is an arch,
 * sits under one, or passes through one.
 *
 * Chosen over a node graph because an arch is a THRESHOLD, and entering
 * somewhere is the product's promise. A network diagram describes the
 * engineering, not the experience.
 *
 * Construction, per §10.3:
 *   · width : height ≈ 1 : 1.15 — a doorway, not a tunnel
 *   · the base is OPEN. A closed arch reads as a tombstone.
 *   · the optional dot at the threshold is a person standing in the doorway
 */
export function PlazaMark({
  className,
  /** Renders the figure at the threshold. Used for profile badges. */
  occupied = true,
}: {
  className?: string;
  occupied?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 20 23"
      className={cn("size-6", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Outer arch. Drawn as a stroked path so the doorway reads as an opening
          rather than a filled blob at any size. */}
      <path
        d="M2.6 22V10.4a7.4 7.4 0 0 1 14.8 0V22"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {occupied ? <circle cx="10" cy="14.6" r="2.9" fill="currentColor" /> : null}
    </svg>
  );
}

/**
 * A colonnade — three to five arches at varying heights.
 *
 * The secondary lockup. Used as a section marker, in the loading state, and at
 * architectural scale in the hero.
 */
export function Colonnade({
  className,
  count = 3,
}: {
  className?: string;
  count?: 3 | 4 | 5;
}) {
  const heights = [0.82, 1, 0.9, 0.72, 0.95].slice(0, count);
  return (
    <span className={cn("inline-flex items-end gap-1", className)} aria-hidden="true">
      {heights.map((h, i) => (
        <PlazaMark
          key={i}
          occupied={false}
          className="size-5"
          // Varying height is what stops a colonnade reading as a barcode.
          {...{ style: { height: `${h * 100}%`, width: "auto" } }}
        />
      ))}
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <PlazaMark className="size-7 text-apricot" />
      {/* Expanded width is the typographic signature — the wordmark should read
          as signage, not as a headline. */}
      <span
        className="font-display text-[1.35rem] leading-none text-ink"
        style={{ fontStretch: "110%", fontWeight: 800, letterSpacing: "-0.03em" }}
      >
        Bitplaza
      </span>
    </span>
  );
}
