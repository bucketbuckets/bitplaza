import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { checkRateLimit, clientIp } from "@/lib/security/rate-limit";
import { researchResponseSchema } from "@/lib/validation/waitlist";
import { canonicalizeReferralCode } from "@/lib/waitlist/referral-code";

/**
 * POST /api/research-response — the optional question on the success state.
 *
 * The respondent is identified by their referral code (returned to their
 * browser at signup), never by a raw database id. Low ceremony by design: the
 * answer is a gift, and a gift with a CAPTCHA attached gets withdrawn — the
 * rate limit and a per-user cap carry the abuse load instead.
 */

export const runtime = "nodejs";

/** More answers than this from one signup is scripting, not enthusiasm. */
const MAX_RESPONSES_PER_USER = 5;

export async function POST(request: Request): Promise<NextResponse> {
  const ip = clientIp(request);

  if (!(await checkRateLimit(ip, "research-response"))) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Wait a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "The submission didn't arrive intact. Try again." },
      { status: 400 },
    );
  }

  const parsed = researchResponseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Write a sentence or two, up to 2,000 characters." },
      { status: 400 },
    );
  }

  const code = canonicalizeReferralCode(parsed.data.referralCode);
  if (!code) {
    return NextResponse.json({ ok: false, error: "We couldn't match your signup." }, { status: 400 });
  }

  try {
    const user = await db.waitlistUser.findUnique({
      where: { referralCode: code },
      select: { id: true, _count: { select: { researchResponses: true } } },
    });
    if (!user) {
      return NextResponse.json({ ok: false, error: "We couldn't match your signup." }, { status: 400 });
    }
    if (user._count.researchResponses >= MAX_RESPONSES_PER_USER) {
      // Enough. Answer as success so nothing breaks; store nothing.
      return NextResponse.json({ ok: true });
    }

    await db.researchResponse.create({
      data: {
        waitlistUserId: user.id,
        question: parsed.data.question,
        response: parsed.data.response,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("research-response: save failed", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our side. Try again in a minute." },
      { status: 500 },
    );
  }
}
