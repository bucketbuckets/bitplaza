import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Pill buttons, from the Blue Hour direction — the one soft shape in an
 * otherwise ruled, right-angled system, which is what keeps it from reading as
 * a dashboard.
 *
 * The `primary` fill inverts between themes by design: slate in daylight, lamp
 * gold at dusk. Both pairs are verified in tests/tokens.contrast.test.ts, so
 * this component never needs to know which theme is active.
 *
 * Minimum target is 44px tall at every size — the brief asks for mobile-first,
 * and a 32px pill fails a thumb regardless of how it looks in a mock.
 */
const button = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-pill font-medium",
    "whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform]",
    "duration-200 ease-plaza",
    "disabled:pointer-events-none disabled:opacity-55",
    "active:translate-y-px",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary shadow-soft hover:shadow-lamp",
        secondary: "border border-edge-strong text-ink hover:border-ink hover:bg-surface",
        ghost: "text-muted hover:bg-surface hover:text-ink",
        /** Reads as body text, behaves as a control. For inline affordances. */
        link: "h-auto rounded-none px-0 py-0 text-accent-text underline underline-offset-4 decoration-1 hover:decoration-2",
      },
      size: {
        sm: "min-h-11 px-4 text-sm",
        md: "min-h-12 px-5 text-[0.9375rem]",
        lg: "min-h-14 px-7 text-base",
      },
    },
    compoundVariants: [{ variant: "link", class: "min-h-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof button> & {
    /** Render as the child element — use for links that look like buttons. */
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(button({ variant, size }), className)} {...props} />;
}

export { button as buttonVariants };
