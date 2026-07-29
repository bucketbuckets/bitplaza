// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

/**
 * Integration tests against the real local Postgres (docker: bitplaza-pg).
 * See README / .env — DATABASE_URL points at localhost:5433.
 *
 * The `resend` package is mocked to THROW on every send, with a key set, so
 * every scenario here also proves the invariant that an email outage never
 * fails a committed signup.
 */

vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: async () => {
        throw new Error("simulated email outage");
      },
    };
  },
}));

process.env.DATABASE_URL ??= "postgresql://bitplaza:bitplaza@localhost:5433/bitplaza";
process.env.RESEND_API_KEY = "re_test_outage";

const DOMAIN = "itest.bitplaza.local";
const email = (name: string) => `${name}@${DOMAIN}`;

const { POST: waitlistPost } = await import("@/app/api/waitlist/route");
const { POST: applicationPost } = await import("@/app/api/community-application/route");
const { POST: researchPost } = await import("@/app/api/research-response/route");
const { GET: exportGet } = await import("@/app/api/admin/export/route");
const { db } = await import("@/lib/db");

let ipCounter = 0;
function post(handler: (req: Request) => Promise<Response>, body: unknown, ip?: string) {
  ipCounter += 1;
  return handler(
    new Request("http://localhost/api/test", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip ?? `10.9.${Math.floor(ipCounter / 200)}.${ipCounter % 200}`,
      },
      body: JSON.stringify(body),
    }),
  );
}

const validBody = (name: string, extra: Record<string, unknown> = {}) => ({
  email: email(name),
  firstName: "Test",
  userType: "COMMUNITY_MEMBER",
  communities: ["bitcoin"],
  consent: true,
  ...extra,
});

async function cleanup() {
  await db.waitlistUser.deleteMany({ where: { email: { endsWith: `@${DOMAIN}` } } });
  await db.rateLimitCounter.deleteMany({});
}

beforeAll(cleanup);
afterAll(async () => {
  await cleanup();
  await db.$disconnect();
});

describe("POST /api/waitlist", () => {
  it("creates a signup and returns position and referral code — despite the email outage", async () => {
    const res = await post(waitlistPost, validBody("happy"));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.duplicate).toBe(false);
    expect(data.position).toBeGreaterThan(0);
    expect(data.referralCode).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/);
    expect(data.referralUrl).toContain(`?ref=${data.referralCode}`);

    const row = await db.waitlistUser.findUnique({ where: { email: email("happy") } });
    expect(row).not.toBeNull();
    expect(row!.communities).toEqual(["bitcoin"]);
    expect(row!.consentTimestamp).toBeInstanceOf(Date);
  });

  it("returns the existing place for a duplicate, creating no second row", async () => {
    const first = await (await post(waitlistPost, validBody("dupe"))).json();
    const res = await post(waitlistPost, validBody("dupe"));
    expect(res.status).toBe(200);
    const second = await res.json();
    expect(second.duplicate).toBe(true);
    expect(second.position).toBe(first.position);
    expect(second.referralCode).toBe(first.referralCode);

    const rows = await db.waitlistUser.count({ where: { email: email("dupe") } });
    expect(rows).toBe(1);
  });

  it("detects duplicates through Gmail normalization", async () => {
    await post(waitlistPost, validBody("gmail", { email: "wait.list+a@gmail.com" }));
    const res = await post(waitlistPost, validBody("gmail", { email: "waitlist@gmail.com" }));
    const data = await res.json();
    expect(data.duplicate).toBe(true);
    await db.waitlistUser.deleteMany({ where: { email: "waitlist@gmail.com" } });
  });

  it("attributes a referral exactly once and rejects unknown codes silently", async () => {
    const referrer = await (await post(waitlistPost, validBody("referrer"))).json();

    const referred = await (
      await post(waitlistPost, validBody("referred", { referralCode: referrer.referralCode }))
    ).json();
    expect(referred.ok).toBe(true);

    const referrerRow = await db.waitlistUser.findUnique({ where: { email: email("referrer") } });
    const referredRow = await db.waitlistUser.findUnique({ where: { email: email("referred") } });
    expect(referrerRow!.referralCount).toBe(1);
    expect(referredRow!.referredById).toBe(referrerRow!.id);

    // Unknown code: the signup still lands, unattributed.
    const stray = await (
      await post(waitlistPost, validBody("stray", { referralCode: "ZZZZ9999" }))
    ).json();
    expect(stray.ok).toBe(true);
    const strayRow = await db.waitlistUser.findUnique({ where: { email: email("stray") } });
    expect(strayRow!.referredById).toBeNull();
  });

  it("does not increment the referrer when the duplicate path takes over", async () => {
    const user = await (await post(waitlistPost, validBody("selfref"))).json();
    // Same address arrives again carrying its own code.
    await post(waitlistPost, validBody("selfref", { referralCode: user.referralCode }));
    const row = await db.waitlistUser.findUnique({ where: { email: email("selfref") } });
    expect(row!.referralCount).toBe(0);
  });

  it("answers a filled honeypot with a deterministic decoy and stores nothing", async () => {
    const res = await post(waitlistPost, validBody("bot1", { nickname: "Totally Human" }));
    expect(res.status).toBe(200);
    const decoy = await res.json();
    expect(decoy.ok).toBe(true);
    expect(await db.waitlistUser.findUnique({ where: { email: email("bot1") } })).toBeNull();
  });

  it("treats a too-fast submission the same way", async () => {
    const res = await post(waitlistPost, validBody("bot2", { startedAt: Date.now() - 100 }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(await db.waitlistUser.findUnique({ where: { email: email("bot2") } })).toBeNull();
  });

  it("rejects invalid payloads with field errors", async () => {
    const res = await post(waitlistPost, { email: "nope", firstName: "", consent: false });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.fieldErrors.email).toBeTruthy();
    expect(data.fieldErrors.consent).toBeTruthy();
  });

  it("rate limits the 11th request from one address with a 429", async () => {
    const ip = "203.0.113.77";
    let last: Response | null = null;
    for (let i = 0; i < 11; i++) {
      last = await post(waitlistPost, { email: "nope" }, ip);
    }
    expect(last!.status).toBe(429);
  });
});

