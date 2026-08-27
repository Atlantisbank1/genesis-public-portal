-- CreateEnum
CREATE TYPE "TrustClubTrustType" AS ENUM ('STANDARD_TRUST');

-- CreateTable
CREATE TABLE "trust_club_trust_records" (
    "trustId" TEXT NOT NULL,
    "formationActionId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "trustType" "TrustClubTrustType" NOT NULL,
    "establishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_club_trust_records_pkey" PRIMARY KEY ("trustId")
);

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_trust_records_formationActionId_key" ON "trust_club_trust_records"("formationActionId");

-- CreateIndex
CREATE INDEX "trust_club_trust_records_memberId_idx" ON "trust_club_trust_records"("memberId");

-- CreateIndex
CREATE INDEX "trust_club_trust_records_trustType_idx" ON "trust_club_trust_records"("trustType");

-- CreateIndex
CREATE INDEX "trust_club_trust_records_establishedAt_idx" ON "trust_club_trust_records"("establishedAt");

-- AddForeignKey
ALTER TABLE "trust_club_trust_records" ADD CONSTRAINT "trust_club_trust_records_formationActionId_fkey" FOREIGN KEY ("formationActionId") REFERENCES "trust_club_action_records"("actionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_club_trust_records" ADD CONSTRAINT "trust_club_trust_records_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "trust_club_members"("memberId") ON DELETE RESTRICT ON UPDATE CASCADE;
