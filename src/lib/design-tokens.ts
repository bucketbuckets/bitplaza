/**
 * Design tokens, as data. Bitplaza v2.0 — see `design.md` §8.
 *
 * `src/app/globals.css` is what the browser reads. This file exists so the
 * values can be asserted against WCAG in a unit test, and so the palette has one
 * authoritative home TypeScript can see.
 *
 * The two are kept honest by `tests/tokens.sync.test.ts`, which parses the CSS
 * and fails if a value here has drifted from the value shipped. Do not resolve a
 * mismatch by editing only one side.
 *
 * Light mode is the primary expressive experience; dark mode is the plaza at
 * night — warm near-black, never blue-black. Neither is an inversion of the
 * other.
 */

export type ThemeName = "light" | "dark";

export interface ThemeTokens {
  /** Page ground. Warm cream in light, warm near-black in dark. */
  paper: string;
  surface: string;
  raised: string;
  ink: string;
  inkMuted: string;
  /** The floor. Nothing lighter (light mode) or darker (dark mode) passes AA. */
  inkFaint: string;
  /** The signature. Identical in both themes — the brand colour does not shift. */
  apricot: string;
  /** Apricot as TEXT. The raw fill fails as text on light grounds. */
  apricotInk: string;
  cobalt: string;
  cobaltInk: string;
  citron: string;
  citronInk: string;
  mint: string;
  mintInk: string;
  edge: string;
  edgeStrong: string;
  focus: string;
  /** Form errors as text. Worst-case AA on every ground in its mode. */
  danger: string;
}

export const THEMES: Record<ThemeName, ThemeTokens> = {
  light: {
    paper: "#fdf8f1",
    surface: "#f7f0e4",
    raised: "#ffffff",
    ink: "#1a1310",
    inkMuted: "#5a4f47",
    inkFaint: "#6e6259",
    apricot: "#ff6a3d",
    apricotInk: "#b33509",
    cobalt: "#2440e0",
    cobaltInk: "#1e36c4",
    citron: "#d6e63c",
    citronInk: "#5c6410",
    mint: "#3ecf9a",
    mintInk: "#0f6b4c",
    edge: "#e4d9c8",
    edgeStrong: "#c9b9a2",
    focus: "#2440e0",
    danger: "#b3261e",
  },
  dark: {
    paper: "#17120f",
    surface: "#211a15",
    raised: "#2b221c",
    ink: "#fbf4ea",
    inkMuted: "#b7a99c",
    inkFaint: "#9c8d80",
    apricot: "#ff6a3d",
    apricotInk: "#ff9166",
    cobalt: "#2440e0",
    cobaltInk: "#8fa0ff",
    citron: "#d6e63c",
    citronInk: "#d6e63c",
    mint: "#3ecf9a",
    mintInk: "#5fe0b4",
    edge: "#382c24",
    edgeStrong: "#544236",
    focus: "#ff9166",
    danger: "#ff8d82",
  },
};

/** Every ground a token might sit on, per theme. Worst case is what counts. */
export const GROUNDS: Record<ThemeName, readonly string[]> = {
  light: [THEMES.light.paper, THEMES.light.surface, THEMES.light.raised],
  dark: [THEMES.dark.paper, THEMES.dark.surface, THEMES.dark.raised],
};

/**
 * Brand fills, and the only text colour permitted on each.
 *
 * `apricot` is the one to watch: white on apricot measures 2.85:1 and fails at
 * every size. A design that calls for it is wrong, and the test enforces that
 * rather than trusting review to catch it.
 */
export const FILL_PAIRS = [
  { name: "apricot", fill: "#ff6a3d", on: "#1a1310" },
  { name: "cobalt", fill: "#2440e0", on: "#ffffff" },
  { name: "citron", fill: "#d6e63c", on: "#1a1310" },
  { name: "mint", fill: "#3ecf9a", on: "#1a1310" },
] as const;

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

/** Worst ratio across every ground this colour can legitimately sit on. */
export function worstCase(color: string, theme: ThemeName): number {
  return Math.min(...GROUNDS[theme].map((bg) => contrast(color, bg)));
}
