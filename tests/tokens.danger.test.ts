import { describe, expect, it } from "vitest";

import { THEMES, worstCase } from "@/lib/design-tokens";

/**
 * The danger token was added for form errors (Stage 4). Same rule as every
 * other text token: AA is judged at the WORST case across all three grounds
 * in its mode, not the friendliest one.
 */
describe("danger token", () => {
  it("clears AA as text on every light ground", () => {
    expect(worstCase(THEMES.light.danger, "light")).toBeGreaterThanOrEqual(4.5);
  });

  it("clears AA as text on every dark ground", () => {
    expect(worstCase(THEMES.dark.danger, "dark")).toBeGreaterThanOrEqual(4.5);
  });
});
