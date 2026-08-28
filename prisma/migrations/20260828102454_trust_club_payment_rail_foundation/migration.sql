-- CreateEnum
CREATE TYPE "TrustClubPaymentIntentStatus" AS ENUM ('PENDING', 'AWAITING_SETTLEMENT', 'SETTLEMENT_RECEIVED', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TrustClubPaymentMethod" AS ENUM ('INSTITUTIONAL_RAIL', 'BANK_TRANSFER', 'STANDING_ORDER', 'CRYPTO', 'CASH', 'MANUAL');

-- CreateEnum
CREATE TYPE "TrustClubSettlementStatus" AS ENUM ('RECEIVED', 'CONFIRMED', 'REJECTED', 'REVERSED');

-- CreateTable
CREATE TABLE "trust_club_payment_intents" (
    "paymentIntentId" TEXT NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "planCode" TEXT NOT NULL DEFAULT 'STANDARD_MEMBERSHIP',
    "amountMinor" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentMethod" "TrustClubPaymentMethod" NOT NULL,
    "status" "TrustClubPaymentIntentStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_club_payment_intents_pkey" PRIMARY KEY ("paymentIntentId")
);

-- CreateTable
CREATE TABLE "trust_club_settlement_reflections" (
    "settlementId" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "settlementReference" TEXT NOT NULL,
    "originatingInstitution" TEXT,
    "externalTransactionRef" TEXT,
    "amountMinor" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "TrustClubSettlementStatus" NOT NULL DEFAULT 'RECEIVED',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "reversedAt" TIMESTAMP(3),
    "verificationReference" TEXT,
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_club_settlement_reflections_pkey" PRIMARY KEY ("settlementId")
);

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_payment_intents_paymentReference_key" ON "trust_club_payment_intents"("paymentReference");

-- CreateIndex
CREATE INDEX "trust_club_payment_intents_invitationId_idx" ON "trust_club_payment_intents"("invitationId");

-- CreateIndex
CREATE INDEX "trust_club_payment_intents_normalizedEmail_idx" ON "trust_club_payment_intents"("normalizedEmail");

-- CreateIndex
CREATE INDEX "trust_club_payment_intents_status_idx" ON "trust_club_payment_intents"("status");

-- CreateIndex
CREATE INDEX "trust_club_payment_intents_paymentMethod_idx" ON "trust_club_payment_intents"("paymentMethod");

-- CreateIndex
CREATE INDEX "trust_club_payment_intents_expiresAt_idx" ON "trust_club_payment_intents"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_settlement_reflections_settlementReference_key" ON "trust_club_settlement_reflections"("settlementReference");

-- CreateIndex
CREATE INDEX "trust_club_settlement_reflections_paymentIntentId_idx" ON "trust_club_settlement_reflections"("paymentIntentId");

-- CreateIndex
CREATE INDEX "trust_club_settlement_reflections_status_idx" ON "trust_club_settlement_reflections"("status");

-- CreateIndex
CREATE INDEX "trust_club_settlement_reflections_externalTransactionRef_idx" ON "trust_club_settlement_reflections"("externalTransactionRef");

-- CreateIndex
CREATE INDEX "trust_club_settlement_reflections_receivedAt_idx" ON "trust_club_settlement_reflections"("receivedAt");

-- AddForeignKey
ALTER TABLE "trust_club_payment_intents" ADD CONSTRAINT "trust_club_payment_intents_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "trust_club_invitations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_club_settlement_reflections" ADD CONSTRAINT "trust_club_settlement_reflections_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "trust_club_payment_intents"("paymentIntentId") ON DELETE RESTRICT ON UPDATE CASCADE;
