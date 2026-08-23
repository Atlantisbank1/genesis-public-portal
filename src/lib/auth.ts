import {
  betterAuth,
} from 'better-auth';

import {
  prismaAdapter,
} from 'better-auth/adapters/prisma';

import {
  prisma,
} from '@/lib/prisma';

/**
 * TRUST-CLUB-V1
 * PHASE 5.25
 *
 * Production Authentication Authority
 *
 * Better Auth owns:
 * - credential authentication;
 * - password hashing;
 * - authenticated sessions;
 * - session validation;
 * - authentication cookies.
 *
 * It does NOT own:
 * - Trust Club authorization;
 * - Membership authorization;
 * - Trust relationship authority;
 * - Entitlement resolution;
 * - Action authorization;
 * - Action lifecycle authority.
 */

export const auth =
  betterAuth({
    appName:
      'Genesis Trust Club',

    database:
      prismaAdapter(
        prisma,
        {
          provider:
            'postgresql',
        },
      ),

    emailAndPassword: {
      enabled:
        true,

      autoSignIn:
        true,
    },

    session: {
      expiresIn:
        60 * 60 * 24 * 7,

      updateAge:
        60 * 60 * 24,
    },

    advanced: {
      database: {
        joins:
          true,
      },
    },
  });
