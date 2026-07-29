import { cn } from "@/lib/utils";

/**
 * The mark is the centre of the plaza field: one identity, with paths arriving
 * from four directions. It is the smallest possible statement of the whole
 * metaphor, which is what a mark at 20px has to be.
 */
export function PlazaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55">
        <path d="M2 12h4.5" />
        <path d="M17.5 12H22" />
        <path d="M12 2v4.5" />
        <path d="M12 17.5V22" />
        <path d="M4.7 4.7l3.2 3.2" />
        <path d="M16.1 16.1l3.2 3.2" />
      </g>
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <PlazaMark className="size-6 text-accent-text" />
      <span className="font-display text-lg leading-none tracking-tight">Bitplaza</span>
    </span>
  );
}
