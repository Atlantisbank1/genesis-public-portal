-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TrustClubActionType" AS ENUM ('CREATE_STANDARD_TRUST', 'VIEW_TRUST', 'UPDATE_STANDARD_RECORD', 'ADD_ASSET', 'REMOVE_ASSET', 'ACCEPT_CONTRIBUTION', 'RECORD_INCOME', 'RECORD_EXPENSE', 'MAKE_DISTRIBUTION', 'CREATE_TRUSTEE_RESOLUTION', 'ADD_BENEFICIARY', 'CHANGE_BENEFICIARY', 'CHANGE_TRUSTEE', 'CHANGE_PROTECTOR', 'ENTER_CONTRACT', 'MAKE_INVESTMENT', 'AMEND_TRUST', 'REQUEST_BANKING_ACTIVATION', 'REQUEST_EXTERNAL_IDENTIFICATION', 'REQUEST_PROFESSIONAL_REVIEW', 'REQUEST_TRUST_TERMINATION');

-- CreateEnum
CREATE TYPE "TrustClubActionStatus" AS ENUM ('DRAFT', 'DISCLOSURE_REQUIRED', 'CONSENT_REQUIRED', 'READY', 'PENDING_REVIEW', 'AUTHORIZED', 'IN_PROGRESS', 'INTERNAL_COMPLETE', 'EXTERNAL_PENDING', 'COMPLETE', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TrustClubActionOutcomeType" AS ENUM ('INTERNAL_COMPLETION', 'EXTERNAL_PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "trust_club_action_records" (
    "actionId" TEXT NOT NULL,
    "actionType" "TrustClubActionType" NOT NULL,
    "status" "TrustClubActionStatus" NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "trustId" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "trust_club_action_records_pkey" PRIMARY KEY ("actionId")
);

-- CreateTable
CREATE TABLE "trust_club_action_outcomes" (
    "persistenceId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "actionType" "TrustClubActionType" NOT NULL,
    "actionStatus" "TrustClubActionStatus" NOT NULL,
    "outcomeType" "TrustClubActionOutcomeType" NOT NULL,
    "recordedAt" TEXT NOT NULL,
    "outcomeCode" TEXT,
    "outcomeReason" TEXT,
    "externalReference" TEXT,

    CONSTRAINT "trust_club_action_outcomes_pkey" PRIMARY KEY ("persistenceId")
);

-- CreateIndex
CREATE INDEX "trust_club_action_records_requestedByUserId_idx" ON "trust_club_action_records"("requestedByUserId");

-- CreateIndex
CREATE INDEX "trust_club_action_records_memberId_idx" ON "trust_club_action_records"("memberId");

-- CreateIndex
CREATE INDEX "trust_club_action_records_trustId_idx" ON "trust_club_action_records"("trustId");

-- CreateIndex
CREATE INDEX "trust_club_action_records_status_idx" ON "trust_club_action_records"("status");

-- CreateIndex
CREATE INDEX "trust_club_action_outcomes_actionId_idx" ON "trust_club_action_outcomes"("actionId");

-- CreateIndex
CREATE INDEX "trust_club_action_outcomes_actionStatus_idx" ON "trust_club_action_outcomes"("actionStatus");

-- CreateIndex
CREATE INDEX "trust_club_action_outcomes_outcomeType_idx" ON "trust_club_action_outcomes"("outcomeType");

-- CreateIndex
CREATE INDEX "trust_club_action_outcomes_recordedAt_idx" ON "trust_club_action_outcomes"("recordedAt");

-- AddForeignKey
ALTER TABLE "trust_club_action_outcomes" ADD CONSTRAINT "trust_club_action_outcomes_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "trust_club_action_records"("actionId") ON DELETE RESTRICT ON UPDATE CASCADE;
