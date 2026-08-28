export type TrustClubPaymentIntentStatus =
  | 'PENDING'
  | 'AWAITING_SETTLEMENT'
  | 'SETTLEMENT_RECEIVED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED';

export type TrustClubPaymentMethod =
  | 'INSTITUTIONAL_RAIL'
  | 'BANK_TRANSFER'
  | 'STANDING_ORDER'
  | 'CRYPTO'
  | 'CASH'
  | 'MANUAL';

export interface TrustClubPaymentIntent {
  paymentIntentId:
    string;

  paymentReference:
    string;

  invitationId:
    string;

  normalizedEmail:
    string;

  planCode:
    string;

  amountMinor:
    bigint;

  currency:
    string;

  paymentMethod:
    TrustClubPaymentMethod;

  status:
    TrustClubPaymentIntentStatus;

  expiresAt:
    Date | null;

  confirmedAt:
    Date | null;

  cancelledAt:
    Date | null;

  createdAt:
    Date;

  updatedAt:
    Date;
}

export interface CreateTrustClubPaymentIntentPersistenceInput {
  paymentReference:
    string;

  invitationId:
    string;

  normalizedEmail:
    string;

  planCode:
    string;

  amountMinor:
    bigint;

  currency:
    string;

  paymentMethod:
    TrustClubPaymentMethod;

  expiresAt:
    Date | null;
}

export interface TrustClubPaymentIntentPersistence {
  create(
    input:
      CreateTrustClubPaymentIntentPersistenceInput,
  ): Promise<TrustClubPaymentIntent>;

  findByPaymentReference(
    paymentReference:
      string,
  ): Promise<TrustClubPaymentIntent | null>;
}