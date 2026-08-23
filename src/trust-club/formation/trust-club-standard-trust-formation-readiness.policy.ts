import type {
  TrustClubStandardTrustFormation,
} from './trust-club-standard-trust-formation.contracts';

export type TrustClubStandardTrustFormationRequiredField =
  | 'trustName'
  | 'trustPurpose'
  | 'settlorName'
  | 'trusteeName'
  | 'beneficiaryName'
  | 'initialPropertyDescription';

export interface TrustClubStandardTrustFormationReadinessReadyResult {
  status:
    'READY';

  ready:
    true;

  missingFields:
    [];
}

export interface TrustClubStandardTrustFormationReadinessIncompleteResult {
  status:
    'INCOMPLETE';

  ready:
    false;

  missingFields:
    TrustClubStandardTrustFormationRequiredField[];
}

export type TrustClubStandardTrustFormationReadinessResult =
  | TrustClubStandardTrustFormationReadinessReadyResult
  | TrustClubStandardTrustFormationReadinessIncompleteResult;

const REQUIRED_STANDARD_TRUST_FORMATION_FIELDS:
  readonly TrustClubStandardTrustFormationRequiredField[] = [
    'trustName',
    'trustPurpose',
    'settlorName',
    'trusteeName',
    'beneficiaryName',
    'initialPropertyDescription',
  ];

function hasMeaningfulText(
  value:
    string |
    null |
    undefined,
): boolean {
  return (
    typeof value ===
      'string' &&
    value.trim().length >
      0
  );
}

export function evaluateStandardTrustFormationReadiness(
  formation:
    TrustClubStandardTrustFormation |
    null,
): TrustClubStandardTrustFormationReadinessResult {
  if (
    formation ===
      null
  ) {
    return {
      status:
        'INCOMPLETE',

      ready:
        false,

      missingFields:
        [
          ...REQUIRED_STANDARD_TRUST_FORMATION_FIELDS,
        ],
    };
  }

  const missingFields =
    REQUIRED_STANDARD_TRUST_FORMATION_FIELDS.filter(
      (
        field,
      ) =>
        !hasMeaningfulText(
          formation[field],
        ),
    );

  if (
    missingFields.length >
      0
  ) {
    return {
      status:
        'INCOMPLETE',

      ready:
        false,

      missingFields,
    };
  }

  return {
    status:
      'READY',

    ready:
      true,

    missingFields:
      [],
  };
}

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READINESS_REQUIRED_FIELDS =
  REQUIRED_STANDARD_TRUST_FORMATION_FIELDS;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READINESS_PROTECTOR_RULE =
  'PROTECTOR_IS_NOT_REQUIRED_FOR_STANDARD_TRUST_FORMATION_READINESS' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READINESS_LIFECYCLE_RULE =
  'FORMATION_READINESS_DOES_NOT_TRANSITION_ACTION_LIFECYCLE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READINESS_PERSISTENCE_RULE =
  'FORMATION_READINESS_DOES_NOT_WRITE_PERSISTENCE' as const;

export const TRUST_CLUB_STANDARD_TRUST_FORMATION_READINESS_AUTHORIZATION_RULE =
  'FORMATION_READINESS_IS_NOT_ACTION_AUTHORIZATION' as const;