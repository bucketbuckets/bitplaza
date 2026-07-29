-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('COMMUNITY_MEMBER', 'BUILDER', 'COMMUNITY_LEADER', 'ORGANIZATION', 'INVESTOR_PARTNER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "waitlist_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailRaw" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "primaryGoal" TEXT,
    "communities" TEXT[],
    "bitcoinExperience" TEXT,
    "geography" TEXT,
    "referralCode" TEXT NOT NULL,
    "referredById" TEXT,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "position" SERIAL NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "landingPageVariant" TEXT,
    "consentTimestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waitlist_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_applications" (
    "id" TEXT NOT NULL,
    "waitlistUserId" TEXT NOT NULL,
    "communityName" TEXT NOT NULL,
    "communitySize" TEXT NOT NULL,
    "currentTools" TEXT[],
    "primaryProblem" TEXT NOT NULL,
    "plazaVision" TEXT NOT NULL,
    "website" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_responses" (
    "id" TEXT NOT NULL,
    "waitlistUserId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_counters" (
    "key" TEXT NOT NULL,
    "window_start" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "rate_limit_counters_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_users_email_key" ON "waitlist_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_users_referralCode_key" ON "waitlist_users"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_users_position_key" ON "waitlist_users"("position");

-- CreateIndex
CREATE INDEX "waitlist_users_referredById_idx" ON "waitlist_users"("referredById");

-- CreateIndex
CREATE INDEX "waitlist_users_createdAt_idx" ON "waitlist_users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "community_applications_waitlistUserId_key" ON "community_applications"("waitlistUserId");

-- CreateIndex
CREATE INDEX "research_responses_waitlistUserId_idx" ON "research_responses"("waitlistUserId");

-- CreateIndex
CREATE INDEX "rate_limit_counters_window_start_idx" ON "rate_limit_counters"("window_start");

-- AddForeignKey
ALTER TABLE "waitlist_users" ADD CONSTRAINT "waitlist_users_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "waitlist_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_applications" ADD CONSTRAINT "community_applications_waitlistUserId_fkey" FOREIGN KEY ("waitlistUserId") REFERENCES "waitlist_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_responses" ADD CONSTRAINT "research_responses_waitlistUserId_fkey" FOREIGN KEY ("waitlistUserId") REFERENCES "waitlist_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
