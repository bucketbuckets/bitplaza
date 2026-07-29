import { COMMUNITIES } from "@/lib/communities";
import { cn } from "@/lib/utils";

/**
 * The colonnade — the hero's plaza. design.md §5, §16 district 1.
 *
 * A row of arches at varying heights, each one a doorway into a different
 * community, with Regulars standing at the thresholds and artifacts drifting
 * between them.
 *
 * This is pure SVG in a server component: no canvas, no JavaScript, no
 * animation loop. It replaces the previous thin-line network canvas, which was
 * both the prohibited motif (design.md §23) and 300 lines of client code to
 * draw something that never needed to be interactive.
 *
 * Ambient drift is CSS-only and defined in globals.css, so it costs nothing and
 * stops dead under reduced motion.
 */

/** Arch heights as a fraction of the tallest. Varying height stops it reading
 *  as a barcode; these are hand-set rather than generated.
 *
 *  Proportions matter more than they look like they should. At 1 : 3.5 an arch
 *  reads as a rounded rectangle — the semicircular top stops being legible as a
 *  top. The tallest here is 1 : 1.7 and the shortest 1 : 1.0, which keeps every
 *  one of them recognisably a doorway. */
const ARCHES = [
  { id: "bitcoin", h: 0.88, drift: "a" },
  { id: "music", h: 0.64, drift: "b" },
  { id: "design", h: 1.0, drift: "c" },
  { id: "opensource", h: 0.76, drift: "b" },
  { id: "local", h: 0.58, drift: "a" },
] as const;

function archPath(w: number, h: number) {
  const r = w / 2;
  // Flat base, straight sides, semicircular top, open at the bottom — §10.3.
  return `M0 ${h} L0 ${r} A ${r} ${r} 0 0 1 ${w} ${r} L ${w} ${h}`;
}

export function Colonnade({ className }: { className?: string }) {
  const unit = 152;
  const gap = 28;
  const maxH = 262; // tallest arch is 1 : 1.72 — a doorway, not a tunnel
  const totalW = ARCHES.length * unit + (ARCHES.length - 1) * gap;

  return (
    <div className={cn("relative w-full", className)} aria-hidden="true">
      <svg
        viewBox={`0 0 ${totalW} ${maxH}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMax meet"
        role="presentation"
      >
        {ARCHES.map((arch, i) => {
          const community = COMMUNITIES.find((c) => c.id === arch.id);
          if (!community) return null;
          const h = maxH * arch.h;
          const x = i * (unit + gap);
          const y = maxH - h;

          return (
            <g key={arch.id} data-drift={arch.drift} style={{ transformOrigin: `${x + unit / 2}px ${maxH}px` }}>
              {/* The doorway itself, filled with the community's colour at low
                  opacity — lit from within rather than painted. */}
              <g transform={`translate(${x} ${y})`}>
                <path
                  d={`${archPath(unit, h)} Z`}
                  fill={community.fill}
                  opacity="0.14"
                />
                <path
                  d={archPath(unit, h)}
                  fill="none"
                  stroke={community.fill}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* A Regular at the threshold: the arch silhouette, small. */}
                <g transform={`translate(${unit / 2 - 15} ${h - 52})`}>
                  <path
                    d={`${archPath(30, 52)} Z`}
                    fill={community.fill}
                  />
                  <circle cx="10" cy="17" r="2.6" fill="var(--bp-paper)" />
                  <circle cx="20" cy="17" r="2.6" fill="var(--bp-paper)" />
                </g>
              </g>
            </g>
          );
        })}

        {/* Artifacts drifting between the arches — a ticket, a badge, a message.
            Small, off-grid, and at least one breaking the frame. */}
        <g data-drift="c" opacity="0.9">
          <rect x="118" y="64" width="46" height="30" rx="4" fill="var(--bp-citron)" transform="rotate(-8 141 79)" />
        </g>
        <g data-drift="a">
          <circle cx="352" cy="98" r="15" fill="var(--bp-apricot)" />
        </g>
        <g data-drift="b">
          <rect x="470" y="130" width="52" height="34" rx="17" fill="var(--bp-mint)" transform="rotate(6 496 147)" />
        </g>
      </svg>
    </div>
  );
}
