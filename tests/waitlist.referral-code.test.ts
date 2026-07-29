import { describe, expect, it } from "vitest";

import {
  REFERRAL_ALPHABET,
  REFERRAL_CODE_LENGTH,
  canonicalizeReferralCode,
  generateReferralCode,
  referralUrl,
} from "@/lib/waitlist/referral-code";

describe("generateReferralCode", () => {
  it("emits 8 characters from the Crockford alphabet, every time", () => {
    for (let i = 0; i < 200; i++) {
      const code = generateReferralCode();
      expect(code).toHaveLength(REFERRAL_CODE_LENGTH);
      for (const ch of code) expect(REFERRAL_ALPHABET).toContain(ch);
    }
  });

  it("never emits the ambiguous letters", () => {
    expect(REFERRAL_ALPHABET).not.toMatch(/[ILOU]/);
  });
});

describe("canonicalizeReferralCode", () => {
  it("uppercases and maps confusables onto the alphabet", () => {
    expect(canonicalizeReferralCode("abcd234o")).toBe("ABCD2340");
    expect(canonicalizeReferralCode("iIlL0oO1")).toBe("11110001");
  });

  it("accepts surrounding whitespace", () => {
    expect(canonicalizeReferralCode("  ABCD2345 ")).toBe("ABCD2345");
  });

  it("rejects wrong lengths, wrong characters and non-strings", () => {
    expect(canonicalizeReferralCode("ABC")).toBeNull();
    expect(canonicalizeReferralCode("ABCD234U")).toBeNull(); // U is not in the alphabet
    expect(canonicalizeReferralCode("ABCD 345")).toBeNull();
    expect(canonicalizeReferralCode(12345678)).toBeNull();
    expect(canonicalizeReferralCode(undefined)).toBeNull();
  });

  it("round-trips every generated code", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateReferralCode();
      expect(canonicalizeReferralCode(code)).toBe(code);
    }
  });
});

describe("referralUrl", () => {
  it("builds the landing link the emails and success state share", () => {
    expect(referralUrl("https://bitplaza.com", "ABCD2345")).toBe(
      "https://bitplaza.com/?ref=ABCD2345",
    );
  });
});
