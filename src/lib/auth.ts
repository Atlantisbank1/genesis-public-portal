import {
  betterAuth,
} from 'better-auth';

import {
  APIError,
  createAuthMiddleware,
} from 'better-auth/api';

import {
  prismaAdapter,
} from 'better-auth/adapters/prisma';

import {
  prisma,
} from '@/lib/prisma';

import {
  authorizeTrustClubRegistrationAdmission,
} from '@/trust-club/invitation/trust-club-registration-admission.service';

import {
  trustClubInvitationPersistence,
} from '@/trust-club/invitation/trust-club-invitation.persistence';

import {
  ensureTrustClubEligibilityForUser,
} from '@/trust-club/server/trust-club-eligibility.service';

import {
  ensureTrustClubMemberForUser,
} from '@/trust-club/server/trust-club-production-membership.service';

/**
 * TRUST-CLUB-V1
 * PHASE 5.25 / PHASE 7.2
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
 *
 * Phase 7.2 registration boundary:
 * - email/password sign-up remains a Better Auth operation;
 * - Trust Club registration admission MUST succeed before
 *   Better Auth may create the authentication identity;
 * - direct access to /sign-up/email cannot bypass admission;
 * - raw invitation token is transient and is removed from
 *   the Better Auth request body after admission verification.
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

    hooks: {
      before:
        createAuthMiddleware(
          async (
            ctx,
          ) => {
            if (
              ctx.path !==
                '/sign-up/email'
            ) {
              return;
            }

            if (
              typeof ctx.body !==
                'object' ||
              ctx.body ===
                null
            ) {
              throw APIError.from(
                'BAD_REQUEST',
                {
                  code:
                    'TRUST_CLUB_REGISTRATION_ADMISSION_REQUIRED',

                  message:
                    'Trust Club registration admission is required.',
                },
              );
            }

            const body =
              ctx.body as Record<
                string,
                unknown
              >;

            const email =
              typeof body.email ===
                'string'
                ? body.email
                : '';

            const rawInvitationToken =
              typeof body.rawInvitationToken ===
                'string'
                ? body.rawInvitationToken
                : '';

            let admission:
              Awaited<
                ReturnType<
                  typeof authorizeTrustClubRegistrationAdmission
                >
              >;

            try {
              admission =
                await authorizeTrustClubRegistrationAdmission({
                  normalizedEmail:
                    email,

                  rawInvitationToken,
                });
            }
            catch {
              throw APIError.from(
                'BAD_REQUEST',
                {
                  code:
                    'TRUST_CLUB_REGISTRATION_ADMISSION_INVALID',

                  message:
                    'Trust Club registration admission is invalid.',
                },
              );
            }

            /**
             * rawInvitationToken is admission proof only.
             *
             * It MUST NOT reach Better Auth user-field parsing,
             * persistence, account creation, or session creation.
             */
            delete body.rawInvitationToken;

            return {
              context: {
                trustClubRegistrationAdmission: {
                  invitationId:
                    admission.invitationId,

                  normalizedEmail:
                    admission.normalizedEmail,
                },
              },
            };
          },
        ),

      after:
        createAuthMiddleware(
          async (
            ctx,
          ) => {
            if (
              ctx.path !==
                '/sign-up/email'
            ) {
              return;
            }

            const registrationContext =
              ctx as typeof ctx & {
                trustClubRegistrationAdmission?: {
                  invitationId:
                    string;

                  normalizedEmail:
                    string;
                };
              };

            const admission =
              registrationContext
                .trustClubRegistrationAdmission;

            const newSession =
              ctx.context.newSession;

            if (
              newSession ===
                null ||
              newSession ===
                undefined
            ) {
              return;
            }

            if (
              admission ===
                undefined
            ) {
              throw APIError.from(
                'INTERNAL_SERVER_ERROR',
                {
                  code:
                    'TRUST_CLUB_REGISTRATION_BINDING_CONTEXT_MISSING',

                  message:
                    'Trust Club registration binding context is missing.',
                },
              );
            }

            const registeredUserId =
              newSession.user.id.trim();

            const registeredUserEmail =
              newSession.user.email
                .trim()
                .toLowerCase();

            if (
              registeredUserId.length ===
                0 ||
              registeredUserEmail !==
                admission.normalizedEmail
            ) {
              throw APIError.from(
                'INTERNAL_SERVER_ERROR',
                {
                  code:
                    'TRUST_CLUB_REGISTRATION_BINDING_IDENTITY_MISMATCH',

                  message:
                    'Trust Club registration identity binding failed.',
                },
              );
            }

            try {
              await trustClubInvitationPersistence
                .bindConsumedToRegisteredUser({
                  invitationId:
                    admission.invitationId,

                  registeredUserId,
                });
            }
            catch {
              throw APIError.from(
                'INTERNAL_SERVER_ERROR',
                {
                  code:
                    'TRUST_CLUB_REGISTRATION_BINDING_PERSISTENCE_FAILED',

                  message:
                    'Trust Club registration identity binding could not be persisted.',
                },
              );
            }

            try {
              await ensureTrustClubEligibilityForUser(
                registeredUserId,
              );

              await ensureTrustClubMemberForUser(
                registeredUserId,
              );
            }
            catch {
              throw APIError.from(
                'INTERNAL_SERVER_ERROR',
                {
                  code:
                    'TRUST_CLUB_REGISTRATION_BOOTSTRAP_FAILED',

                  message:
                    'Trust Club post-registration provisioning could not be completed.',
                },
              );
            }
          },
        ),
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

export const TRUST_CLUB_BETTER_AUTH_REGISTRATION_GATE_RULE =
  'BETTER_AUTH_EMAIL_SIGN_UP_REQUIRES_SERVER_SIDE_TRUST_CLUB_REGISTRATION_ADMISSION' as const;

export const TRUST_CLUB_BETTER_AUTH_DIRECT_SIGN_UP_BYPASS_RULE =
  'DIRECT_BETTER_AUTH_SIGN_UP_CANNOT_BYPASS_TRUST_CLUB_REGISTRATION_ADMISSION' as const;

export const TRUST_CLUB_BETTER_AUTH_REGISTRATION_SECRET_RULE =
  'RAW_INVITATION_TOKEN_IS_REMOVED_BEFORE_BETTER_AUTH_USER_ACCOUNT_OR_SESSION_PROCESSING' as const;