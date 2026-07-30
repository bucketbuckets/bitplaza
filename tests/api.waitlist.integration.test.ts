// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

/**
 * Integration tests against the real local Postgres (docker: bitplaza-pg).
 * See README / .env — DATABASE_URL points at localhost:5433.
 *
 * The `resend` package is mocked to THROW on every send, with a key set, so
 * every scenario here also proves the invariant that an email outage never
 * fails a committed signup — or a committed confirm.
 *
 * Double opt-in: routes answer "pending" and withhold position/referral
 * data; the plaintext confirm token exists only in the email, so tests that
 * need one call createOrReturnWaitlistUser directly (the exact code path the
 * route uses) and walk the token through GET /api/waitlist/confirm.
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
const { GET: confirmGet } = await import("@/app/api/waitlist/confirm/route");
const { POST: applicationPost } = await import("@/app/api/community-application/route");
const { POST: researchPost } = await import("@/app/api/research-response/route");
const { GET: exportGet } = await import("@/app/api/admin/export/route");
const { createOrReturnWaitlistUser } = await import("@/lib/waitlist/signup");
const { CONFIRM_TTL_DAYS, RESEND_COOLDOWN_MS } = await import("@/lib/waitlist/verify-token");
const { db } = await import("@/lib/db");

let ipCounter = 0;
function nextIp(): string {
  ipCounter += 1;
  return `10.9.${Math.floor(ipCounter / 200)}.${ipCounter % 200}`;
}

function post(handler: (req: Request) => Promise<Response>, body: unknown, ip?: string) {
  return handler(
    new Request("http://localhost/api/test", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip ?? nextIp(),
      },
      body: JSON.stringify(body),
    }),
  );
}

function confirm(token: string, ip?: string) {
  return confirmGet(
    new Request(`http://localhost/api/waitlist/confirm?token=${encodeURIComponent(token)}`, {
      headers: { "x-forwarded-for": ip ?? nextIp() },
    }),
  );
}

/** Where a confirm click landed: the /confirmed search params. */
function landing(res: Response): URLSearchParams {
  expect(res.status).toBe(303);
  const location = res.headers.get("location");
  expect(location).toContain("/confirmed");
  return new URL(location!).searchParams;
}

const validBody = (name: string, extra: Record<string, unknown> = {}) => ({
  email: email(name),
  firstName: "Test",
  userType: "COMMUNITY_MEMBER",
  communities: ["bitcoin"],
  consent: true,
  ...extra,
});

/** The route's own write path, called directly so the test can hold the
    token. Narrows away the "duplicate" arm — no test here expects one. */
async function signupDirect(name: string, extra: Record<string, unknown> = {}) {
  const result = await createOrReturnWaitlistUser({
    email: email(name),
    userType: "COMMUNITY_MEMBER",
    communities: ["bitcoin"],
    ...extra,
  });
  if (result.outcome === "duplicate") throw new Error(`unexpected duplicate for ${name}`);
  return result;
}

const rowOf = (name: string) => db.waitlistUser.findUnique({ where: { email: email(name) } });

/** Rewind the stored expiry so the token reads as issued before the cooldown. */
function ageTokenPastCooldown(name: string) {
  return db.waitlistUser.update({
    where: { email: email(name) },
    data: {
      verifyTokenExpiresAt: new Date(
        Date.now() + CONFIRM_TTL_DAYS * 86_400_000 - RESEND_COOLDOWN_MS - 60_000,
      ),
    },
  });
}

async function cleanup() {
  await db.waitlistUser.deleteMany({ where: { email: { endsWith: `@${DOMAIN}` } } });
  await db.rateLimitCounter.deleteMany({});
}

beforeAll(cleanup);
afterAll(async () => {
  await cleanup();
  await db.$disconnect();
});

