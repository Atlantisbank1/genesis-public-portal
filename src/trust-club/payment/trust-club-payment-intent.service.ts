import {
  randomBytes,
} from 'node:crypto';

import {
  trustClubInvitationPersistence,
} from '@/trust-club/invitation/trust-club-invitation.persistence';

import type {
  TrustClubPaymentIntent,
  TrustClubPaymentMethod,
} from './trust-club-payment-intent.contracts';

import {
  trustClubPaymentIntentPersistence,
} from './trust-club-payment-intent.persistence';

import {
  resolveTrustClubMembershipPrice,
} from './trust-club-server-pricing.service';

export interface CreateTrustClubPaymentIntentInput {
  invitationId:
    string;

  paymentMethod:
    TrustClubPaymentMethod;

  expiresAt?:
    Date | null;
}

function createGenesisPaymentReference(): string {
  const entropy =
    randomBytes(
      12,
    )
      .toString(
        'hex',
      )
      .toUpperCase();

  return `GTC-PAY-${entropy}`;
}

export async function createTrustClubPaymentIntent(
  input:
    CreateTrustClubPaymentIntentInput,
): Promise<TrustClubPaymentIntent> {
  const invitationId =
    input.invitationId.trim();

  if (
    invitationId.length ===
      0
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_INVITATION_ID_REQUIRED',
    );
  }

  const invitation =
    await trustClubInvitationPersistence
      .findById(
        invitationId,
      );

  if (
    invitation ===
      null
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_INVITATION_NOT_FOUND',
    );
  }

  if (
    invitation.status !==
      'REQUESTED'
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_INVITATION_NOT_REQUESTED',
    );
  }

  if (
    invitation.tokenHash !==
      null ||
    invitation.approvedAt !==
      null ||
    invitation.approvedByUserId !==
      null
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_INVITATION_ALREADY_AUTHORIZED',
    );
  }

  const serverPrice =
    resolveTrustClubMembershipPrice(
      'STANDARD_MEMBERSHIP',
    );

  const expiresAt =
    input.expiresAt ??
    null;

  if (
    expiresAt !==
      null &&
    expiresAt.getTime() <=
      Date.now()
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_EXPIRATION_NOT_FUTURE',
    );
  }

  const paymentIntent =
    await trustClubPaymentIntentPersistence
      .create({
        paymentReference:
          createGenesisPaymentReference(),

        invitationId:
          invitation.id,

        normalizedEmail:
          invitation.normalizedEmail,

        planCode:
          'STANDARD_MEMBERSHIP',

        amountMinor:
          serverPrice.amountMinor,

        currency:
          serverPrice.currency,

        paymentMethod:
          input.paymentMethod,

        expiresAt,
      });

  if (
    paymentIntent.status !==
      'AWAITING_SETTLEMENT'
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_INTENT_INITIAL_STATUS_INVALID',
    );
  }

  if (
    paymentIntent.invitationId !==
      invitation.id ||
    paymentIntent.normalizedEmail !==
      invitation.normalizedEmail
  ) {
    throw new Error(
      'TRUST_CLUB_PAYMENT_INTENT_INVITATION_BINDING_FAILED',
    );
  }

  return paymentIntent;
}

export const TRUST_CLUB_PAYMENT_INTENT_SOURCE_RULE =
  'PAYMENT_INTENT_REQUIRES_EXISTING_REQUESTED_INVITATION' as const;

export const TRUST_CLUB_PAYMENT_INTENT_SETTLEMENT_RULE =
  'PAYMENT_INTENT_CREATION_DOES_NOT_CONFIRM_SETTLEMENT' as const;

export const TRUST_CLUB_PAYMENT_INTENT_TOKEN_RULE =
  'PAYMENT_INTENT_CREATION_DOES_NOT_ISSUE_INVITATION_TOKEN' as const;

export const TRUST_CLUB_PAYMENT_INTENT_MEMBERSHIP_RULE =
  'PAYMENT_INTENT_CREATION_DOES_NOT_ACTIVATE_MEMBERSHIP' as const;