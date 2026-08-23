-- CreateEnum
CREATE TYPE "TrustClubSystemRole" AS ENUM ('TRUST_CLUB_ADMIN');

-- CreateTable
CREATE TABLE "trust_club_system_role_assignments" (
    "assignmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TrustClubSystemRole" NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_club_system_role_assignments_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateIndex
CREATE INDEX "trust_club_system_role_assignments_role_idx" ON "trust_club_system_role_assignments"("role");

-- CreateIndex
CREATE UNIQUE INDEX "trust_club_system_role_assignments_userId_role_key" ON "trust_club_system_role_assignments"("userId", "role");

-- AddForeignKey
ALTER TABLE "trust_club_system_role_assignments" ADD CONSTRAINT "trust_club_system_role_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
