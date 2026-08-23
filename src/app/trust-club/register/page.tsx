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

    const result =
      await signUp.email({
        name:
          name.trim(),

        email:
          email.trim(),

        password,
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
          Registration establishes your secure authentication
          identity. Trust Club service access remains subject to
          eligibility and Membership review.
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