import {
  prisma,
} from '@/lib/prisma';

import type {
  CreateTrustClubInvitationRequestInput,
  TrustClubInvitation,
  TrustClubInvitationPersistence,
} from './trust-club-invitation.contracts';

function requireNormalizedEmail(
  value:
    string,
): string {
  const normalized =
    value.trim().toLowerCase();

  if (
    normalized.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_EMAIL_REQUIRED',
    );
  }

  return normalized;
}

function requireTokenHash(
  value:
    string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_INVITATION_TOKEN_HASH_REQUIRED',
    );
  }

  return normalized;
}

export const trustClubInvitationPersistence:
  TrustClubInvitationPersistence = {
    async createRequested(
      input:
        CreateTrustClubInvitationRequestInput,
    ): Promise<
      TrustClubInvitation
    > {
      const normalizedEmail =
        requireNormalizedEmail(
          input.normalizedEmail,
        );

      return prisma
        .trustClubInvitation
        .create({
          data: {
            normalizedEmail,

            status:
              'REQUESTED',
          },
        });
    },

    async approveRequested(
      input,
    ): Promise<
      TrustClubInvitation
    > {
      const invitationId =
        input.invitationId.trim();

      if (
        invitationId.length ===
          0
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_ID_REQUIRED',
        );
      }

      const tokenHash =
        requireTokenHash(
          input.tokenHash,
        );

      const approvedByUserId =
        input.approvedByUserId.trim();

      if (
        approvedByUserId.length ===
          0
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_APPROVED_BY_USER_ID_REQUIRED',
        );
      }

      if (
        !Number.isFinite(
          input.expiresAt.getTime(),
        )
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_EXPIRATION_INVALID',
        );
      }

      if (
        !Number.isFinite(
          input.approvedAt.getTime(),
        )
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_APPROVED_AT_INVALID',
        );
      }

      if (
        input.expiresAt.getTime() <=
        input.approvedAt.getTime()
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_EXPIRATION_NOT_AFTER_APPROVAL',
        );
      }

      const mutation =
        await prisma
          .trustClubInvitation
          .updateMany({
            where: {
              id:
                invitationId,

              status:
                'REQUESTED',

              tokenHash:
                null,

              approvedAt:
                null,

              approvedByUserId:
                null,
            },

            data: {
              status:
                'APPROVED',

              tokenHash,

              expiresAt:
                input.expiresAt,

              approvedByUserId,

              approvedAt:
                input.approvedAt,
            },
          });

      if (
        mutation.count !==
          1
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_APPROVAL_PRECONDITION_FAILED',
        );
      }

      const approved =
        await prisma
          .trustClubInvitation
          .findUnique({
            where: {
              id:
                invitationId,
            },
          });

      if (
        approved ===
          null ||
        approved.status !==
          'APPROVED' ||
        approved.tokenHash !==
          tokenHash ||
        approved.approvedByUserId !==
          approvedByUserId
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_APPROVAL_PERSISTENCE_VERIFICATION_FAILED',
        );
      }

      return approved;
    },

    async consumeApproved(
      input,
    ): Promise<
      TrustClubInvitation
    > {
      const invitationId =
        input.invitationId.trim();

      if (
        invitationId.length ===
          0
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_ID_REQUIRED',
        );
      }

      const tokenHash =
        requireTokenHash(
          input.tokenHash,
        );

      if (
        !Number.isFinite(
          input.consumedAt.getTime(),
        )
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_CONSUMED_AT_INVALID',
        );
      }

      const mutation =
        await prisma
          .trustClubInvitation
          .updateMany({
            where: {
              id:
                invitationId,

              status:
                'APPROVED',

              tokenHash,

              consumedAt:
                null,

              rejectedAt:
                null,

              revokedAt:
                null,

              expiresAt: {
                gt:
                  input.consumedAt,
              },
            },

            data: {
              status:
                'CONSUMED',

              consumedAt:
                input.consumedAt,
            },
          });

      if (
        mutation.count !==
          1
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_CONSUMPTION_PRECONDITION_FAILED',
        );
      }

      const consumed =
        await prisma
          .trustClubInvitation
          .findUnique({
            where: {
              id:
                invitationId,
            },
          });

      if (
        consumed ===
          null ||
        consumed.status !==
          'CONSUMED' ||
        consumed.tokenHash !==
          tokenHash ||
        consumed.consumedAt ===
          null
      ) {
        throw new Error(
          'TRUST_CLUB_INVITATION_CONSUMPTION_PERSISTENCE_VERIFICATION_FAILED',
        );
      }

      return consumed;
    },

    async findById(
      invitationId,
    ): Promise<
      TrustClubInvitation | null
    > {
      const normalizedId =
        invitationId.trim();

      if (
        normalizedId.length ===
          0
      ) {
        return null;
      }

      return prisma
        .trustClubInvitation
        .findUnique({
          where: {
            id:
              normalizedId,
          },
        });
    },

    async findByNormalizedEmail(
      normalizedEmail,
    ): Promise<
      readonly TrustClubInvitation[]
    > {
      const email =
        requireNormalizedEmail(
          normalizedEmail,
        );

      return prisma
        .trustClubInvitation
        .findMany({
          where: {
            normalizedEmail:
              email,
          },

          orderBy: {
            createdAt:
              'desc',
          },
        });
    },

    async findByTokenHash(
      tokenHash,
    ): Promise<
      TrustClubInvitation | null
    > {
      const normalizedHash =
        requireTokenHash(
          tokenHash,
        );

      return prisma
        .trustClubInvitation
        .findUnique({
          where: {
            tokenHash:
              normalizedHash,
          },
        });
    },
  };
