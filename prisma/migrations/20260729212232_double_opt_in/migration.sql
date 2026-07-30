-- Double opt-in (HANDOFF §17): signups are PENDING until the emailed link is
-- clicked. Position and referral credit are assigned at confirm time, which
-- is what makes referral farming and the email-relay abuse worthless.

-- AlterTable
ALTER TABLE "waitlist_users" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "verifyTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verifyTokenHash" TEXT,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "position" DROP DEFAULT;

-- Position is now assigned as MAX(position)+1 in the confirm transaction;
-- the SERIAL-era sequence has no further role.
DROP SEQUENCE "waitlist_users_position_seq";

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_users_verifyTokenHash_key" ON "waitlist_users"("verifyTokenHash");

-- Everyone on the list before double opt-in was live the moment they signed
-- up; grandfather them as confirmed at their signup time.
UPDATE "waitlist_users" SET "confirmedAt" = "createdAt" WHERE "confirmedAt" IS NULL;
