'use client';

import {
  FormEvent,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useRouter,
} from 'next/navigation';

import {
  signUp,
} from '@/lib/auth-client';

export default function TrustClubRegisterPage() {
  const router =
    useRouter();

  const [
    name,
    setName,
  ] =
    useState('');

  const [
    email,
    setEmail,
  ] =
    useState('');

  const [
    rawInvitationToken,
    setRawInvitationToken,
  ] =
    useState('');

  const [
    password,
    setPassword,
  ] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState('');

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(
      null,
    );

    const normalizedName =
      name.trim();

    const normalizedEmail =
      email.trim();

    const invitationToken =
      rawInvitationToken.trim();

    if (
      invitationToken.length ===
        0
    ) {
      setError(
        'A valid Trust Club invitation token is required.',
      );

      return;
    }

    if (
      password !==
        confirmPassword
    ) {
      setError(
        'Passwords do not match.',
      );

      return;
    }

    setSubmitting(
      true,
    );

    /**
     * Phase 7.2:
     *
     * Establish the Trust Club registration-admission boundary
     * BEFORE requesting Better Auth account creation.
     *
     * This browser-side admission request improves the registration
     * flow, but it is NOT the security authority by itself.
     *
     * Better Auth /sign-up/email is independently protected by the
     * server-side Phase 7.2 admission hook.
     */
    let admissionResponse:
      Response;

    try {
      admissionResponse =
        await fetch(
          '/api/trust-club/registration/admission',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            cache:
              'no-store',

            body:
              JSON.stringify({
                email:
                  normalizedEmail,

                rawInvitationToken:
                  invitationToken,
              }),
          },
        );
    }
    catch {
      setError(
        'Registration admission could not be verified.',
      );

      setSubmitting(
        false,
      );

      return;
    }

    if (
      !admissionResponse.ok
    ) {
      setError(
        'Your invitation is not valid for this registration.',
      );

      setSubmitting(
        false,
      );

      return;
    }

    /**
     * Better Auth owns account and session creation.
     *
     * rawInvitationToken is NOT part of the typed Better Auth
     * sign-up model. Better Auth officially exposes fetchOptions
     * for this request, including an onRequest lifecycle hook.
     *
     * Phase 7.2 uses that supported request boundary to attach the
     * transient invitation proof to the outgoing sign-up body.
     *
     * The server-side Better Auth before-hook independently verifies
     * the proof and removes rawInvitationToken before Better Auth
     * user/account/session processing.
     */
    const result =
      await signUp.email({
        name:
          normalizedName,

        email:
          normalizedEmail,

        password,

        fetchOptions: {
          onRequest(
            context,
          ) {
            if (
              typeof context.body ===
                'object' &&
              context.body !==
                null
            ) {
              context.body = {
                ...context.body,

                rawInvitationToken:
                  invitationToken,
              };
            }

            return context;
          },
        },
      });

    if (
      result.error
    ) {
      setError(
        result.error.message ??
        'Registration could not be completed.',
      );

      setSubmitting(
        false,
      );

      return;
    }

    /**
     * Establish the Trust Club Eligibility boundary immediately.
     *
     * Account creation does NOT establish Membership.
     *
     * A newly registered identity normally receives:
     *
     * REVIEW_REQUIRED
     *
     * A 403 response is therefore expected and does not mean
     * registration failed.
     */
    const membershipEntry =
      await fetch(
        '/api/trust-club/membership',
        {
          method:
            'POST',
        },
      );

    if (
      membershipEntry.status ===
        401
    ) {
      setError(
        'Your account was created, but the authenticated session could not be established.',
      );

      setSubmitting(
        false,
      );

      return;
    }

    /**
     * Remove the transient proof from client state after successful
     * account creation.
     */
    setRawInvitationToken(
      '',
    );

    router.push(
      '/trust-club/dashboard',
    );

    router.refresh();
  }

  return (
    <main className="trustClubAuthPage">
      <section className="trustClubAuthCard">
        <p className="trustClubEyebrow">
          GENESIS TRUST CLUB
        </p>

        <h1>
          Create Your Account
        </h1>

        <p className="trustClubAuthIntro">
          Registration requires a redeemed Trust Club invitation.
          Creating an authentication identity does not automatically
          establish Membership or service eligibility.
        </p>

        <form
          className="trustClubForm"
          onSubmit={handleSubmit}
        >
          <label>
            Full Name

            <input
              type="text"
              value={name}
              onChange={
                (event) =>
                  setName(
                    event.target.value,
                  )
              }
              autoComplete="name"
              required
            />
          </label>

          <label>
            Email Address

            <input
              type="email"
              value={email}
              onChange={
                (event) =>
                  setEmail(
                    event.target.value,
                  )
              }
              autoComplete="email"
              required
            />
          </label>

          <label>
            Invitation Token

            <input
              type="password"
              value={rawInvitationToken}
              onChange={
                (event) =>
                  setRawInvitationToken(
                    event.target.value,
                  )
              }
              autoComplete="off"
              spellCheck={false}
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={
                (event) =>
                  setPassword(
                    event.target.value,
                  )
              }
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label>
            Confirm Password

            <input
              type="password"
              value={confirmPassword}
              onChange={
                (event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
              }
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {
            error !==
              null &&
            (
              <div className="trustClubError">
                {error}
              </div>
            )
          }

          <button
            type="submit"
            className="trustClubSubmitButton"
            disabled={submitting}
          >
            {
              submitting
                ? 'Creating Account...'
                : 'Create Account'
            }
          </button>
        </form>

        <p className="trustClubAuthFooter">
          Already registered?{' '}

          <Link href="/trust-club/login">
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}

export const TRUST_CLUB_REGISTER_PAGE_ADMISSION_ORDER_RULE =
  'REGISTRATION_ADMISSION_REQUEST_PRECEDES_BETTER_AUTH_SIGN_UP' as const;

export const TRUST_CLUB_REGISTER_PAGE_SERVER_AUTHORITY_RULE =
  'BROWSER_ADMISSION_CHECK_DOES_NOT_REPLACE_SERVER_SIDE_BETTER_AUTH_REGISTRATION_GATE' as const;

export const TRUST_CLUB_REGISTER_PAGE_INVITATION_PROOF_RULE =
  'RAW_INVITATION_TOKEN_IS_TRANSIENT_REGISTRATION_PROOF' as const;

export const TRUST_CLUB_REGISTER_PAGE_MEMBERSHIP_RULE =
  'ACCOUNT_REGISTRATION_DOES_NOT_ESTABLISH_TRUST_CLUB_MEMBERSHIP' as const;