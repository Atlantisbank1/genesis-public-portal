import {
  prisma,
} from '@/lib/prisma';

import {
  trustClubInvitationPersistence,
} from '../invitation/trust-club-invitation.persistence';

import type {
  TrustClubInvitation,
} from '../invitation/trust-club-invitation.contracts';

import {
  authorizeTrustClubAdminReview,
} from './trust-club-admin-review-authorization.service';

import type {
  TrustClubServerApplicationEntryAuthenticationSource,
} from './trust-club-server-application-entry.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 9.4-P8.25
 *
 * Administrative Launch Queue
 *
 * Read-only administrative projection of recent
 * Trust Club invitation requests together with the
 * current server-authoritative payment and settlement
 * state required for launch operations.
 *
 * Authority:
 * authenticated identity
 * -> persisted TRUST_CLUB_ADMIN System Role
 * -> read-only invitation/payment/settlement persistence.
 *
 * This service does not:
 * - create or mutate invitations;
 * - issue invitation tokens;
 * - create payment intents;
 * - receive settlements;
 * - confirm settlements;
 * - activate memberships;
 * - expose token hashes or raw tokens to callers.
 */

export interface TrustClubAdminLaunchQueuePayment {
  paymentIntentId:
    string;

  paymentReference:
    string;

  amountMinor:
    string;

  currency:
    string;

  paymentMethod:
    string;

  status:
    string;

  expiresAt:
    Date | null;

  confirmedAt:
    Date | null;

  createdAt:
    Date;

  settlement:
    TrustClubAdminLaunchQueueSettlement | null;
}

export interface TrustClubAdminLaunchQueueSettlement {
  settlementId:
    string;

  settlementReference:
    string;

  originatingInstitution:
    string | null;

  externalTransactionRef:
    string | null;

  amountMinor:
    string;

  currency:
    string;

  status:
    string;

  receivedAt:
    Date;

  confirmedAt:
    Date | null;

  verificationReference:
    string | null;
}

export interface TrustClubAdminLaunchQueueItem {
  invitationId:
    string;

  normalizedEmail:
    string;

  status:
    TrustClubInvitation['status'];

  expiresAt:
    Date | null;

  paymentAccessExpiresAt:
    Date | null;

  approvedAt:
    Date | null;

  consumedAt:
    Date | null;

  createdAt:
    Date;

  updatedAt:
    Date;

  payment:
    TrustClubAdminLaunchQueuePayment | null;
}

export interface TrustClubAdminLaunchQueue {
  items:
    readonly TrustClubAdminLaunchQueueItem[];
}

export async function readTrustClubAdminLaunchQueue(
  authenticationSource:
    TrustClubServerApplicationEntryAuthenticationSource,
): Promise<TrustClubAdminLaunchQueue> {
  const authorization =
    await authorizeTrustClubAdminReview(
      authenticationSource,
    );

  if (
    authorization.status ===
      'UNAUTHENTICATED'
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_LAUNCH_QUEUE_AUTHENTICATION_REQUIRED',
    );
  }

  if (
    authorization.status ===
      'ADMIN_SYSTEM_ROLE_REQUIRED'
  ) {
    throw new Error(
      'TRUST_CLUB_ADMIN_LAUNCH_QUEUE_SYSTEM_ROLE_REQUIRED',
    );
  }

  const invitations =
    await trustClubInvitationPersistence
      .listRecent(
        100,
      );

  const items =
    await Promise.all(
      invitations.map(
        async (
          invitation,
        ): Promise<TrustClubAdminLaunchQueueItem> => {
          const paymentIntent =
            await prisma.trustClubPaymentIntent.findFirst({
              where: {
                invitationId:
                  invitation.id,

                status: {
                  notIn: [
                    'CANCELLED',
                    'EXPIRED',
                  ],
                },
              },

              orderBy: {
                createdAt:
                  'desc',
              },

              include: {
                settlements: {
                  orderBy: {
                    receivedAt:
                      'desc',
                  },

                  take:
                    1,
                },
              },
            });

          const settlement =
            paymentIntent?.settlements[0] ??
            null;

          return {
            invitationId:
              invitation.id,

            normalizedEmail:
              invitation.normalizedEmail,

            status:
              invitation.status,

            expiresAt:
              invitation.expiresAt,

            paymentAccessExpiresAt:
              invitation.paymentAccessExpiresAt,

            approvedAt:
              invitation.approvedAt,

            consumedAt:
              invitation.consumedAt,

            createdAt:
              invitation.createdAt,

            updatedAt:
              invitation.updatedAt,

            payment:
              paymentIntent ===
              null
                ? null
                : {
                    paymentIntentId:
                      paymentIntent.paymentIntentId,

                    paymentReference:
                      paymentIntent.paymentReference,

                    amountMinor:
                      paymentIntent.amountMinor.toString(),

                    currency:
                      paymentIntent.currency,

                    paymentMethod:
                      paymentIntent.paymentMethod,

                    status:
                      paymentIntent.status,

                    expiresAt:
                      paymentIntent.expiresAt,

                    confirmedAt:
                      paymentIntent.confirmedAt,

                    createdAt:
                      paymentIntent.createdAt,

                    settlement:
                      settlement ===
                      null
                        ? null
                        : {
                            settlementId:
                              settlement.settlementId,

                            settlementReference:
                              settlement.settlementReference,

                            originatingInstitution:
                              settlement.originatingInstitution,

                            externalTransactionRef:
                              settlement.externalTransactionRef,

                            amountMinor:
                              settlement.amountMinor.toString(),

                            currency:
                              settlement.currency,

                            status:
                              settlement.status,

                            receivedAt:
                              settlement.receivedAt,

                            confirmedAt:
                              settlement.confirmedAt,

                            verificationReference:
                              settlement.verificationReference,
                          },
                  },
          };
        },
      ),
    );

  return {
    items,
  };
}

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_AUTHORITY_RULE =
  'ADMIN_LAUNCH_QUEUE_REQUIRES_AUTHENTICATED_PERSISTED_TRUST_CLUB_ADMIN' as const;

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_READ_ONLY_RULE =
  'ADMIN_LAUNCH_QUEUE_IS_READ_ONLY' as const;

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_TOKEN_RULE =
  'ADMIN_LAUNCH_QUEUE_DOES_NOT_EXPOSE_TOKEN_HASH_OR_RAW_TOKEN' as const;

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_PAYMENT_RULE =
  'ADMIN_LAUNCH_QUEUE_EXPOSES_SERVER_AUTHORITATIVE_PAYMENT_STATE_READ_ONLY' as const;

export const TRUST_CLUB_ADMIN_LAUNCH_QUEUE_SETTLEMENT_RULE =
  'ADMIN_LAUNCH_QUEUE_EXPOSES_SERVER_AUTHORITATIVE_SETTLEMENT_STATE_READ_ONLY' as const;