import { NextResponse } from "next/server";

import { WaitlistConfirmation, waitlistConfirmationText } from "@emails/waitlist-confirmation";
import { labelsFor } from "@/lib/communities";
import { sendEmail } from "@/lib/email/send";
import { decoySuccess, isBotSubmission } from "@/lib/security/anti-bot";
import { checkRateLimit, clientIp, pruneExpiredCounters } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { SITE } from "@/content/site";
import { waitlistSubmissionSchema } from "@/lib/validation/waitlist";
import { referralUrl } from "@/lib/waitlist/referral-code";
import { createOrReturnWaitlistUser } from "@/lib/waitlist/signup";
import type { WaitlistResponse } from "@/lib/waitlist/types";

/**
 * POST /api/waitlist — the one conversion this site exists for.
 *
 * Defence order (docs/00 §3, Stage 4): rate limit → honeypot/timing →
 * Turnstile → Zod → normalize → upsert-or-return-existing → referral
 * attribution → email → respond. Cheap checks run first; the database is
 * touched only after every gate has passed.
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
      { ok: false as const, error: "Too many attempts from this connection — wait a few minutes and try again." },
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
      { ok: false as const, error: "The submission didn't arrive intact — try again." },
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
    return NextResponse.json(decoySuccess(String(raw.email ?? ip), SITE.url));
  }

  const token = typeof raw.turnstileToken === "string" ? raw.turnstileToken : undefined;
  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json(
      { ok: false as const, error: "We couldn't confirm you're human — reload the page and try once more." },
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
    const { user, duplicate } = await createOrReturnWaitlistUser({
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

    const link = referralUrl(SITE.url, user.referralCode);

    if (!duplicate) {
      const emailProps = {
        firstName: user.firstName,
        position: user.position,
        referralUrl: link,
        communityLabels: labelsFor(user.communities),
        siteUrl: SITE.url,
      };
      await sendEmail({
        to: user.emailRaw,
        subject: `You're #${user.position} on the Bitplaza waitlist`,
        react: WaitlistConfirmation(emailProps),
        text: waitlistConfirmationText(emailProps),
      });
    }

    return NextResponse.json(
      {
        ok: true as const,
        duplicate,
        position: user.position,
        referralCode: user.referralCode,
        referralUrl: link,
      },
      { status: duplicate ? 200 : 201 },
    );
  } catch (error) {
    console.error("waitlist: signup failed", error);
    return NextResponse.json(
      { ok: false as const, error: "Something went wrong on our side — your details were not saved. Try again in a minute." },
      { status: 500 },
    );
  }
}
