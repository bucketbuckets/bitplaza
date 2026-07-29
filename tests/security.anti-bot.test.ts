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
  it("is deterministic per seed, so probes see stable answers", () => {
    const a = decoySuccess("bot@example.com", "https://bitplaza.com");
    const b = decoySuccess("bot@example.com", "https://bitplaza.com");
    expect(a).toEqual(b);
  });

  it("is shaped exactly like a real success", () => {
    const decoy = decoySuccess("seed", "https://bitplaza.com");
    expect(decoy.ok).toBe(true);
    expect(decoy.duplicate).toBe(false);
    expect(decoy.referralCode).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/);
    expect(decoy.referralUrl).toBe(`https://bitplaza.com/?ref=${decoy.referralCode}`);
    expect(decoy.position).toBeGreaterThan(0);
  });
});
