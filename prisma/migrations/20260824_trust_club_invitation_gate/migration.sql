-- CreateEnum
CREATE TYPE "TrustClubInvitationStatus" AS ENUM ('REQUESTED', 'APPROVED', 'CONSUMED', 'REJECTED', 'REVOKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "trust_club_invitations" (
    "id" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "status" "TrustClubInvitationStatus" NOT NULL DEFAULT 'REQUESTED',
    "tokenHash" TEXT,
    "expiresAt" TIMESTAMP(3),
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_club_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_invitations_tokenHash_key" ON "trust_club_invitations"("tokenHash");

-- CreateIndex
CREATE INDEX "trust_club_invitations_normalizedEmail_idx" ON "trust_club_invitations"("normalizedEmail");

-- CreateIndex
CREATE INDEX "trust_club_invitations_status_idx" ON "trust_club_invitations"("status");

-- CreateIndex
CREATE INDEX "trust_club_invitations_expiresAt_idx" ON "trust_club_invitations"("expiresAt");

-- CreateIndex
CREATE INDEX "trust_club_invitations_approvedByUserId_idx" ON "trust_club_invitations"("approvedByUserId");

-- AddForeignKey
ALTER TABLE "trust_club_invitations" ADD CONSTRAINT "trust_club_invitations_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
