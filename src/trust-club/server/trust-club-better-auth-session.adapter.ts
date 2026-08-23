import {
  auth,
} from '@/lib/auth';

import type {
  TrustClubAuthenticationSourceAdapter,
  TrustClubAuthenticationSourceRequest,
  TrustClubAuthenticationSourceResult,
} from './trust-club-authentication-source.contracts';

/**
 * TRUST-CLUB-V1
 * PHASE 5.25
 *
 * Better Auth Session Authentication Source Adapter
 *
 * Purpose:
 *
 * Converts a session that has already been authenticated and
 * validated by Better Auth into the provider-neutral Trust Club
 * Authentication Source contract established in Phase 5.17.
 *
 * Authentication authority remains with Better Auth.
 *
 * This adapter does NOT:
 * - verify passwords itself;
 * - issue sessions;
 * - authorize Trust Club actions;
 * - establish Membership;
 * - establish Trust relationships;
 * - resolve entitlements;
 * - own Action lifecycle authority;
 * - write Trust Club Action data.
 */
export class TrustClubBetterAuthSessionAdapter
  implements TrustClubAuthenticationSourceAdapter {

  constructor(
    private readonly requestHeaders:
      Headers,
  ) {}

  async resolveAuthenticatedIdentity(
    request:
      TrustClubAuthenticationSourceRequest,
  ): Promise<TrustClubAuthenticationSourceResult> {
    const resolvedSession =
      await auth.api.getSession({
        headers:
          this.requestHeaders,

        query: {
          disableCookieCache:
            true,
        },
      });

    if (
      resolvedSession ===
        null
    ) {
      return {
        status:
          'UNAUTHENTICATED',

        identity:
          null,
      };
    }

    return {
      status:
        'AUTHENTICATED',

      identity: {
        authenticatedUserId:
          resolvedSession.user.id,

        authenticationMethod:
          'PASSWORD',

        authenticatedAt:
          resolvedSession.session.createdAt.toISOString(),

        sessionReference:
          resolvedSession.session.id,

        identityProviderReference:
          request.sourceReference ??
          resolvedSession.user.email,
      },
    };
  }
}