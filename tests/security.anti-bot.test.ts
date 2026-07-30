import { describe, expect, it } from "vitest";

import { decoySuccess, isBotSubmission, MIN_FORM_MS } from "@/lib/security/anti-bot";

describe("isBotSubmission", () => {
  it("flags a filled honeypot", () => {
    expect(isBotSubmission({ nickname: "Bob" })).toBe(true);
  });

  it("ignores an empty or whitespace honeypot", () => {
    expect(isBotSubmission({ nickname: "" })).toBe(false);
    expect(isBotSubmission({ nickname: "   " })).toBe(false);
    expect(isBotSubmission({})).toBe(false);
  });

  it("flags a submission faster than a human can read", () => {
    const now = 1_000_000;
    expect(isBotSubmission({ startedAt: now - 500, now })).toBe(true);
    expect(isBotSubmission({ startedAt: now - MIN_FORM_MS, now })).toBe(false);
  });

  it("ignores a clock-skewed future startedAt rather than punishing it", () => {
    const now = 1_000_000;
    expect(isBotSubmission({ startedAt: now + 60_000, now })).toBe(false);
  });
});

describe("decoySuccess", () => {
  it("is byte-for-byte the pending shape a real first signup answers", () => {
    // Since double opt-in there is no variable data to fake — and no fake
    // position or referral code left for a bot to scrape.
    expect(decoySuccess()).toEqual({ ok: true, status: "pending" });
  });
});
