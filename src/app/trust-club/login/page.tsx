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
  signIn,
} from '@/lib/auth-client';

export default function TrustClubLoginPage() {
  const router =
    useRouter();

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

    setSubmitting(
      true,
    );

    const result =
      await signIn.email({
        email:
          email.trim(),

        password,
      });

    if (
      result.error
    ) {
      setError(
        result.error.message ??
        'Sign in could not be completed.',
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
          Sign In
        </h1>

        <p className="trustClubAuthIntro">
          Access your Trust Club identity and continue through
          the applicable eligibility and Membership stages.
        </p>

        <form
          className="trustClubForm"
          onSubmit={handleSubmit}
        >
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
              autoComplete="current-password"
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
                ? 'Signing In...'
                : 'Sign In'
            }
          </button>
        </form>

        <p className="trustClubAuthFooter">
          Need an account?{' '}

          <Link href="/trust-club/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}