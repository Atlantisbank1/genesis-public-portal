import type {
  TrustClubAuthorizationContext,
} from '../domain/trust-club-domain.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.20
 *
 * Authorized Application Gateway Contracts
 *
 * Purpose:
 *
 * Defines the controlled boundary between an already assembled
 * Trust Club Authorization Context and the existing certified
 * Server Application Gateway.
 *
 * This contract does NOT:
 * - authenticate users;
 * - verify credentials;
 * - resolve authentication sources;
 * - assemble Authentication Context;
 * - assemble Authorization Context;
 * - authorize Trust actions;
 * - replace authorization orchestration;
 * - create Membership;
 * - establish Trust relationships;
 * - grant Trust roles;
 * - grant system roles;
 * - resolve entitlements;
 * - activate entitlements;
 * - access persistence;
 * - access Prisma;
 * - access repositories;
 * - modify the certified Application Gateway;
 * - create an HTTP endpoint;
 * - create a Next.js Route Handler;
 * - create a Server Action;
 * - access Atlantis;
 * - execute payments;
 * - execute banking activity;
 * - execute external services;
 * - establish external completion.
 */

export type TrustClubAuthorizedApplicationGatewayStatus =
  | 'AUTHORIZED_CONTEXT_PRESENT'
  | 'AUTHORIZATION_CONTEXT_ABSENT';

export interface TrustClubAuthorizedApplicationGatewayInput {
  authorizationContext:
    TrustClubAuthorizationContext | null;
}

export interface TrustClubAuthorizedApplicationGatewayResult {
  status:
    TrustClubAuthorizedApplicationGatewayStatus;

  authorizationContext:
    TrustClubAuthorizationContext | null;
}

export const TRUST_CLUB_AUTHORIZED_APPLICATION_GATEWAY_CONTEXT_RULE =
  'AUTHORIZED_APPLICATION_GATEWAY_CONSUMES_ESTABLISHED_AUTHORIZATION_CONTEXT' as const;

export const TRUST_CLUB_AUTHORIZED_APPLICATION_GATEWAY_FAIL_CLOSED_RULE =
  'AUTHORIZED_APPLICATION_GATEWAY_FAILS_CLOSED_WITHOUT_AUTHORIZATION_CONTEXT' as const;

export const TRUST_CLUB_AUTHORIZED_APPLICATION_GATEWAY_AUTHORITY_RULE =
  'AUTHORIZED_APPLICATION_GATEWAY_DOES_NOT_REPLACE_AUTHORIZATION_AUTHORITY' as const;

export const TRUST_CLUB_AUTHORIZED_APPLICATION_GATEWAY_DELEGATION_RULE =
  'AUTHORIZED_APPLICATION_GATEWAY_MAY_DELEGATE_ONLY_TO_CERTIFIED_APPLICATION_GATEWAY_OPERATIONS' as const;

export const TRUST_CLUB_AUTHORIZED_APPLICATION_GATEWAY_PERSISTENCE_RULE =
  'AUTHORIZED_APPLICATION_GATEWAY_DOES_NOT_ACCESS_PERSISTENCE' as const;

export const TRUST_CLUB_AUTHORIZED_APPLICATION_GATEWAY_MUTATION_RULE =
  'AUTHORIZED_APPLICATION_GATEWAY_DOES_NOT_MODIFY_CERTIFIED_APPLICATION_GATEWAY' as const;

export const TRUST_CLUB_AUTHORIZED_APPLICATION_GATEWAY_EXPOSURE_RULE =
  'AUTHORIZED_APPLICATION_GATEWAY_DOES_NOT_CREATE_PUBLIC_APPLICATION_EXPOSURE' as const;