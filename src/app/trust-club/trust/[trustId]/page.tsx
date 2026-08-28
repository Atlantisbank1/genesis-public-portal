'use client';

import Link from 'next/link';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

type TrustClubCanonicalTrust = {
  trustId:
    string;

  formationActionId:
    string;

  memberId:
    string;

  trustType:
    'STANDARD_TRUST';

  establishedAt:
    string;

  createdAt:
    string;

  updatedAt:
    string;
};

type TrustClubCanonicalTrustsResponse = {
  authenticatedUserId:
    string;

  memberId:
    string;

  membershipStatus:
    string;

  subscriptionStatus:
    string;

  trusts:
    readonly TrustClubCanonicalTrust[];
};

function isTrustClubCanonicalTrust(
  value:
    unknown,
): value is TrustClubCanonicalTrust {
  if (
    typeof value !==
      'object' ||
    value ===
      null
  ) {
    return false;
  }

  const record =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof record.trustId ===
      'string' &&
    typeof record.formationActionId ===
      'string' &&
    typeof record.memberId ===
      'string' &&
    record.trustType ===
      'STANDARD_TRUST' &&
    typeof record.establishedAt ===
      'string' &&
    typeof record.createdAt ===
      'string' &&
    typeof record.updatedAt ===
      'string'
  );
}

function isTrustClubCanonicalTrustsResponse(
  value:
    unknown,
): value is TrustClubCanonicalTrustsResponse {
  if (
    typeof value !==
      'object' ||
    value ===
      null
  ) {
    return false;
  }

  const record =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof record.authenticatedUserId ===
      'string' &&
    typeof record.memberId ===
      'string' &&
    typeof record.membershipStatus ===
      'string' &&
    typeof record.subscriptionStatus ===
      'string' &&
    Array.isArray(
      record.trusts,
    ) &&
    record.trusts.every(
      isTrustClubCanonicalTrust,
    )
  );
}

export default function TrustClubCanonicalTrustPage() {
  const params =
    useParams<{
      trustId:
        string;
    }>();

  const router =
    useRouter();

  const [
    trust,
    setTrust,
  ] =
    useState<TrustClubCanonicalTrust | null>(
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

  const trustId =
    typeof params.trustId ===
      'string'
      ? params.trustId
      : '';

  const loadTrust =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError(
          null,
        );

        try {
          const response =
            await fetch(
              '/api/trust-club/canonical-trusts',
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
              'Your Canonical Trust could not be loaded.',
            );

            return;
          }

          const payload:
            unknown =
            await response.json();

          if (
            !isTrustClubCanonicalTrustsResponse(
              payload,
            )
          ) {
            setError(
              'Trust Club returned an unexpected Canonical Trust response.',
            );

            return;
          }

          const selectedTrust =
            payload.trusts.find(
              (
                candidate,
              ) =>
                candidate.trustId ===
                trustId,
            );

          if (
            selectedTrust ===
              undefined
          ) {
            setError(
              'This Canonical Trust is not available to the authenticated Member.',
            );

            return;
          }

          setTrust(
            selectedTrust,
          );
        }
        catch {
          setError(
            'Your Canonical Trust could not be loaded.',
          );
        }
        finally {
          setLoading(
            false,
          );
        }
      },
      [
        router,
        trustId,
      ],
    );

  useEffect(
    () => {
      if (
        trustId.length ===
          0
      ) {
        setLoading(
          false,
        );

        setError(
          'Canonical Trust ID is required.',
        );

        return;
      }

      void loadTrust();
    },
    [
      loadTrust,
      trustId,
    ],
  );

  return (
    <main className="trustClubPage">
      <section className="trustClubHero">
        <p className="trustClubEyebrow">
          CANONICAL TRUST
        </p>

        <h1>
          Trust Management
        </h1>

        <p>
          View the established Trust record and access
          supported Trust Club administration from one
          controlled Trust workspace.
        </p>
      </section>

      <section className="trustClubDashboardActions">
        {
          loading
            ? (
                <p>
                  Loading Canonical Trust...
                </p>
              )
            : error !==
                null
              ? (
                  <div>
                    <h2>
                      Trust unavailable
                    </h2>

                    <p>
                      {error}
                    </p>

                    <Link
                      href="/trust-club/dashboard"
                      className="trustClubButton"
                    >
                      Back to Dashboard
                    </Link>
                  </div>
                )
              : trust !==
                  null
                ? (
                    <div>
                      <p className="trustClubEyebrow">
                        ESTABLISHED TRUST
                      </p>

                      <h2>
                        Standard Trust
                      </h2>

                      <div className="trustClubDashboardGrid">
                        <article className="trustClubDashboardCard">
                          <span>
                            Canonical Trust ID
                          </span>

                          <strong>
                            {trust.trustId}
                          </strong>

                          <small>
                            Established: {
                              new Date(
                                trust.establishedAt,
                              ).toLocaleDateString()
                            }
                          </small>
                        </article>

                        <article className="trustClubDashboardCard">
                          <span>
                            Formation Record
                          </span>

                          <strong>
                            {trust.formationActionId}
                          </strong>

                          <small>
                            Trust Type: Standard Trust
                          </small>
                        </article>
                      </div>

                      <div className="trustClubDashboardActions">
                        <div>
                          <p className="trustClubEyebrow">
                            TRUST ADMINISTRATION
                          </p>

                          <h2>
                            Manage this Trust
                          </h2>

                          <p>
                            Trust-specific administration services
                            will be connected to this Canonical Trust
                            workspace through controlled lifecycle
                            phases.
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/trust-club/dashboard"
                        className="trustClubButton"
                      >
                        Back to Dashboard
                      </Link>
                    </div>
                  )
                : null
        }
      </section>
    </main>
  );
}