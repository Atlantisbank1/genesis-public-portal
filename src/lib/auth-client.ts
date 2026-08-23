'use client';

import {
  createAuthClient,
} from 'better-auth/react';

/**
 * TRUST-CLUB-V1
 * PHASE 6.1
 *
 * Browser Authentication Client
 *
 * This client owns browser interaction with Better Auth only.
 *
 * It does NOT own:
 * - Trust Club eligibility;
 * - Membership authorization;
 * - subscription authorization;
 * - entitlement resolution;
 * - Trust relationship authority;
 * - action authorization;
 * - action lifecycle authority.
 *
 * Server-side Trust Club authorization remains authoritative.
 */

export const authClient =
  createAuthClient();

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} =
  authClient;