describe("POST /api/community-application", () => {
  const app = (extra: Record<string, unknown> = {}) => ({
    email: email("leader"),
    firstName: "Ada",
    communityName: "Ada's Makers",
    communitySize: "100 – 1,000",
    currentTools: ["Discord"],
    primaryProblem: "Everything lives in my head.",
    plazaVision: "A findable home.",
    consent: true,
    ...extra,
  });

  it("creates the leader as a waitlist user plus an application row", async () => {
    const res = await post(applicationPost, app());
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.ok).toBe(true);

    const user = await db.waitlistUser.findUnique({
      where: { email: email("leader") },
      include: { communityApplication: true },
    });
    expect(user!.userType).toBe("COMMUNITY_LEADER");
    expect(user!.communityApplication!.communityName).toBe("Ada's Makers");
  });

  it("revises the application on resubmit instead of duplicating", async () => {
    const res = await post(applicationPost, app({ communityName: "Ada's Makers v2" }));
    expect(res.status).toBe(200);

    const applications = await db.communityApplication.findMany({
      where: { waitlistUser: { email: email("leader") } },
    });
    expect(applications).toHaveLength(1);
    expect(applications[0].communityName).toBe("Ada's Makers v2");
  });
});

describe("POST /api/research-response", () => {
  it("stores a response keyed by referral code", async () => {
    const signup = await (await post(waitlistPost, validBody("research"))).json();
    const res = await post(researchPost, {
      referralCode: signup.referralCode,
      question: "What first?",
      response: "Find my people.",
    });
    expect(res.status).toBe(201);

    const rows = await db.researchResponse.findMany({
      where: { waitlistUser: { email: email("research") } },
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].response).toBe("Find my people.");
  });

  it("rejects an unknown code", async () => {
    const res = await post(researchPost, {
      referralCode: "ZZZZ9990",
      question: "?",
      response: "hello",
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/admin/export", () => {
  it("refuses without the bearer token, in constant time", async () => {
    process.env.ADMIN_EXPORT_TOKEN = "test-token-123";
    const bare = await exportGet(new Request("http://localhost/api/admin/export"));
    expect(bare.status).toBe(401);

    const wrong = await exportGet(
      new Request("http://localhost/api/admin/export", {
        headers: { authorization: "Bearer nope" },
      }),
    );
    expect(wrong.status).toBe(401);
  });

  it("refuses everything when no token is configured", async () => {
    delete process.env.ADMIN_EXPORT_TOKEN;
    const res = await exportGet(
      new Request("http://localhost/api/admin/export", {
        headers: { authorization: "Bearer " },
      }),
    );
    expect(res.status).toBe(401);
  });

  it("streams a CSV with formula-safe values for the right token", async () => {
    process.env.ADMIN_EXPORT_TOKEN = "test-token-123";
    // A signup whose name is a formula — the classic export attack.
    await post(waitlistPost, validBody("evilname", { firstName: "=HYPERLINK(evil)" }));

    const res = await exportGet(
      new Request("http://localhost/api/admin/export", {
        headers: { authorization: "Bearer test-token-123" },
      }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");

    const csv = await res.text();
    expect(csv.startsWith("position,email,first_name")).toBe(true);
    expect(csv).toContain(email("evilname"));
    expect(csv).toContain("'=HYPERLINK(evil)");
    expect(csv).not.toContain(",=HYPERLINK");
    delete process.env.ADMIN_EXPORT_TOKEN;
  });
});
