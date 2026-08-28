export type TrustClubSettlementStatus =
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'REVERSED';

export interface TrustClubSettlementReflection {
  settlementId:
    string;

  paymentIntentId:
    string;

  settlementReference:
    string;

  originatingInstitution:
    string | null;

  externalTransactionRef:
    string | null;

  amountMinor:
    bigint;

  currency:
    string;

  status:
    TrustClubSettlementStatus;

  receivedAt:
    Date;

  confirmedAt:
    Date | null;

  rejectedAt:
    Date | null;

  reversedAt:
    Date | null;

  verificationReference:
    string | null;

  verifiedBy:
    string | null;

  createdAt:
    Date;

  updatedAt:
    Date;
}

export interface CreateTrustClubSettlementReflectionPersistenceInput {
  paymentIntentId:
    string;

  settlementReference:
    string;

  originatingInstitution:
    string | null;

  externalTransactionRef:
    string | null;

  amountMinor:
    bigint;

  currency:
    string;

  verificationReference:
    string | null;

  verifiedBy:
    string | null;
}

export interface TrustClubSettlementReflectionPersistence {
  create(
    input:
      CreateTrustClubSettlementReflectionPersistenceInput,
  ):
    Promise<TrustClubSettlementReflection>;

  findBySettlementReference(
    settlementReference:
      string,
  ):
    Promise<TrustClubSettlementReflection | null>;
}