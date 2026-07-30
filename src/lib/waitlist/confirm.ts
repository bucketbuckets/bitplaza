import { Prisma, type WaitlistUser } from "@prisma/client";

import { db } from "@/lib/db";
import { hashVerifyToken } from "./verify-token";

/**
 * The confirm half of double opt-in (lib/waitlist/signup.ts issues the
 * tokens). Everything the pending state withheld is granted here, in one
 * transaction: confirmedAt, the position, and the referrer's credit.
 *
 * Position is MAX(position)+1 read inside the transaction. Two concurrent
 * confirms can draw the same number; the unique constraint fails the loser
 * and the loop redraws. Numbers therefore stay dense from the double-opt-in
 * migration onward — pending and abandoned signups never consume one.
 *
 * A confirmed row keeps its (now inert) token hash so a second click on the
 * same link lands on "already", not on a confusing "invalid".
 */

export type ConfirmResult =
  | { outcome: "invalid" }
  | { outcome: "expired" }
  | { outcome: "already"; user: WaitlistUser }
  | { outcome: "confirmed"; user: WaitlistUser };

const POSITION_RETRIES = 5;

export async function confirmWaitlistUser(
  token: string,
  now: Date = new Date(),
): Promise<ConfirmResult> {
  // Real tokens are 43 chars of base64url; anything wildly off skips the DB.
  if (token.length < 20 || token.length > 128) return { outcome: "invalid" };

  const user = await db.waitlistUser.findUnique({
    where: { verifyTokenHash: hashVerifyToken(token) },
  });
  if (!user) return { outcome: "invalid" };
  if (user.confirmedAt) return { outcome: "already", user };
  if (!user.verifyTokenExpiresAt || user.verifyTokenExpiresAt < now) {
    return { outcome: "expired" };
  }

  for (let attempt = 0; ; attempt++) {
    try {
      const confirmed = await db.$transaction(async (tx) => {
        // Serialize position allocation across concurrent confirms. The
        // P2002 redraw below still guards the path, but under a burst it
        // could exhaust its retries; the lock (released at commit) makes
        // that impossible. Key is an arbitrary app-unique constant.
        // (::text because Prisma cannot deserialize the bare void return.)
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(816451)::text`;
        const max = await tx.waitlistUser.aggregate({ _max: { position: true } });
        const position = (max._max.position ?? 0) + 1;

        // Only one concurrent click can flip a null confirmedAt; the loser
        // of that race gets count 0 and the "already" path outside.
        const flipped = await tx.waitlistUser.updateMany({
          where: { id: user.id, confirmedAt: null },
          data: { confirmedAt: now, position },
        });
        if (flipped.count === 0) return null;

        if (user.referredById) {
          await tx.waitlistUser.update({
            where: { id: user.referredById },
            data: { referralCount: { increment: 1 } },
          });
        }

        return tx.waitlistUser.findUniqueOrThrow({ where: { id: user.id } });
      });

      if (!confirmed) {
        const fresh = await db.waitlistUser.findUniqueOrThrow({ where: { id: user.id } });
        return { outcome: "already", user: fresh };
      }
      return { outcome: "confirmed", user: confirmed };
    } catch (error) {
      // Two confirms drew the same position — redraw against the new max.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        attempt < POSITION_RETRIES
      ) {
        continue;
      }
      throw error;
    }
  }
}
