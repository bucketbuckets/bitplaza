import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  /** `wide` for full-bleed feature rows; `narrow` for reading-width prose. */
  width?: "default" | "wide" | "narrow";
};

const WIDTHS = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({ width = "default", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", WIDTHS[width], className)}
      {...props}
    />
  );
}
