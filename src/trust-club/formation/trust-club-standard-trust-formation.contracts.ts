/**
 * TRUST-CLUB-V1
 * PHASE 6.4-R.2
 *
 * Standard Trust Formation Contracts
 *
 * Purpose:
 * - represent formation data owned by an existing
 *   CREATE_STANDARD_TRUST Action;
 * - preserve Action lifecycle authority;
 * - keep persistence implementation outside
 *   application and HTTP boundaries.
 */

export interface TrustClubStandardTrustFormation {
  actionId:
    string;

  trustName:
    string | null;

  trustPurpose:
    string | null;

  settlorName:
    string | null;

  trusteeName:
    string | null;

  beneficiaryName:
    string | null;

  protectorName:
    string | null;

  initialPropertyDescription:
    string | null;

  createdAt:
    Date;

  updatedAt:
    Date;
}

export interface SaveTrustClubStandardTrustFormationInput {
  actionId:
    string;

  trustName?:
    string | null;

  trustPurpose?:
    string | null;

  settlorName?:
    string | null;

  trusteeName?:
    string | null;

  beneficiaryName?:
    string | null;

  protectorName?:
    string | null;

  initialPropertyDescription?:
    string | null;
}

export interface TrustClubStandardTrustFormationPersistence {
  findByActionId(
    actionId:
      string,
  ): Promise<
    TrustClubStandardTrustFormation |
    null
  >;

  save(
    input:
      SaveTrustClubStandardTrustFormationInput,
  ): Promise<
    TrustClubStandardTrustFormation
  >;
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_OWNERSHIP_RULE =
  'FORMATION_IS_OWNED_BY_EXISTING_CREATE_STANDARD_TRUST_ACTION' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_LIFECYCLE_RULE =
  'FORMATION_DOES_NOT_OWN_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_PERSISTENCE_RULE =
  'FORMATION_PERSISTENCE_IS_NOT_EXPOSED_TO_PUBLIC_HTTP_BOUNDARY' as const;