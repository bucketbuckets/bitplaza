"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import {
  getServerThemeMode,
  getThemeMode,
  setThemeMode,
  subscribeTheme,
  type ThemeMode,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const MODES: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

/**
 * Three states, not two. A binary toggle silently discards "follow my OS",
 * which is the setting most people actually want and the only one that keeps
 * working when they change it later.
 *
 * Rendered as a radiogroup so arrow keys move between options and a screen
 * reader announces which is active. A row of independent buttons would announce
 * three unrelated controls with no sense of the current choice.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribeTheme, getThemeMode, getServerThemeMode);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-pill border border-edge bg-surface p-0.5",
        className,
      )}
    >
      {MODES.map(({ value, label, Icon }) => {
        const selected = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => setThemeMode(value)}
            className={cn(
              "grid size-8 place-items-center rounded-pill transition-colors duration-150",
              selected ? "bg-ink text-paper" : "text-ink-faint hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden="true" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
