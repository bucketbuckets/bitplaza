import { describe, expect, it } from "vitest";

import { normalizeEmail } from "@/lib/waitlist/normalize-email";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Tom@Example.COM  ")).toBe("tom@example.com");
  });

  it("applies NFKC so visually-identical addresses collide", () => {
    // Full-width letters normalize to ASCII under NFKC.
    expect(normalizeEmail("ｔｏｍ@example.com")).toBe("tom@example.com");
  });

  it("strips dots and plus-tags at gmail.com", () => {
    expect(normalizeEmail("t.o.m+news@gmail.com")).toBe("tom@gmail.com");
    expect(normalizeEmail("tom+a+b@gmail.com")).toBe("tom@gmail.com");
  });

  it("treats googlemail.com as gmail", () => {
    expect(normalizeEmail("t.om+x@googlemail.com")).toBe("tom@googlemail.com");
  });

  it("leaves dots and plus-tags alone everywhere else", () => {
    expect(normalizeEmail("t.o.m@fastmail.com")).toBe("t.o.m@fastmail.com");
    expect(normalizeEmail("tom+tag@company.io")).toBe("tom+tag@company.io");
  });

  it("survives input without an @", () => {
    expect(normalizeEmail("not-an-email")).toBe("not-an-email");
  });

  it("uses the last @ as the domain split", () => {
    // Quoted-local-part addresses are rare but legal; the domain must win.
    expect(normalizeEmail("o.dd@name@gmail.com")).toBe("odd@name@gmail.com");
    expect(normalizeEmail("ODD@GMAIL.COM")).toBe("odd@gmail.com");
  });
});