describe("POST /api/waitlist (double opt-in)", () => {
  it("creates a PENDING signup: no position, hashed token, 'check your inbox' — despite the email outage", async () => {
    const res = await post(waitlistPost, validBody("happy"));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toEqual({ ok: true, status: "pending" });

    const row = await rowOf("happy");
    expect(row).not.toBeNull();
    expect(row!.confirmedAt).toBeNull();
    expect(row!.position).toBeNull();
    expect(row!.verifyTokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(row!.verifyTokenExpiresAt!.getTime()).toBeGreaterThan(Date.now());
    expect(row!.communities).toEqual(["bitcoin"]);
    expect(row!.consentTimestamp).toBeInstanceOf(Date);
  });

  it("throttles an immediate re-submit: identical answer, token untouched, nothing to send", async () => {
    await post(waitlistPost, validBody("dupe"));
    const before = await rowOf("dupe");

    const res = await post(waitlistPost, validBody("dupe"));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, status: "pending" });

    const after = await rowOf("dupe");
    expect(after!.verifyTokenHash).toBe(before!.verifyTokenHash);
    expect(await db.waitlistUser.count({ where: { email: email("dupe") } })).toBe(1);
  });

  it("rotates the token for a pending re-submit once the cooldown has passed", async () => {
    await post(waitlistPost, validBody("dupe2"));
    const before = await rowOf("dupe2");
    await ageTokenPastCooldown("dupe2");

    const res = await post(waitlistPost, validBody("dupe2"));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, status: "pending" });

    const after = await rowOf("dupe2");
    expect(after!.verifyTokenHash).not.toBe(before!.verifyTokenHash);
    expect(await db.waitlistUser.count({ where: { email: email("dupe2") } })).toBe(1);
  });

  it("echoes position and link for an already CONFIRMED duplicate", async () => {
    const { verifyToken } = await signupDirect("confdupe");
    await confirm(verifyToken!);

    const res = await post(waitlistPost, validBody("confdupe"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("confirmed");
    expect(data.duplicate).toBe(true);
    expect(data.position).toBeGreaterThan(0);
    expect(data.referralCode).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/);
    expect(data.referralUrl).toContain(`?ref=${data.referralCode}`);
  });

  it("detects duplicates through Gmail normalization", async () => {
    await post(waitlistPost, validBody("gmail", { email: "wait.list+a@gmail.com" }));
    const res = await post(waitlistPost, validBody("gmail", { email: "waitlist@gmail.com" }));
    expect(await res.json()).toEqual({ ok: true, status: "pending" });
    expect(await db.waitlistUser.count({ where: { email: "waitlist@gmail.com" } })).toBe(1);
    await db.waitlistUser.deleteMany({ where: { email: "waitlist@gmail.com" } });
  });

  it("records attribution at signup but credits the referrer NOTHING until confirm", async () => {
    const { user: referrer, verifyToken } = await signupDirect("referrer");
    await confirm(verifyToken!);

    const res = await post(
      waitlistPost,
      validBody("referred", { referralCode: referrer.referralCode }),
    );
    expect((await res.json()).status).toBe("pending");

    const referrerRow = await rowOf("referrer");
    const referredRow = await rowOf("referred");
    expect(referredRow!.referredById).toBe(referrer.id);
    // The farmable moment: signup alone must be worth zero.
    expect(referrerRow!.referralCount).toBe(0);
  });

  it("ignores unknown referral codes silently", async () => {
    const res = await post(waitlistPost, validBody("stray", { referralCode: "ZZZZ9999" }));
    expect((await res.json()).ok).toBe(true);
    expect((await rowOf("stray"))!.referredById).toBeNull();
  });

  it("answers a filled honeypot exactly like a fresh signup and stores nothing", async () => {
    const res = await post(waitlistPost, validBody("bot1", { nickname: "Totally Human" }));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, status: "pending" });
    expect(await rowOf("bot1")).toBeNull();
  });

  it("treats a too-fast submission the same way", async () => {
    const res = await post(waitlistPost, validBody("bot2", { startedAt: Date.now() - 100 }));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, status: "pending" });
    expect(await rowOf("bot2")).toBeNull();
  });

  it("heals a deploy-window row (pending, tokenless): issues a token, drops pre-credited attribution", async () => {
    const { user: referrer, verifyToken } = await signupDirect("legacy-ref");
    await confirm(verifyToken!);
    // Simulate a row written by pre-double-opt-in code during the
    // migrate→deploy window: pending, no token, referrer credited at signup.
    await db.waitlistUser.create({
      data: {
        email: email("legacy"),
        emailRaw: email("legacy"),
        userType: "COMMUNITY_MEMBER",
        communities: [],
        referralCode: "1EGACY01",
        referredById: referrer.id,
        consentTimestamp: new Date(),
      },
    });
    await db.waitlistUser.update({
      where: { id: referrer.id },
      data: { referralCount: { increment: 1 } },
    });
    const creditBefore = (await rowOf("legacy-ref"))!.referralCount;

    const res = await post(waitlistPost, validBody("legacy"));
    expect(res.status).toBe(201);

    const healed = await rowOf("legacy");
    expect(healed!.verifyTokenHash).toMatch(/^[0-9a-f]{64}$/);
    // Attribution dropped, so confirming the healed row cannot double-credit.
    expect(healed!.referredById).toBeNull();
    expect((await rowOf("legacy-ref"))!.referralCount).toBe(creditBefore);
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

describe("GET /api/waitlist/confirm", () => {
  it("confirms: sets confirmedAt, assigns a position, redirects to the celebration — despite the email outage", async () => {
    const { verifyToken } = await signupDirect("clicks");

    const params = landing(await confirm(verifyToken!));
    const row = await rowOf("clicks");

    expect(params.get("s")).toBe("ok");
    expect(params.get("dup")).toBeNull();
    expect(params.get("c")).toBe(row!.referralCode);
    expect(Number(params.get("p"))).toBe(row!.position);
    expect(row!.confirmedAt).toBeInstanceOf(Date);
    expect(row!.position).toBeGreaterThan(0);
  });

  it("assigns positions by confirm order, densely — signup order and abandoned rows don't count", async () => {
    await signupDirect("order-a");
    const b = await signupDirect("order-b");
    const c = await signupDirect("order-c");

    await confirm(c.verifyToken!);
    await confirm(b.verifyToken!);

    const posC = (await rowOf("order-c"))!.position!;
    const posB = (await rowOf("order-b"))!.position!;
    expect(posB).toBe(posC + 1);
    expect((await rowOf("order-a"))!.position).toBeNull();
  });

  it("credits the referrer exactly once, at confirm time", async () => {
    const { user: referrer, verifyToken: referrerToken } = await signupDirect("earn");
    await confirm(referrerToken!);

    const referee = await signupDirect("earned", { referralCode: referrer.referralCode });
    expect((await rowOf("earn"))!.referralCount).toBe(0);

    await confirm(referee.verifyToken!);
    expect((await rowOf("earn"))!.referralCount).toBe(1);

    // The same link again: "already", no second credit, position unchanged.
    const again = landing(await confirm(referee.verifyToken!));
    expect(again.get("s")).toBe("ok");
    expect(again.get("dup")).toBe("1");
    expect((await rowOf("earn"))!.referralCount).toBe(1);
  });

  it("survives two simultaneous clicks on the same link: one confirm, one credit", async () => {
    const { user: referrer, verifyToken: referrerToken } = await signupDirect("race-ref");
    await confirm(referrerToken!);
    const referee = await signupDirect("race", { referralCode: referrer.referralCode });

    await Promise.all([confirm(referee.verifyToken!), confirm(referee.verifyToken!)]);

    expect((await rowOf("race-ref"))!.referralCount).toBe(1);
    expect((await rowOf("race"))!.position).toBeGreaterThan(0);
  });

  it("gives concurrent confirms of different users distinct positions", async () => {
    const a = await signupDirect("par-a");
    const b = await signupDirect("par-b");

    await Promise.all([confirm(a.verifyToken!), confirm(b.verifyToken!)]);

    const posA = (await rowOf("par-a"))!.position;
    const posB = (await rowOf("par-b"))!.position;
    expect(posA).toBeGreaterThan(0);
    expect(posB).toBeGreaterThan(0);
    expect(posA).not.toBe(posB);
  });

  it("sends an unknown token to 'invalid'", async () => {
    const params = landing(await confirm("A".repeat(43)));
    expect(params.get("s")).toBe("invalid");
  });

  it("sends an expired token to 'expired' and leaves the row pending", async () => {
    const { verifyToken } = await signupDirect("late");
    await db.waitlistUser.update({
      where: { email: email("late") },
      data: { verifyTokenExpiresAt: new Date(Date.now() - 1000) },
    });

    const params = landing(await confirm(verifyToken!));
    expect(params.get("s")).toBe("expired");

    const row = await rowOf("late");
    expect(row!.confirmedAt).toBeNull();
    expect(row!.position).toBeNull();
  });

  it("kills the old link when a post-cooldown re-signup rotates the token", async () => {
    const first = await signupDirect("rotate");
    await ageTokenPastCooldown("rotate");
    const second = await signupDirect("rotate");
    expect(second.outcome).toBe("resent");
    expect(second.verifyToken).toBeDefined();

    expect(landing(await confirm(first.verifyToken!)).get("s")).toBe("invalid");
    expect(landing(await confirm(second.verifyToken!)).get("s")).toBe("ok");
  });

  it("issues no token inside the cooldown, so the inbox link keeps working", async () => {
    const first = await signupDirect("calm");
    const second = await signupDirect("calm");
    expect(second.outcome).toBe("resent");
    expect(second.verifyToken).toBeUndefined();

    expect(landing(await confirm(first.verifyToken!)).get("s")).toBe("ok");
  });
});

describe("POST /api/community-application (double opt-in)", () => {
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

  it("creates the leader as a PENDING waitlist user plus an application row", async () => {
    const res = await post(applicationPost, app());
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, status: "pending" });

    const user = await db.waitlistUser.findUnique({
      where: { email: email("leader") },
      include: { communityApplication: true },
    });
    expect(user!.userType).toBe("COMMUNITY_LEADER");
    expect(user!.confirmedAt).toBeNull();
    expect(user!.position).toBeNull();
    expect(user!.communityApplication!.communityName).toBe("Ada's Makers");
  });

  it("revises the application on resubmit instead of duplicating", async () => {
    const res = await post(applicationPost, app({ communityName: "Ada's Makers v2" }));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true, status: "pending" });

    const applications = await db.communityApplication.findMany({
      where: { waitlistUser: { email: email("leader") } },
    });
    expect(applications).toHaveLength(1);
    expect(applications[0].communityName).toBe("Ada's Makers v2");
  });
});

describe("POST /api/research-response", () => {
  it("stores a response keyed by referral code", async () => {
    await post(waitlistPost, validBody("research"));
    const row = await rowOf("research");

    const res = await post(researchPost, {
      referralCode: row!.referralCode,
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

  it("streams a CSV with confirmation columns and formula-safe values", async () => {
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
    expect(csv).toContain(",confirmed,confirmed_at");
    expect(csv).toContain(email("evilname"));
    expect(csv).toContain("'=HYPERLINK(evil)");
    expect(csv).not.toContain(",=HYPERLINK");

    // The pending row is present and marked unconfirmed.
    const evilRow = csv.split("\n").find((line) => line.includes(email("evilname")));
    expect(evilRow).toContain(",false,");
    delete process.env.ADMIN_EXPORT_TOKEN;
  });
});
