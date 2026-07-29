import { beforeEach, describe, expect, it } from "vitest";

import { captureAttribution, getAttribution } from "@/lib/attribution/capture";

function visit(search: string) {
  window.history.replaceState(null, "", `/${search}`);
  captureAttribution();
}

describe("attribution capture", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("captures ref and utm parameters into sessionStorage", () => {
    visit("?ref=ABCD2345&utm_source=x&utm_medium=social&utm_campaign=launch");
    expect(getAttribution()).toEqual({
      ref: "ABCD2345",
      utmSource: "x",
      utmMedium: "social",
      utmCampaign: "launch",
    });
  });

  it("stores nothing when no relevant params are present", () => {
    visit("?q=hello");
    expect(window.sessionStorage.length).toBe(0);
    expect(getAttribution()).toEqual({});
  });

  it("keeps the first captured values for the session", () => {
    visit("?ref=FIRST234");
    visit("?ref=SECOND23&utm_source=later");
    const attribution = getAttribution();
    expect(attribution.ref).toBe("FIRST234");
  });

  it("truncates injection-shaped oversized values", () => {
    visit(`?utm_source=${"x".repeat(500)}`);
    expect(getAttribution().utmSource).toHaveLength(100);
  });

  it("survives garbage already in storage", () => {
    window.sessionStorage.setItem("bitplaza.attribution", "{not json");
    expect(getAttribution()).toEqual({});
  });
});
