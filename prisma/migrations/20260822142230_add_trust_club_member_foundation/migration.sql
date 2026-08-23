-- CreateEnum
CREATE TYPE "TrustClubMemberStatus" AS ENUM ('PENDING', 'ACTIVE', 'GRACE', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TrustClubSubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'GRACE', 'SUSPENDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "trust_club_members" (
    "memberId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "TrustClubMemberStatus" NOT NULL DEFAULT 'PENDING',
    "subscriptionStatus" "TrustClubSubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "planCode" TEXT NOT NULL DEFAULT 'STANDARD_MEMBERSHIP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),

    CONSTRAINT "trust_club_members_pkey" PRIMARY KEY ("memberId")
);

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_members_userId_key" ON "trust_club_members"("userId");

-- CreateIndex
CREATE INDEX "trust_club_members_status_idx" ON "trust_club_members"("status");

-- CreateIndex
CREATE INDEX "trust_club_members_subscriptionStatus_idx" ON "trust_club_members"("subscriptionStatus");

-- AddForeignKey
ALTER TABLE "trust_club_members" ADD CONSTRAINT "trust_club_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
