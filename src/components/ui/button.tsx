import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Buttons. design.md §18.
 *
 * Pills, with a PRINT OFFSET shadow rather than a soft glow — a hard 2px drop
 * that deepens on hover and collapses on press, so the control behaves like
 * something physical. That, plus the apricot fill, is the whole personality; the
 * geometry underneath stays exact. "The world is playful, the controls are
 * precise."
 *
 * The primary fill takes INK text and only ink text. White on apricot measures
 * 2.85:1 and fails at every size — tests/tokens.contrast.test.ts asserts it, so
 * a design calling for it will not survive review.
 *
 * Heights are 48–56px rather than the 44px minimum: 44 is the floor for a target
 * to be reachable, not a good size for the primary action on a page.
 */
const button = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-pill font-semibold",
    "whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform]",
    "duration-150 ease-[cubic-bezier(0.34,1.4,0.64,1)]",
    "disabled:pointer-events-none disabled:opacity-55",
  ],
  {
    variants: {
      variant: {
        /** The one thing to do here. One per viewport, ideally one per page. */
        primary: [
          "bg-apricot text-[#1a1310] shadow-press",
          "hover:-translate-y-0.5 hover:shadow-press-hover",
          "active:translate-y-0 active:shadow-none",
        ],
        /** The alternative path. Distinguished by shape AND border, not colour. */
        secondary: [
          "border-[1.5px] border-edge-strong bg-transparent text-ink",
          "hover:border-ink hover:bg-surface",
        ],
        /** For a district that already sits on a saturated field. */
        inverse: [
          "bg-ink text-paper shadow-press",
          "hover:-translate-y-0.5 hover:shadow-press-hover",
          "active:translate-y-0 active:shadow-none",
        ],
        ghost: "text-ink-muted hover:bg-surface hover:text-ink",
        /** Underlined at rest, so it never relies on colour alone. */
        link: "h-auto min-h-0 rounded-none px-0 py-0 text-apricot-ink underline decoration-1 underline-offset-4 hover:decoration-2",
      },
      size: {
        sm: "min-h-11 px-4 text-sm",
        md: "min-h-12 px-5 text-[0.9375rem]",
        lg: "min-h-13 px-7 text-base sm:min-h-14",
        xl: "min-h-14 px-9 text-lg sm:min-h-16 sm:px-11",
      },
    },
    compoundVariants: [
      // Only primaries lift. If everything moves, the hierarchy disappears.
      { variant: ["secondary", "ghost", "link"], class: "hover:translate-y-0" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof button> & {
    /** Render as the child element — for links that look like buttons. */
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(button({ variant, size }), className)} {...props} />;
}

export { button as buttonVariants };
