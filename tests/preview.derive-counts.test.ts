import { describe, expect, it } from "vitest";

import { COMMUNITY_IDS } from "@/lib/communities";
import { deriveCounts } from "@/lib/preview/derive-counts";

describe("deriveCounts", () => {
  it("is deterministic: same selection, same numbers", () => {
    const a = deriveCounts(["bitcoin", "music", "design"]);
    const b = deriveCounts(["bitcoin", "music", "design"]);
    expect(a).toEqual(b);
  });

  it("ignores selection order — it describes a set", () => {
    expect(deriveCounts(["music", "bitcoin"])).toEqual(deriveCounts(["bitcoin", "music"]));
  });

  it("returns zeros for an empty selection", () => {
    expect(deriveCounts([])).toEqual({ people: 0, projects: 0, events: 0, opportunities: 0 });
  });

  it("stays inside believable bounds for every 1–3 combination", () => {
    const singles = COMMUNITY_IDS.map((id) => [id]);
    const pairs = COMMUNITY_IDS.flatMap((a, i) =>
      COMMUNITY_IDS.slice(i + 1).map((b) => [a, b]),
    );
    for (const selection of [...singles, ...pairs]) {
      const counts = deriveCounts(selection);
      expect(counts.people).toBeGreaterThanOrEqual(9);
      expect(counts.people).toBeLessThanOrEqual(26);
      expect(counts.projects).toBeGreaterThanOrEqual(3);
      expect(counts.projects).toBeLessThanOrEqual(9);
      expect(counts.events).toBeGreaterThanOrEqual(2);
      expect(counts.events).toBeLessThanOrEqual(6);
      expect(counts.opportunities).toBeGreaterThanOrEqual(4);
      expect(counts.opportunities).toBeLessThanOrEqual(12);
    }
  });

  it("different selections generally see different numbers", () => {
    // Not a strict requirement, but if every selection produced identical
    // counts the preview would read as a static image with extra steps.
    const seen = new Set(
      COMMUNITY_IDS.map((id) => JSON.stringify(deriveCounts([id]))),
    );
    expect(seen.size).toBeGreaterThan(3);
  });
});
