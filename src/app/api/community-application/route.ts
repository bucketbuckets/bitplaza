import { NextResponse } from "next/server";

import {
  CommunityApplicationReceived,
  communityApplicationReceivedText,
} from "@emails/community-application-received";
import { ConfirmSignup, confirmSignupSubject, confirmSignupText } from "@emails/confirm-signup";
import { sendEmail } from "@/lib/email/send";
import { decoySuccess, isBotSubmission } from "@/lib/security/anti-bot";
import { checkRateLimit, clientIp } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { SITE } from "@/content/site";
import { communityApplicationSchema } from "@/lib/validation/waitlist";
import { referralUrl } from "@/lib/waitlist/referral-code";
import { createOrReturnWaitlistUser } from "@/lib/waitlist/signup";
import type { ApplicationResponse } from "@/lib/waitlist/types";
import { CONFIRM_TTL_DAYS } from "@/lib/waitlist/verify-token";
import { db } from "@/lib/db";

/**
 * POST /api/community-application — the leader flow.
 *
 * Same defence chain as /api/waitlist. Creates (or reuses) a WaitlistUser as
 * COMMUNITY_LEADER, then upserts the application row — a second submission
 * revises the application rather than erroring or duplicating.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32_000;

export async function POST(request: Request): Promise<NextResponse<ApplicationResponse>> {
  const ip = clientIp(request);

  if (!(await checkRateLimit(ip, "community-application"))) {
    return NextResponse.json(
      { ok: false as const, error: "Too many attempts from this connection — wait a few minutes and try again." },
      { status: 429 },
    );
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
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

  if (
    isBotSubmission({
      nickname: typeof raw.nickname === "string" ? raw.nickname : undefined,
      startedAt: typeof raw.startedAt === "number" ? raw.startedAt : undefined,
    })
  ) {
    // 201 + pending: byte-for-byte what a real first submission answers.
    return NextResponse.json(decoySuccess(), { status: 201 });
  }

  const token = typeof raw.turnstileToken === "string" ? raw.turnstileToken : undefined;
  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json(
      { ok: false as const, error: "We couldn't confirm you're human — reload the page and try once more." },
      { status: 400 },
    );
  }

  const parsed = communityApplicationSchema.safeParse(body);
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
      userType: "COMMUNITY_LEADER",
      communities: [],
      referralCode: data.referralCode,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
    });
    const { user } = result;

    const existingApplication = await db.communityApplication.findUnique({
      where: { waitlistUserId: user.id },
      select: { id: true },
    });

    await db.communityApplication.upsert({
      where: { waitlistUserId: user.id },
      create: {
        waitlistUserId: user.id,
        communityName: data.communityName,
        communitySize: data.communitySize,
        currentTools: data.currentTools,
        primaryProblem: data.primaryProblem,
        plazaVision: data.plazaVision ?? "",
        website: data.website || null,
      },
      update: {
        communityName: data.communityName,
        communitySize: data.communitySize,
        currentTools: data.currentTools,
        primaryProblem: data.primaryProblem,
        plazaVision: data.plazaVision ?? "",
        website: data.website || null,
      },
    });

    if (!existingApplication) {
      // The form's name, not the row's: an email-first signup may hold null.
      const emailProps = {
        firstName: data.firstName,
        communityName: data.communityName,
        siteUrl: SITE.url,
      };
      await sendEmail({
        to: user.emailRaw,
        subject: `We received your application for ${data.communityName}`,
        react: CommunityApplicationReceived(emailProps),
        text: communityApplicationReceivedText(emailProps),
      });
    }

    // Mirrors /api/waitlist: a pending applicant still needs the confirm
    // click to hold a place in line — the application itself is received
    // either way and reviewed by a person. Same constant pending answer,
    // same cooldown on re-sends, same origin-derived link.
    if (result.outcome !== "duplicate") {
      if (result.verifyToken) {
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
      return NextResponse.json(
        { ok: true as const, status: "pending" as const },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        ok: true as const,
        status: "confirmed" as const,
        duplicate: true,
        position: user.position ?? 0,
        referralCode: user.referralCode,
        referralUrl: referralUrl(SITE.url, user.referralCode),
      },
      { status: existingApplication ? 200 : 201 },
    );
  } catch (error) {
    console.error("community-application: submit failed", error);
    return NextResponse.json(
      { ok: false as const, error: "Something went wrong on our side — your application was not saved. Try again in a minute." },
      { status: 500 },
    );
  }
}
