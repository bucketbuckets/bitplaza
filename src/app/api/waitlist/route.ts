import { NextResponse } from "next/server";

import { ConfirmSignup, confirmSignupSubject, confirmSignupText } from "@emails/confirm-signup";
import { sendEmail } from "@/lib/email/send";
import { decoySuccess, isBotSubmission } from "@/lib/security/anti-bot";
import { checkRateLimit, clientIp, pruneExpiredCounters } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { SITE } from "@/content/site";
import { waitlistSubmissionSchema } from "@/lib/validation/waitlist";
import { referralUrl } from "@/lib/waitlist/referral-code";
import { createOrReturnWaitlistUser } from "@/lib/waitlist/signup";
import type { WaitlistResponse } from "@/lib/waitlist/types";
import { CONFIRM_TTL_DAYS } from "@/lib/waitlist/verify-token";

/**
 * POST /api/waitlist — the one conversion this site exists for.
 *
 * Defence order (docs/00 §3, Stage 4): rate limit → honeypot/timing →
 * Turnstile → Zod → normalize → upsert-or-return-existing → confirm email →
 * respond. Cheap checks run first; the database is touched only after every
 * gate has passed. Since double opt-in, the row starts PENDING — position
 * and referral credit are granted by /api/waitlist/confirm when the emailed
 * link is clicked.
 *
 * The email is sent after the row is committed and its failure is swallowed
 * inside sendEmail — an email outage must never fail a signup.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32_000;

export async function POST(request: Request): Promise<NextResponse<WaitlistResponse>> {
  const ip = clientIp(request);

  if (!(await checkRateLimit(ip, "waitlist"))) {
    return NextResponse.json(
      { ok: false as const, error: "Too many attempts from this connection. Wait a few minutes and try again." },
      { status: 429 },
    );
  }
  // Housekeeping, off the response path.
  void pruneExpiredCounters().catch(() => {});

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false as const, error: "That submission is too large." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false as const, error: "The submission didn't arrive intact. Try again." },
      { status: 400 },
    );
  }

  const raw = (body ?? {}) as Record<string, unknown>;

  // Bots get a plausible success and no row. Never an error: telling a bot it
  // was caught is telling its author what to fix.
  if (
    isBotSubmission({
      nickname: typeof raw.nickname === "string" ? raw.nickname : undefined,
      startedAt: typeof raw.startedAt === "number" ? raw.startedAt : undefined,
    })
  ) {
    // 201 + pending: byte-for-byte what a real first signup answers.
    return NextResponse.json(decoySuccess(), { status: 201 });
  }

  const token = typeof raw.turnstileToken === "string" ? raw.turnstileToken : undefined;
  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json(
      { ok: false as const, error: "We couldn't confirm you're human. Reload the page and try once more." },
      { status: 400 },
    );
  }

  const parsed = waitlistSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!(field in fieldErrors)) fieldErrors[field] = issue.message;
    }
    return NextResponse.json(
      { ok: false as const, error: "Check the highlighted fields and try again.", fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const result = await createOrReturnWaitlistUser({
      email: data.email,
      firstName: data.firstName,
      userType: data.userType,
      communities: data.communities,
      primaryGoal: data.primaryGoal,
      referralCode: data.referralCode,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
    });

    // Already confirmed: echo their place back, exactly as before double
    // opt-in. Position is always set on a confirmed row; ?? 0 is for types.
    if (result.outcome === "duplicate") {
      const { user } = result;
      return NextResponse.json(
        {
          ok: true as const,
          status: "confirmed" as const,
          duplicate: true,
          position: user.position ?? 0,
          referralCode: user.referralCode,
          referralUrl: referralUrl(SITE.url, user.referralCode),
        },
        { status: 200 },
      );
    }

    // Pending: the confirm email carries the only copy of the plaintext
    // token (absent = cooldown, a recent link is already in their inbox).
    // The welcome email with position and referral link is sent by the
    // confirm route once the click lands. The link is built on the origin
    // that served THIS request so preview deployments email preview links.
    if (result.verifyToken) {
      const { user } = result;
      const confirmProps = {
        firstName: user.firstName,
        confirmUrl: `${new URL(request.url).origin}/api/waitlist/confirm?token=${result.verifyToken}`,
        siteUrl: SITE.url,
        expiresInDays: CONFIRM_TTL_DAYS,
      };
      await sendEmail({
        to: user.emailRaw,
        subject: confirmSignupSubject,
        react: ConfirmSignup(confirmProps),
        text: confirmSignupText(confirmProps),
      });
    }

    // One constant answer for every pending outcome — fresh, re-send, or
    // throttled — so whether an address was already waiting never leaks.
    return NextResponse.json({ ok: true as const, status: "pending" as const }, { status: 201 });
  } catch (error) {
    console.error("waitlist: signup failed", error);
    return NextResponse.json(
      { ok: false as const, error: "Something went wrong on our side. Your details were not saved. Try again in a minute." },
      { status: 500 },
    );
  }
}
