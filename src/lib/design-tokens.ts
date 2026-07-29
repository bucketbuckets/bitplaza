/**
 * Design tokens, as data.
 *
 * `src/app/globals.css` is what the browser actually reads. This file exists so
 * the values can be asserted against WCAG in a unit test, and so the community
 * palette has one authoritative home that TypeScript can see.
 *
 * The two are kept honest by `tests/tokens.sync.test.ts`, which parses the CSS
 * and fails if a value here has drifted from the value shipped. Do not "fix" a
 * mismatch by editing only one side.
 */

export type ThemeName = "light" | "dark";

export interface ThemeTokens {
  /** Page background. In light this is the DARKEST ground, so it binds dark text. */
  ground: string;
  surface: string;
  /** In dark this is the LIGHTEST ground, so it binds light text. */
  raised: string;
  ink: string;
  muted: string;
  faint: string;
  edge: string;
  edgeStrong: string;
  primary: string;
  onPrimary: string;
  accent: string;
  accentText: string;
  onAccent: string;
  focus: string;
}

export const THEMES: Record<ThemeName, ThemeTokens> = {
  light: {
    ground: "#e9ecf2",
    surface: "#f4f6f9",
    raised: "#ffffff",
    ink: "#16202e",
    muted: "#4e5a6c",
    faint: "#5c6879",
    edge: "#ccd4e0",
    edgeStrong: "#a7b3c5",
    primary: "#16202e",
    onPrimary: "#f4f6f9",
    accent: "#e8b368",
    accentText: "#8a5a16",
    onAccent: "#101826",
    focus: "#1a66ab",
  },
  dark: {
    ground: "#101826",
    surface: "#161f30",
    raised: "#1d2839",
    ink: "#f2ede3",
    muted: "#9aa6b8",
    faint: "#8896ad",
    edge: "#25324a",
    edgeStrong: "#3a4b69",
    primary: "#e8b368",
    onPrimary: "#101826",
    accent: "#e8b368",
    accentText: "#e8b368",
    onAccent: "#101826",
    focus: "#e8b368",
  },
};

/** Every background a token might sit on, per theme. Worst case is what counts. */
export const GROUNDS: Record<ThemeName, readonly string[]> = {
  light: [THEMES.light.ground, THEMES.light.surface, THEMES.light.raised],
  dark: [THEMES.dark.ground, THEMES.dark.surface, THEMES.dark.raised],
};

/* ── Relative luminance and contrast, per WCAG 2.1 ──────────────────────── */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two hex colours, 1–21. */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
