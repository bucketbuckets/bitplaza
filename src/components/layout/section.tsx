import { Container } from "./container";
import { cn } from "@/lib/utils";

type SectionProps = React.ComponentPropsWithoutRef<"section"> & {
  /** Anchor target. Also what the skip-link and nav point at. */
  id: string;
  /** `surface` lifts a band off the page ground; `ground` sits flush. */
  tone?: "ground" | "surface";
  width?: "default" | "wide" | "narrow";
  /** Rendered as a hairline above the section — the Wayfinding rule. */
  ruled?: boolean;
};

/**
 * A landing-page band.
 *
 * Vertical rhythm lives here and nowhere else. Sections are laid out with `gap`
 * by their parent rather than carrying their own margins, so nothing collapses
 * or doubles when the order changes — which it will, more than once.
 */
export function Section({
  id,
  tone = "ground",
  width = "default",
  ruled = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-28 lg:py-36",
        tone === "surface" && "bg-surface",
        ruled && "border-t border-rule",
        className,
      )}
      {...props}
    >
      <Container width={width}>{children}</Container>
    </section>
  );
}

/**
 * The standard section opening: eyebrow, heading, optional lead paragraph.
 * Every section uses this so the type hierarchy cannot drift band to band.
 */
export function SectionHeader({
  eyebrow,
  heading,
  lead,
  align = "start",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  lead?: React.ReactNode;
  align?: "start" | "center";
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow text-accent-text">{eyebrow}</p> : null}
      <Heading className="font-display text-display-sm text-ink measure-wide">{heading}</Heading>
      {lead ? <p className="measure text-lg leading-relaxed text-muted">{lead}</p> : null}
    </div>
  );
}
