'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useRouter,
} from 'next/navigation';

import {
  signOut,
} from '@/lib/auth-client';

type TrustClubStatus = {
  status:
    'READY';

  user: {
    id:
      string;

    name:
      string;

    email:
      string;
  };

  eligibility: {
    status:
      'ELIGIBLE' |
      'REVIEW_REQUIRED' |
      'RESTRICTED';

    persisted:
      boolean;
  };

  membership:
    | null
    | {
        memberId:
          string;

        status:
          'PENDING' |
          'ACTIVE' |
          'GRACE' |
          'SUSPENDED' |
          'CANCELLED';

        subscriptionStatus:
          'PENDING' |
          'ACTIVE' |
          'GRACE' |
          'SUSPENDED' |
          'CANCELLED';

        planCode:
          string;
      };

  access: {
    state:
      'REVIEW_REQUIRED' |
      'RESTRICTED' |
      'MEMBERSHIP_REQUIRED' |
      'MEMBERSHIP_PENDING' |
      'ACTIVE';

    canStartTrust:
      boolean;
  };
};

function isTrustClubStatus(
  value:
    unknown,
): value is TrustClubStatus {
  if (
    typeof value !==
      'object' ||
    value ===
      null
  ) {
    return false;
  }

  return (
    'status' in value &&
    value.status ===
      'READY' &&
    'user' in value &&
    'eligibility' in value &&
    'membership' in value &&
    'access' in value
  );
}

function accessTitle(
  state:
    TrustClubStatus['access']['state'],
): string {
  switch (
    state
  ) {
    case 'REVIEW_REQUIRED':
      return 'Eligibility Review';

    case 'RESTRICTED':
      return 'Access Unavailable';

    case 'MEMBERSHIP_REQUIRED':
      return 'Membership Required';

    case 'MEMBERSHIP_PENDING':
      return 'Membership Pending';

    case 'ACTIVE':
      return 'Trust Club Active';
  }
}

function accessDescription(
  state:
    TrustClubStatus['access']['state'],
): string {
  switch (
    state
  ) {
    case 'REVIEW_REQUIRED':
      return 'Your Trust Club eligibility is currently under review. Service activation remains unavailable until the review is completed.';

    case 'RESTRICTED':
      return 'Trust Club service access is currently unavailable. Internal review information is not displayed through this public interface.';

    case 'MEMBERSHIP_REQUIRED':
      return 'Your identity is eligible, but a Trust Club Membership record has not yet been established.';

    case 'MEMBERSHIP_PENDING':
      return 'Your Membership or subscription is not yet active. Trust formation remains unavailable until activation is completed.';

    case 'ACTIVE':
      return 'Your eligibility, Membership and subscription state permit access to Standard Trust Formation.';
  }
}

