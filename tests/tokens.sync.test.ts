import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { COMMUNITIES } from "@/lib/communities";
import { THEMES, type ThemeName } from "@/lib/design-tokens";

/**
 * globals.css is what the browser reads; design-tokens.ts is what the tests
 * read. Two sources of truth drift silently — someone edits the CSS, the
 * contrast test keeps passing against stale TypeScript, and a failing pair
 * ships. This test is the join between them.
 *
 * It also catches the subtler bug: each palette is written twice, once under
 * the media query or :root and once under [data-theme]. Editing only one is the
 * likeliest mistake in that file, and it produces a page that looks correct
 * until someone touches the theme toggle.
 */

// Comments are stripped before anything is located. The file's own prose
// mentions `:root` and `@theme inline`, so searching the raw text would find
// the documentation instead of the rule — failing in a way that looks like a
// token mismatch rather than a parser bug.
const CSS = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

function declarationsAt(from: number, label: string): Map<string, string> {
  if (from === -1) throw new Error(`block not found in globals.css: ${label}`);
  const open = CSS.indexOf("{", from);
  const close = CSS.indexOf("}", open);
  if (open === -1 || close === -1) throw new Error(`unterminated block: ${label}`);

  const out = new Map<string, string>();
  for (const line of CSS.slice(open + 1, close).split(";")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const name = line.slice(0, colon).trim();
    if (!name.startsWith("--")) continue;
    out.set(name, line.slice(colon + 1).trim());
  }
  return out;
}

const block = (selector: string) => declarationsAt(CSS.indexOf(selector), selector);

/** The `:root` nested inside a wrapping at-rule. */
function nestedRoot(atRule: string): Map<string, string> {
  const at = CSS.indexOf(atRule);
  if (at === -1) throw new Error(`at-rule not found: ${atRule}`);
  return declarationsAt(CSS.indexOf(":root", at), `${atRule} > :root`);
}

/** Every place a theme's palette is written. All must agree. */
const THEME_SOURCES: Record<ThemeName, Array<[string, () => Map<string, string>]>> = {
  light: [
    [":root", () => block(":root {")],
    ['[data-theme="light"]', () => block(':root[data-theme="light"]')],
  ],
  dark: [
    ["prefers-color-scheme: dark", () => nestedRoot("@media (prefers-color-scheme: dark)")],
    ['[data-theme="dark"]', () => block(':root[data-theme="dark"]')],
  ],
};

const VAR_FOR = {
  paper: "--bp-paper",
  surface: "--bp-surface",
  raised: "--bp-raised",
  ink: "--bp-ink",
  inkMuted: "--bp-ink-muted",
  inkFaint: "--bp-ink-faint",
  apricot: "--bp-apricot",
  apricotInk: "--bp-apricot-ink",
  cobalt: "--bp-cobalt",
  cobaltInk: "--bp-cobalt-ink",
  citron: "--bp-citron",
  citronInk: "--bp-citron-ink",
  mint: "--bp-mint",
  mintInk: "--bp-mint-ink",
  edge: "--bp-edge",
  edgeStrong: "--bp-edge-strong",
  focus: "--bp-focus",
  danger: "--bp-danger",
} as const;

describe("globals.css matches design-tokens.ts", () => {
  for (const theme of ["light", "dark"] as ThemeName[]) {
    for (const [label, read] of THEME_SOURCES[theme]) {
      it(`${theme} palette in ${label} matches`, () => {
        const decls = read();
        for (const [key, cssVar] of Object.entries(VAR_FOR)) {
          expect(decls.get(cssVar), `${cssVar} in ${label}`).toBe(
            THEMES[theme][key as keyof typeof VAR_FOR],
          );
        }
      });
    }
  }

  it("community fills in @theme match the TypeScript palette", () => {
    const decls = block("@theme inline");
    for (const c of COMMUNITIES) {
      expect(decls.get(`--color-c-${c.id}`), `fill for ${c.id}`).toBe(c.fill);
    }
  });

  for (const theme of ["light", "dark"] as ThemeName[]) {
    for (const [label, read] of THEME_SOURCES[theme]) {
      it(`community ${theme} text tokens in ${label} match`, () => {
        const decls = read();
        for (const c of COMMUNITIES) {
          const expected = theme === "light" ? c.textLight : c.textDark;
          expect(decls.get(`--bp-c-${c.id}-text`), `${c.id} in ${label}`).toBe(expected);
        }
      });
    }
  }
});
