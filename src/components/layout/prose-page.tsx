import { Container } from "./container";

/**
 * Layout for the policy pages.
 *
 * Deliberately plain: one column at reading width, no illustration, no motif.
 * These pages are read by people checking whether the claims on the home page
 * are true, and decorating them would work against that.
 */
export function ProsePage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  /** ISO date. Rendered as written — no relative "2 weeks ago" phrasing. */
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="py-20 sm:py-28">
      <Container width="narrow">
        <header className="flex flex-col gap-4 border-b border-edge pb-10">
          <p className="eyebrow text-apricot-ink">{eyebrow}</p>
          <h1 className="font-display text-display-1 text-ink">{title}</h1>
          <p className="text-sm text-ink-faint">
            Last updated{" "}
            <time dateTime={updated}>
              {new Date(`${updated}T00:00:00Z`).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </p>
        </header>

        <div className="flex flex-col gap-8 pt-10 text-base leading-relaxed text-ink-muted [&_a]:text-apricot-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_li]:pl-1 [&_strong]:text-ink [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </article>
  );
}

/** A titled block. Keeps heading-to-body spacing identical across all pages. */
export function ProseSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2>{heading}</h2>
      {children}
    </section>
  );
}
