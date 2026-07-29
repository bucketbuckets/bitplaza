import { describe, expect, it } from "vitest";

import { COMMUNITIES, COMMUNITY_IDS } from "@/lib/communities";
import {
  contrast,
  FILL_PAIRS,
  THEMES,
  worstCase,
  type ThemeName,
} from "@/lib/design-tokens";

const AA = 4.5;
const NON_TEXT = 3;
const THEME_NAMES: ThemeName[] = ["light", "dark"];

const INK = "#1a1310";
const WHITE = "#ffffff";

describe("theme tokens meet WCAG AA on every ground", () => {
  for (const theme of THEME_NAMES) {
    const t = THEMES[theme];

    // Checked against the WORST ground, never the flattering one. A token that
    // passes on `surface` and fails on `raised` still ships a failing pair, and
    // that is exactly how it gets missed in review.
    for (const role of [
      "ink",
      "inkMuted",
      "inkFaint",
      "apricotInk",
      "cobaltInk",
      "citronInk",
      "mintInk",
    ] as const) {
      it(`${theme}: ${role} clears AA on paper, surface and raised`, () => {
        expect(worstCase(t[role], theme)).toBeGreaterThanOrEqual(AA);
      });
    }

    // A focus ring is a non-text UI component: 3:1 is the bar (WCAG 1.4.11).
    it(`${theme}: focus ring clears 3:1 on every ground`, () => {
      expect(worstCase(t.focus, theme)).toBeGreaterThanOrEqual(NON_TEXT);
    });

    it(`${theme}: the signature apricot fill is identical across themes`, () => {
      expect(t.apricot).toBe("#ff6a3d");
    });
  }
});

describe("brand fills carry only their permitted text colour", () => {
  for (const pair of FILL_PAIRS) {
    it(`${pair.name}: its recorded on-fill colour clears AA`, () => {
      expect(contrast(pair.on, pair.fill)).toBeGreaterThanOrEqual(AA);
    });

    it(`${pair.name}: the recorded on-fill is the better of ink and white`, () => {
      const better = contrast(INK, pair.fill) >= contrast(WHITE, pair.fill) ? INK : WHITE;
      expect(pair.on).toBe(better);
    });
  }

  // The rule design.md §8.1 states, asserted rather than trusted to review.
  // If someone "brightens" a button by putting white on apricot, this fails.
  it("white on apricot FAILS and must never be used", () => {
    expect(contrast(WHITE, "#ff6a3d")).toBeLessThan(AA);
  });

  it("raw apricot is not usable as text on light grounds", () => {
    expect(worstCase("#ff6a3d", "light")).toBeLessThan(AA);
    expect(THEMES.light.apricotInk).not.toBe(THEMES.light.apricot);
  });

  it("raw citron is not usable as text on light grounds", () => {
    expect(worstCase("#d6e63c", "light")).toBeLessThan(AA);
    expect(THEMES.light.citronInk).not.toBe(THEMES.light.citron);
  });
});

describe("community tokens work in all three roles", () => {
  for (const c of COMMUNITIES) {
    it(`${c.label}: onFill clears AA against its own fill`, () => {
      expect(contrast(c.onFill, c.fill)).toBeGreaterThanOrEqual(AA);
    });

    // The on-fill colour is chosen by measurement, not convention. This is the
    // assertion that keeps it that way — there is no "Bitcoin is the exception"
    // rule to remember, only "compute both, keep the higher".
    it(`${c.label}: onFill is the better of ink and white`, () => {
      const better = contrast(INK, c.fill) >= contrast(WHITE, c.fill) ? INK : WHITE;
      expect(c.onFill).toBe(better);
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

  // The ten are fixed by the product brief — they are the interest selector's
  // options, so changing them means changing the waitlist schema too.
  it("the ten communities match the product brief", () => {
    expect([...COMMUNITY_IDS].sort()).toEqual(
      [
        "ai",
        "bitcoin",
        "collecting",
        "design",
        "education",
        "entrepreneurship",
        "gaming",
        "local",
        "music",
        "opensource",
      ].sort(),
    );
  });

  it("exactly one community is live, and it is Bitcoin", () => {
    const live = COMMUNITIES.filter((c) => c.status === "live");
    expect(live.map((c) => c.id)).toEqual(["bitcoin"]);
  });
});
