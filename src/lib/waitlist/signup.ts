import { Prisma, type UserType, type WaitlistUser } from "@prisma/client";

import { db } from "@/lib/db";
import { canonicalizeReferralCode, generateReferralCode } from "./referral-code";
import { normalizeEmail } from "./normalize-email";

/**
 * The one write path onto the waitlist, shared by /api/waitlist and
 * /api/community-application so the two forms cannot drift.
 *
 * Duplicate policy: an address already on the list gets its existing row back
 * — position and referral code included — never an error. They already have
 * both by email, and "you're already in, here's your place" converts a
 * confused retry into a second look at the referral link. (Deliberate
 * trade-off, docs/00 §4: this confirms membership to anyone who guesses an
 * address; accepted for a public waitlist.)
 *
 * Referral attribution runs inside the same transaction as the insert:
 * resolve code → reject self-referral → set referredById → increment the
 * referrer's count. An invalid or unknown code is ignored silently — it must
 * never cost a signup.
 */

export interface SignupInput {
  email: string;
  firstName: string;
  userType: UserType;
  communities: string[];
  primaryGoal?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface SignupResult {
  user: WaitlistUser;
  duplicate: boolean;
  /** True when this signup was attributed to a referrer. */
  referred: boolean;
}

const CODE_RETRIES = 3;

export async function createOrReturnWaitlistUser(input: SignupInput): Promise<SignupResult> {
  const email = normalizeEmail(input.email);

  const existing = await db.waitlistUser.findUnique({ where: { email } });
  if (existing) return { user: existing, duplicate: true, referred: false };

  const wantedCode = canonicalizeReferralCode(input.referralCode);

  for (let attempt = 0; ; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        let referredById: string | null = null;

        if (wantedCode) {
          const referrer = await tx.waitlistUser.findUnique({
            where: { referralCode: wantedCode },
            select: { id: true, email: true },
          });
          // Unknown code: ignored. Own code: ignored — you cannot refer yourself.
          if (referrer && referrer.email !== email) {
            referredById = referrer.id;
            await tx.waitlistUser.update({
              where: { id: referrer.id },
              data: { referralCount: { increment: 1 } },
            });
          }
        }

        const user = await tx.waitlistUser.create({
          data: {
            email,
            emailRaw: input.email.trim(),
            firstName: input.firstName,
            userType: input.userType,
            communities: input.communities,
            primaryGoal: input.primaryGoal || null,
            referralCode: generateReferralCode(),
            referredById,
            utmSource: input.utmSource || null,
            utmMedium: input.utmMedium || null,
            utmCampaign: input.utmCampaign || null,
            consentTimestamp: new Date(),
          },
        });

        return { user, duplicate: false, referred: referredById !== null };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = (error.meta?.target ?? []) as string[];

        // Two people submitted the same new address concurrently — the loser
        // of the race gets the duplicate path, same as a sequential retry.
        if (target.includes("email")) {
          const winner = await db.waitlistUser.findUnique({ where: { email } });
          if (winner) return { user: winner, duplicate: true, referred: false };
        }

        // Referral-code collision (~1 in 10^12 per pair): draw again.
        if (target.includes("referralCode") && attempt < CODE_RETRIES) continue;
      }
      throw error;
    }
  }
}
