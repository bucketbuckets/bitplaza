import { Prisma, type UserType, type WaitlistUser } from "@prisma/client";

import { db } from "@/lib/db";
import { canonicalizeReferralCode, generateReferralCode } from "./referral-code";
import { normalizeEmail } from "./normalize-email";
import {
  generateVerifyToken,
  hashVerifyToken,
  RESEND_COOLDOWN_MS,
  tokenIssuedAt,
  verifyTokenExpiry,
} from "./verify-token";

/**
 * The one write path onto the waitlist, shared by /api/waitlist and
 * /api/community-application so the two forms cannot drift.
 *
 * Double opt-in (HANDOFF §17): a new signup is a PENDING row — no position,
 * no referral credit — plus a single-use confirm token. Only the token's
 * hash is stored; the plaintext is returned once for the confirm email and
 * never persisted. lib/waitlist/confirm.ts is the other half.
 *
 * Duplicate policy:
 *   confirmed row → returned as before, position and referral code included.
 *     "You're already in, here's your place" turns a confused retry into a
 *     second look at the referral link. (Deliberate trade-off, docs/00 §4:
 *     this confirms membership to anyone who guesses an address; accepted
 *     for a public waitlist.)
 *   pending row, current token older than RESEND_COOLDOWN_MS → the token is
 *     ROTATED (the old link dies) and the caller re-sends the confirm email.
 *   pending row inside the cooldown → same answer, no token, NOTHING SENT.
 *     The cooldown is the cap on mailbombing an address and on griefing
 *     someone by killing their link faster than they can click it.
 *   Every pending outcome is answered identically on the wire, so whether an
 *   address is already waiting is never disclosed.
 *
 * Referral attribution still resolves at signup — the code arrives with the
 * form — but the referrer's count increments only when this row CONFIRMS.
 * That is what makes farming fake addresses worthless. A re-submit of a
 * pending address deliberately updates NOTHING but the token: honoring a new
 * referral code on re-submit would let anyone attach their code to someone
 * else's pending signup.
 */

export interface SignupInput {
  email: string;
  firstName?: string;
  userType: UserType;
  communities: string[];
  primaryGoal?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export type SignupOutcome = "created" | "resent" | "duplicate";

export type SignupResult =
  /** Already confirmed: echo their place; nothing to send. */
  | { user: WaitlistUser; outcome: "duplicate" }
  /** Pending re-submit. verifyToken present → email it; absent → cooldown, send nothing. */
  | { user: WaitlistUser; outcome: "resent"; verifyToken?: string }
  /** Fresh signup. Plaintext token — email it; never store it. */
  | { user: WaitlistUser; outcome: "created"; verifyToken: string };

const CODE_RETRIES = 3;

/** An address already on the list: confirmed rows echo back, pending rows rotate. */
async function returnExisting(existing: WaitlistUser): Promise<SignupResult> {
  if (existing.confirmedAt) return { user: existing, outcome: "duplicate" };

  // A recent-enough link is already sitting in their inbox: same answer,
  // no rotation, no email. (Age is derived from the stored expiry.)
  if (
    existing.verifyTokenHash &&
    existing.verifyTokenExpiresAt &&
    Date.now() - tokenIssuedAt(existing.verifyTokenExpiresAt).getTime() < RESEND_COOLDOWN_MS
  ) {
    return { user: existing, outcome: "resent" };
  }

  const verifyToken = generateVerifyToken();
  const user = await db.waitlistUser.update({
    where: { id: existing.id },
    data: {
      verifyTokenHash: hashVerifyToken(verifyToken),
      verifyTokenExpiresAt: verifyTokenExpiry(),
      // A pending row with NO token can only have been written by
      // pre-double-opt-in code (the migrate→deploy window). That code
      // already credited the referrer at signup — drop the attribution so
      // confirming the healed row cannot credit the same referrer twice.
      ...(existing.verifyTokenHash ? {} : { referredById: null }),
    },
  });
  return { user, outcome: "resent", verifyToken };
}

export async function createOrReturnWaitlistUser(input: SignupInput): Promise<SignupResult> {
  const email = normalizeEmail(input.email);

  const existing = await db.waitlistUser.findUnique({ where: { email } });
  if (existing) return returnExisting(existing);

  const wantedCode = canonicalizeReferralCode(input.referralCode);
  const verifyToken = generateVerifyToken();

  for (let attempt = 0; ; attempt++) {
    try {
      let referredById: string | null = null;

      if (wantedCode) {
        const referrer = await db.waitlistUser.findUnique({
          where: { referralCode: wantedCode },
          select: { id: true, email: true },
        });
        // Unknown code: ignored. Own code: ignored — you cannot refer yourself.
        // No count increment here; credit lands when this signup confirms.
        if (referrer && referrer.email !== email) {
          referredById = referrer.id;
        }
      }

      const user = await db.waitlistUser.create({
        data: {
          email,
          emailRaw: input.email.trim(),
          firstName: input.firstName || null,
          userType: input.userType,
          communities: input.communities,
          primaryGoal: input.primaryGoal || null,
          referralCode: generateReferralCode(),
          referredById,
          verifyTokenHash: hashVerifyToken(verifyToken),
          verifyTokenExpiresAt: verifyTokenExpiry(),
          utmSource: input.utmSource || null,
          utmMedium: input.utmMedium || null,
          utmCampaign: input.utmCampaign || null,
          consentTimestamp: new Date(),
        },
      });

      return { user, outcome: "created", verifyToken };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = (error.meta?.target ?? []) as string[];

        // Two people submitted the same new address concurrently — the loser
        // of the race gets the existing-row path, same as a sequential retry.
        if (target.includes("email")) {
          const winner = await db.waitlistUser.findUnique({ where: { email } });
          if (winner) return returnExisting(winner);
        }

        // Referral-code collision (~1 in 10^12 per pair): draw again.
        if (target.includes("referralCode") && attempt < CODE_RETRIES) continue;
      }
      throw error;
    }
  }
}