export default function TrustClubDashboardPage() {
  const router =
    useRouter();

  const [
    status,
    setStatus,
  ] =
    useState<TrustClubStatus | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    membershipSubmitting,
    setMembershipSubmitting,
  ] =
    useState(
      false,
    );

  const [
    membershipError,
    setMembershipError,
  ] =
    useState<string | null>(
      null,
    );

  const loadStatus =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError(
          null,
        );

        const response =
          await fetch(
            '/api/trust-club/status',
            {
              method:
                'GET',

              cache:
                'no-store',
            },
          );

        if (
          response.status ===
            401
        ) {
          router.replace(
            '/trust-club/login',
          );

          return;
        }

        if (
          !response.ok
        ) {
          setError(
            'Trust Club status could not be loaded.',
          );

          setLoading(
            false,
          );

          return;
        }

        const payload:
          unknown =
          await response.json();

        if (
          !isTrustClubStatus(
            payload,
          )
        ) {
          setError(
            'Trust Club returned an unexpected status response.',
          );

          setLoading(
            false,
          );

          return;
        }

        setStatus(
          payload,
        );

        setLoading(
          false,
        );
      },
      [
        router,
      ],
    );

  useEffect(
    () => {
      void loadStatus();
    },
    [
      loadStatus,
    ],
  );

  async function handleEstablishMembership() {
    if (
      membershipSubmitting
    ) {
      return;
    }

    setMembershipSubmitting(
      true,
    );

    setMembershipError(
      null,
    );

    try {
      const response =
        await fetch(
          '/api/trust-club/membership',
          {
            method:
              'POST',

            cache:
              'no-store',
          },
        );

      if (
        response.status ===
          401
      ) {
        router.replace(
          '/trust-club/login',
        );

        return;
      }

      if (
        !response.ok
      ) {
        let reason =
          'Membership could not be established.';

        try {
          const payload:
            unknown =
            await response.json();

          if (
            typeof payload ===
              'object' &&
            payload !==
              null &&
            'status' in payload &&
            typeof payload.status ===
              'string'
          ) {
            reason =
              `Membership could not be established: ${payload.status}.`;
          }
        }
        catch {
          // Preserve the controlled public error message.
        }

        setMembershipError(
          reason,
        );

        return;
      }

      await loadStatus();
    }
    catch {
      setMembershipError(
        'Membership could not be established.',
      );
    }
    finally {
      setMembershipSubmitting(
        false,
      );
    }
  }

  async function handleSignOut() {
    await signOut();

    router.replace(
      '/trust-club/login',
    );

    router.refresh();
  }

  if (
    loading
  ) {
    return (
      <main className="trustClubDashboardPage">
        <section className="trustClubDashboardShell">
          <p className="trustClubEyebrow">
            GENESIS TRUST CLUB
          </p>

          <h1>
            Loading Your Dashboard
          </h1>

          <p className="trustClubDashboardLead">
            Resolving your authenticated Trust Club status.
          </p>
        </section>
      </main>
    );
  }

  if (
    error !==
      null
  ) {
    return (
      <main className="trustClubDashboardPage">
        <section className="trustClubDashboardShell">
          <p className="trustClubEyebrow">
            GENESIS TRUST CLUB
          </p>

          <h1>
            Dashboard Unavailable
          </h1>

          <div className="trustClubError">
            {error}
          </div>

          <button
            type="button"
            className="trustClubSubmitButton trustClubDashboardRetry"
            onClick={
              () =>
                void loadStatus()
            }
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  if (
    status ===
      null
  ) {
    return null;
  }

  return (
    <main className="trustClubDashboardPage">
      <section className="trustClubDashboardShell">
        <header className="trustClubDashboardHeader">
          <div>
            <p className="trustClubEyebrow">
              GENESIS TRUST CLUB
            </p>

            <h1>
              Welcome, {status.user.name}
            </h1>

            <p className="trustClubDashboardLead">
              Your secure Membership and Trust Formation workspace.
            </p>
          </div>

          <button
            type="button"
            className="trustClubDashboardSignOut"
            onClick={
              () =>
                void handleSignOut()
            }
          >
            Sign Out
          </button>
        </header>

        <section className="trustClubAccessCard">
          <span className={`trustClubAccessState trustClubAccessState-${status.access.state}`}>
            {status.access.state.replaceAll('_', ' ')}
          </span>

          <h2>
            {accessTitle(status.access.state)}
          </h2>

          <p>
            {accessDescription(status.access.state)}
          </p>

          {
            status.access.state ===
              'MEMBERSHIP_REQUIRED' &&
            (
              <div>
                <button
                  type="button"
                  className="trustClubSubmitButton"
                  disabled={
                    membershipSubmitting
                  }
                  onClick={
                    () =>
                      void handleEstablishMembership()
                  }
                >
                  {
                    membershipSubmitting
                      ? 'Establishing Membership...'
                      : 'Establish Membership'
                  }
                </button>

                {
                  membershipError !==
                    null &&
                  (
                    <div className="trustClubError">
                      {membershipError}
                    </div>
                  )
                }
              </div>
            )
          }
        </section>

        <section className="trustClubDashboardGrid">
          <article className="trustClubDashboardCard">
            <span>
              Eligibility
            </span>

            <strong>
              {status.eligibility.status.replaceAll('_', ' ')}
            </strong>

            <small>
              Access screening status
            </small>
          </article>

          <article className="trustClubDashboardCard">
            <span>
              Membership
            </span>

            <strong>
              {
                status.membership?.status ??
                'NOT ESTABLISHED'
              }
            </strong>

            <small>
              Trust Club Membership lifecycle
            </small>
          </article>

          <article className="trustClubDashboardCard">
            <span>
              Subscription
            </span>

            <strong>
              {
                status.membership
                  ?.subscriptionStatus ??
                'NOT ESTABLISHED'
              }
            </strong>

            <small>
              Service activation state
            </small>
          </article>

          <article className="trustClubDashboardCard">
            <span>
              Plan
            </span>

            <strong>
              {
                status.membership?.planCode ??
                'STANDARD MEMBERSHIP'
              }
            </strong>

            <small>
              Current Trust Club plan
            </small>
          </article>
        </section>

        <section className="trustClubDashboardActions">
          <div>
            <p className="trustClubEyebrow">
              TRUST SERVICES
            </p>

            <h2>
              Standard Trust Formation
            </h2>

            <p>
              Begin a controlled Standard Trust Formation request
              when your Eligibility, Membership and subscription
              state permit service access.
            </p>
          </div>

          {
            status.access.canStartTrust
              ? (
                  <Link
                    href="/trust-club/start"
                    className="trustClubButton"
                  >
                    Start a Trust
                  </Link>
                )
              : (
                  <button
                    type="button"
                    className="trustClubButton trustClubDisabledButton"
                    disabled
                  >
                    Start a Trust
                  </button>
                )
          }
        </section>

        <footer className="trustClubDashboardFooter">
          <span>
            Signed in as {status.user.email}
          </span>

          {
            status.membership !==
              null &&
            (
              <span>
                Member ID: {status.membership.memberId}
              </span>
            )
          }
        </footer>
      </section>
    </main>
  );
}