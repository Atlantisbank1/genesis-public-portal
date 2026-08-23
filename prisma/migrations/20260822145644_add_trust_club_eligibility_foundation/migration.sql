-- CreateEnum
CREATE TYPE "TrustClubEligibilityStatus" AS ENUM ('ELIGIBLE', 'REVIEW_REQUIRED', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "TrustClubEligibilityReasonCode" AS ENUM ('BREACH_OF_TRUST', 'SERIOUS_MISCONDUCT', 'ABUSE_OF_MEMBER', 'FRAUD_OR_DECEPTION', 'SECURITY_THREAT', 'ABUSE_OF_SERVICE', 'FORMAL_INTERNAL_RESTRICTION', 'OTHER_REVIEWED_CAUSE');

-- CreateTable
CREATE TABLE "trust_club_eligibility_records" (
    "eligibilityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "TrustClubEligibilityStatus" NOT NULL DEFAULT 'REVIEW_REQUIRED',
    "reasonCode" "TrustClubEligibilityReasonCode",
    "internalCaseReference" TEXT,
    "internalNotes" TEXT,
    "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "liftedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_club_eligibility_records_pkey" PRIMARY KEY ("eligibilityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_eligibility_records_userId_key" ON "trust_club_eligibility_records"("userId");

-- CreateIndex
CREATE INDEX "trust_club_eligibility_records_status_idx" ON "trust_club_eligibility_records"("status");

-- CreateIndex
CREATE INDEX "trust_club_eligibility_records_reasonCode_idx" ON "trust_club_eligibility_records"("reasonCode");

-- CreateIndex
CREATE INDEX "trust_club_eligibility_records_internalCaseReference_idx" ON "trust_club_eligibility_records"("internalCaseReference");

-- AddForeignKey
ALTER TABLE "trust_club_eligibility_records" ADD CONSTRAINT "trust_club_eligibility_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
