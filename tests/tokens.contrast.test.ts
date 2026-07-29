import { describe, expect, it } from "vitest";

import { COMMUNITIES } from "@/lib/communities";
import {
  contrast,
  GROUNDS,
  THEMES,
  type ThemeName,
} from "@/lib/design-tokens";

const AA = 4.5;
const AA_LARGE = 3;
const THEME_NAMES: ThemeName[] = ["light", "dark"];

/** Worst ratio across every background this token can legitimately sit on. */
function worstCase(color: string, theme: ThemeName): number {
  return Math.min(...GROUNDS[theme].map((bg) => contrast(color, bg)));
}

describe("theme tokens meet WCAG AA on every ground", () => {
  for (const theme of THEME_NAMES) {
    const t = THEMES[theme];

    // Text roles are checked against the WORST ground, not the flattering one.
    // A token that passes on `surface` and fails on `raised` still ships a
    // failing pair, and that is exactly how it gets missed in review.
    for (const role of ["ink", "muted", "faint", "accentText"] as const) {
      it(`${theme}: ${role} clears AA on ground, surface and raised`, () => {
        expect(worstCase(t[role], theme)).toBeGreaterThanOrEqual(AA);
      });
    }

    it(`${theme}: onPrimary clears AA against the primary fill`, () => {
      expect(contrast(t.onPrimary, t.primary)).toBeGreaterThanOrEqual(AA);
    });

    it(`${theme}: onAccent clears AA against the accent fill`, () => {
      expect(contrast(t.onAccent, t.accent)).toBeGreaterThanOrEqual(AA);
    });

    // A focus ring is a non-text UI component: 3:1 is the bar (WCAG 1.4.11).
    it(`${theme}: focus ring clears 3:1 on every ground`, () => {
      expect(worstCase(t.focus, theme)).toBeGreaterThanOrEqual(AA_LARGE);
    });

    // The lamp is a fill, never text. This asserts the rule rather than
    // trusting a comment: if someone "simplifies" accentText to accent in the
    // light theme, this fails.
    if (theme === "light") {
      it("light: raw accent is NOT usable as text — accentText must differ", () => {
        expect(worstCase(t.accent, "light")).toBeLessThan(AA);
        expect(t.accentText).not.toBe(t.accent);
      });
    }
  }
});

describe("community tokens work in all three roles", () => {
  for (const c of COMMUNITIES) {
    it(`${c.label}: onFill clears AA against its own fill`, () => {
      expect(contrast(c.onFill, c.fill)).toBeGreaterThanOrEqual(AA);
    });

    it(`${c.label}: textLight clears AA on every light ground`, () => {
      expect(worstCase(c.textLight, "light")).toBeGreaterThanOrEqual(AA);
    });

    it(`${c.label}: textDark clears AA on every dark ground`, () => {
      expect(worstCase(c.textDark, "dark")).toBeGreaterThanOrEqual(AA);
    });
  }

  it("every fill and id is unique", () => {
    expect(new Set(COMMUNITIES.map((c) => c.fill)).size).toBe(COMMUNITIES.length);
    expect(new Set(COMMUNITIES.map((c) => c.id)).size).toBe(COMMUNITIES.length);
  });

  // Documents the structural fact the design relies on. If a future palette
  // change makes a second hue light-valued, the "Bitcoin is the exception"
  // story in the CSS comments stops being true and should be rewritten.
  it("Bitcoin is the only light-value hue, so the only one taking ink on its fill", () => {
    const inkOnFill = COMMUNITIES.filter((c) => c.onFill !== "#ffffff");
    expect(inkOnFill.map((c) => c.id)).toEqual(["bitcoin"]);
  });
});
