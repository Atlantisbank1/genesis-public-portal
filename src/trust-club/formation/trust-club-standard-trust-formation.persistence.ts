import {
  prisma,
} from '@/lib/prisma';

import type {
  SaveTrustClubStandardTrustFormationInput,
  TrustClubStandardTrustFormation,
  TrustClubStandardTrustFormationPersistence,
} from './trust-club-standard-trust-formation.contracts';

function normalizeOptionalText(
  value:
    string |
    null |
    undefined,
): string | null | undefined {
  if (
    value ===
      undefined
  ) {
    return undefined;
  }

  if (
    value ===
      null
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized.length ===
    0
    ? null
    : normalized;
}

export const trustClubStandardTrustFormationPersistence:
  TrustClubStandardTrustFormationPersistence = {
    async findByActionId(
      actionId,
    ): Promise<
      TrustClubStandardTrustFormation |
      null
    > {
      return prisma
        .trustClubStandardTrustFormation
        .findUnique({
          where: {
            actionId,
          },
        });
    },

    async save(
      input,
    ): Promise<
      TrustClubStandardTrustFormation
    > {
      return prisma
        .trustClubStandardTrustFormation
        .upsert({
          where: {
            actionId:
              input.actionId,
          },

          create: {
            actionId:
              input.actionId,

            trustName:
              normalizeOptionalText(
                input.trustName,
              ) ?? null,

            trustPurpose:
              normalizeOptionalText(
                input.trustPurpose,
              ) ?? null,

            settlorName:
              normalizeOptionalText(
                input.settlorName,
              ) ?? null,

            trusteeName:
              normalizeOptionalText(
                input.trusteeName,
              ) ?? null,

            beneficiaryName:
              normalizeOptionalText(
                input.beneficiaryName,
              ) ?? null,

            protectorName:
              normalizeOptionalText(
                input.protectorName,
              ) ?? null,

            initialPropertyDescription:
              normalizeOptionalText(
                input.initialPropertyDescription,
              ) ?? null,
          },

          update: {
            trustName:
              normalizeOptionalText(
                input.trustName,
              ),

            trustPurpose:
              normalizeOptionalText(
                input.trustPurpose,
              ),

            settlorName:
              normalizeOptionalText(
                input.settlorName,
              ),

            trusteeName:
              normalizeOptionalText(
                input.trusteeName,
              ),

            beneficiaryName:
              normalizeOptionalText(
                input.beneficiaryName,
              ),

            protectorName:
              normalizeOptionalText(
                input.protectorName,
              ),

            initialPropertyDescription:
              normalizeOptionalText(
                input.initialPropertyDescription,
              ),
          },
        });
    },
  };