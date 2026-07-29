import { describe, expect, it } from "vitest";

import {
  communityApplicationSchema,
  waitlistSubmissionSchema,
} from "@/lib/validation/waitlist";

const valid = {
  email: "tom@example.com",
  firstName: "Tom",
  userType: "COMMUNITY_MEMBER" as const,
  communities: ["bitcoin", "music"],
  consent: true as const,
};

describe("waitlistSubmissionSchema", () => {
  it("accepts a minimal valid submission", () => {
    const parsed = waitlistSubmissionSchema.parse(valid);
    expect(parsed.email).toBe("tom@example.com");
    expect(parsed.communities).toEqual(["bitcoin", "music"]);
  });

  it("accepts zero communities and exactly three", () => {
    expect(waitlistSubmissionSchema.safeParse({ ...valid, communities: [] }).success).toBe(true);
    expect(
      waitlistSubmissionSchema.safeParse({
        ...valid,
        communities: ["bitcoin", "music", "design"],
      }).success,
    ).toBe(true);
  });

  it("rejects four communities", () => {
    expect(
      waitlistSubmissionSchema.safeParse({
        ...valid,
        communities: ["bitcoin", "music", "design", "ai"],
      }).success,
    ).toBe(false);
  });

  it("rejects a community outside the fixed ten", () => {
    expect(
      waitlistSubmissionSchema.safeParse({ ...valid, communities: ["sports"] }).success,
    ).toBe(false);
  });

  it("rejects malformed and oversized emails", () => {
    expect(waitlistSubmissionSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(
      waitlistSubmissionSchema.safeParse({ ...valid, email: `${"a".repeat(260)}@x.com` }).success,
    ).toBe(false);
  });

  it("requires consent to be literally true", () => {
    expect(waitlistSubmissionSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(
      waitlistSubmissionSchema.safeParse({ ...valid, consent: undefined }).success,
    ).toBe(false);
  });

  it("rejects an unknown user type", () => {
    expect(
      waitlistSubmissionSchema.safeParse({ ...valid, userType: "WIZARD" }).success,
    ).toBe(false);
  });

  it("bounds every free-text field", () => {
    expect(
      waitlistSubmissionSchema.safeParse({ ...valid, primaryGoal: "x".repeat(501) }).success,
    ).toBe(false);
    expect(
      waitlistSubmissionSchema.safeParse({ ...valid, utmSource: "x".repeat(101) }).success,
    ).toBe(false);
  });

  it("defaults missing communities to an empty array", () => {
    const { communities, ...rest } = valid;
    void communities;
    expect(waitlistSubmissionSchema.parse(rest).communities).toEqual([]);
  });
});

describe("communityApplicationSchema", () => {
  const validApp = {
    email: "lead@example.com",
    firstName: "Ada",
    communityName: "Ada's Makers",
    communitySize: "100 – 1,000" as const,
    currentTools: ["Discord", "Sheets"],
    primaryProblem: "Everything lives in my head.",
    plazaVision: "A place newcomers can find on their own.",
    consent: true as const,
  };

  it("accepts a valid application", () => {
    expect(communityApplicationSchema.safeParse(validApp).success).toBe(true);
  });

  it("requires the essay fields", () => {
    expect(
      communityApplicationSchema.safeParse({ ...validApp, primaryProblem: "" }).success,
    ).toBe(false);
    expect(
      communityApplicationSchema.safeParse({ ...validApp, plazaVision: "" }).success,
    ).toBe(false);
  });

  it("accepts an absent or empty website but rejects a non-URL", () => {
    expect(communityApplicationSchema.safeParse(validApp).success).toBe(true);
    expect(
      communityApplicationSchema.safeParse({ ...validApp, website: "" }).success,
    ).toBe(true);
    expect(
      communityApplicationSchema.safeParse({ ...validApp, website: "not a link" }).success,
    ).toBe(false);
    expect(
      communityApplicationSchema.safeParse({ ...validApp, website: "https://ada.dev" }).success,
    ).toBe(true);
  });

  it("caps the tool list at ten", () => {
    expect(
      communityApplicationSchema.safeParse({
        ...validApp,
        currentTools: Array.from({ length: 11 }, (_, i) => `tool${i}`),
      }).success,
    ).toBe(false);
  });
});
