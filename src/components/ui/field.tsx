import { cn } from "@/lib/utils";

/**
 * Form primitives. design.md §18 "Form": inputs 52px tall at --radius-card,
 * 1.5px edge border that darkens on hover, labels ALWAYS visible (never
 * placeholder-only), 16px minimum font so iOS does not zoom, errors wired via
 * aria-describedby + aria-invalid, required marked in text as well as symbol.
 * Focus comes from the global :focus-visible rule. Forms do not animate.
 *
 * Native <select> and <input type="checkbox"> on purpose: for a one-shot
 * marketing form the platform widgets are the most robust and accessible
 * option, and they cost zero JS.
 */

const fieldShell = [
  "w-full rounded-card border-[1.5px] border-edge bg-raised text-base text-ink",
  "placeholder:text-ink-faint hover:border-edge-strong",
  "aria-[invalid=true]:border-danger",
  "disabled:pointer-events-none disabled:opacity-55",
];

export function Label({
  className,
  optional,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"label"> & { optional?: string }) {
  return (
    <label className={cn("text-sm font-semibold text-ink", className)} {...props}>
      {children}
      {optional ? <span className="ml-2 font-normal text-ink-faint">({optional})</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: React.ComponentPropsWithoutRef<"input">) {
  return <input className={cn(fieldShell, "h-13 px-4", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      className={cn(fieldShell, "min-h-28 resize-y px-4 py-3 leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: React.ComponentPropsWithoutRef<"select">) {
  return (
    <div className="relative">
      <select className={cn(fieldShell, "h-13 appearance-none px-4 pr-10", className)} {...props}>
        {children}
      </select>
      {/* The affordance a native select loses to appearance-none. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 6l4.5 4.5L12.5 6" />
      </svg>
    </div>
  );
}

export function Checkbox({ className, ...props }: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "mt-0.5 size-5 shrink-0 rounded-[6px] border-[1.5px] border-edge-strong",
        "accent-[color:var(--color-apricot)]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * One field error. Rendered in place (aria-describedby points here) — the
 * region itself is not a live region because the error summary owns the
 * announcement on submit.
 */
export function FieldError({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <p id={id} className="text-sm font-medium text-danger">
      {children}
    </p>
  );
}
