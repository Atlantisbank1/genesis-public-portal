'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

type InvitationStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'CONSUMED'
  | 'REJECTED'
  | 'REVOKED'
  | 'EXPIRED';

interface LaunchQueueItem {
  invitationId:
    string;

  normalizedEmail:
    string;

  status:
    InvitationStatus;

  expiresAt:
    string | null;

  paymentAccessExpiresAt:
    string | null;

  payment:
    {
      paymentIntentId:
        string;

      paymentReference:
        string;

      amountMinor:
        string;

      currency:
        string;

      paymentMethod:
        string;

      status:
        string;

      expiresAt:
        string | null;

      confirmedAt:
        string | null;

      createdAt:
        string;

      settlement:
        {
          settlementId:
            string;

          settlementReference:
            string;

          originatingInstitution:
            string | null;

          externalTransactionRef:
            string | null;

          amountMinor:
            string;

          currency:
            string;

          status:
            string;

          receivedAt:
            string;

          confirmedAt:
            string | null;

          verificationReference:
            string | null;
        } | null;
    } | null;

  approvedAt:
    string | null;

  consumedAt:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;
}

interface LaunchQueueResponse {
  ok:
    boolean;

  queue?: {
    items:
      LaunchQueueItem[];
  };

  error?:
    string;
}

type ConsoleState =
  | 'LOADING'
  | 'READY'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'ERROR';

function formatDate(
  value:
    string | null,
): string {
  if (value === null) {
    return 'â€”';
  }

  const date =
    new Date(
      value,
    );

  if (
    !Number.isFinite(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleString();
}

function statusLabel(
  status:
    InvitationStatus,
): string {
  switch (status) {
    case 'REQUESTED':
      return 'Awaiting review';

    case 'APPROVED':
      return 'Invitation issued';

    case 'CONSUMED':
      return 'Registration completed';

    case 'REJECTED':
      return 'Rejected';

    case 'REVOKED':
      return 'Revoked';

    case 'EXPIRED':
      return 'Expired';
  }
}

export default function TrustClubAdminPage() {
  const [
    state,
    setState,
  ] =
    useState<ConsoleState>(
      'LOADING',
    );

  const [
    items,
    setItems,
  ] =
    useState<
      LaunchQueueItem[]
    >([]);

  const [
    errorCode,
    setErrorCode,
  ] =
    useState<
      string | null
    >(null);

  const [
    issuingPaymentLinkFor,
    setIssuingPaymentLinkFor,
  ] =
    useState<string | null>(
      null,
    );

  const [
    privatePaymentLinks,
    setPrivatePaymentLinks,
  ] =
    useState<
      Record<string, string>
    >({});

  const [
    paymentLinkError,
    setPaymentLinkError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    settlementReferences,
    setSettlementReferences,
  ] =
    useState<Record<string, string>>(
      {},
    );

  const [
    originatingInstitutions,
    setOriginatingInstitutions,
  ] =
    useState<Record<string, string>>(
      {},
    );

  const [
    externalTransactionRefs,
    setExternalTransactionRefs,
  ] =
    useState<Record<string, string>>(
      {},
    );

  const [
    verificationReferences,
    setVerificationReferences,
  ] =
    useState<Record<string, string>>(
      {},
    );

  const [
    settlementActionFor,
    setSettlementActionFor,
  ] =
    useState<string | null>(
      null,
    );

  const [
    settlementError,
    setSettlementError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    registrationActionFor,
    setRegistrationActionFor,
  ] =
    useState<string | null>(
      null,
    );

  const [
    privateRegistrationLinks,
    setPrivateRegistrationLinks,
  ] =
    useState<Record<string, string>>(
      {},
    );

  const [
    registrationError,
    setRegistrationError,
  ] =
    useState<string | null>(
      null,
    );
  const loadQueue =
    useCallback(
      async () => {
        setState(
          'LOADING',
        );

        setErrorCode(
          null,
        );

        try {
          const response =
            await fetch(
              '/api/trust-club/admin/invitations',
              {
                method:
                  'GET',

                credentials:
                  'same-origin',

                cache:
                  'no-store',

                headers: {
                  Accept:
                    'application/json',
                },
              },
            );

          const payload =
            await response.json() as
              LaunchQueueResponse;

          if (
            response.status ===
              401
          ) {
            setItems(
              [],
            );

            setState(
              'UNAUTHENTICATED',
            );

            return;
          }

          if (
            response.status ===
              403
          ) {
            setItems(
              [],
            );

            setState(
              'FORBIDDEN',
            );

            return;
          }

          if (
            !response.ok ||
            payload.ok !==
              true ||
            payload.queue ===
              undefined
          ) {
            setItems(
              [],
            );

            setErrorCode(
              payload.error ??
                'TRUST_CLUB_ADMIN_LAUNCH_QUEUE_READ_FAILED',
            );

            setState(
              'ERROR',
            );

            return;
          }

          setItems(
            payload.queue.items,
          );

          setState(
            'READY',
          );
        } catch {
          setItems(
            [],
          );

          setErrorCode(
            'TRUST_CLUB_ADMIN_LAUNCH_QUEUE_NETWORK_ERROR',
          );

          setState(
            'ERROR',
          );
        }
      },
      [],
    );

  async function issuePrivatePaymentLink(
    invitationId:
      string,
  ) {
    setIssuingPaymentLinkFor(
      invitationId,
    );

    setPaymentLinkError(
      null,
    );

    try {
      const expiresAt =
        new Date(
          Date.now() +
            24 *
              60 *
              60 *
              1000,
        );

      const response =
        await fetch(
          `/api/trust-club/admin/invitations/${encodeURIComponent(
            invitationId,
          )}/payment-access-token`,
          {
            method:
              'POST',

            credentials:
              'same-origin',

            cache:
              'no-store',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json',
            },

            body:
              JSON.stringify({
                expiresAt:
                  expiresAt.toISOString(),
              }),
          },
        );

      const payload =
        await response.json() as {
          ok:
            boolean;

          invitation?: {
            id:
              string;

            normalizedEmail:
              string;

            status:
              InvitationStatus;

            paymentAccessExpiresAt:
              string | null;
          };

          rawPaymentAccessToken?:
            string;

          error?:
            string;
        };

      if (
        !response.ok ||
        payload.ok !==
          true ||
        typeof payload.rawPaymentAccessToken !==
          'string' ||
        payload.rawPaymentAccessToken.trim().length ===
          0
      ) {
        setPaymentLinkError(
          payload.error ??
            'TRUST_CLUB_PRIVATE_PAYMENT_LINK_ISSUANCE_FAILED',
        );

        return;
      }

      const privateLink =
        `${window.location.origin}/trust-club/payment?token=${encodeURIComponent(
          payload.rawPaymentAccessToken,
        )}`;

      setPrivatePaymentLinks(
        (
          current,
        ) => ({
          ...current,
          [invitationId]:
            privateLink,
        }),
      );

      await loadQueue();
    } catch {
      setPaymentLinkError(
        'TRUST_CLUB_PRIVATE_PAYMENT_LINK_ISSUANCE_FAILED',
      );
    } finally {
      setIssuingPaymentLinkFor(
        null,
      );
    }
  }

  async function copyPrivatePaymentLink(
    invitationId:
      string,
  ) {
    const privateLink =
      privatePaymentLinks[
        invitationId
      ];

    if (
      privateLink ===
      undefined
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        privateLink,
      );

      setPaymentLinkError(
        null,
      );
    } catch {
      setPaymentLinkError(
        'TRUST_CLUB_PRIVATE_PAYMENT_LINK_COPY_FAILED',
      );
    }
  }
  async function recordSettlement(
    item:
      LaunchQueueItem,
  ) {
    if (
      item.payment ===
      null
    ) {
      setSettlementError(
        'TRUST_CLUB_ADMIN_PAYMENT_INTENT_REQUIRED',
      );

      return;
    }

    const settlementReference =
      settlementReferences[
        item.invitationId
      ]?.trim() ??
      '';

    if (
      settlementReference.length ===
      0
    ) {
      setSettlementError(
        'TRUST_CLUB_SETTLEMENT_REFERENCE_REQUIRED',
      );

      return;
    }

    setSettlementActionFor(
      item.invitationId,
    );

    setSettlementError(
      null,
    );

    try {
      const response =
        await fetch(
          '/api/trust-club/admin/payments/settlements',
          {
            method:
              'POST',

            credentials:
              'same-origin',

            cache:
              'no-store',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json',
            },

            body:
              JSON.stringify({
                paymentReference:
                  item.payment.paymentReference,

                settlementReference,

                originatingInstitution:
                  originatingInstitutions[
                    item.invitationId
                  ]?.trim() ||
                  null,

                externalTransactionRef:
                  externalTransactionRefs[
                    item.invitationId
                  ]?.trim() ||
                  null,

                amountMinor:
                  item.payment.amountMinor,

                currency:
                  item.payment.currency,

                verificationReference:
                  verificationReferences[
                    item.invitationId
                  ]?.trim() ||
                  null,
              }),
          },
        );

      const payload =
        await response.json() as {
          ok:
            boolean;

          error?:
            string;
        };

      if (
        !response.ok ||
        payload.ok !==
          true
      ) {
        setSettlementError(
          payload.error ??
            'TRUST_CLUB_SETTLEMENT_RECEIPT_FAILED',
        );

        return;
      }

      await loadQueue();
    } catch {
      setSettlementError(
        'TRUST_CLUB_SETTLEMENT_RECEIPT_FAILED',
      );
    } finally {
      setSettlementActionFor(
        null,
      );
    }
  }

  async function confirmSettlement(
    item:
      LaunchQueueItem,
  ) {
    const settlement =
      item.payment?.settlement ??
      null;

    if (
      settlement ===
      null
    ) {
      setSettlementError(
        'TRUST_CLUB_ADMIN_SETTLEMENT_REQUIRED',
      );

      return;
    }

    setSettlementActionFor(
      item.invitationId,
    );

    setSettlementError(
      null,
    );

    try {
      const response =
        await fetch(
          '/api/trust-club/admin/payments/settlements/confirm',
          {
            method:
              'POST',

            credentials:
              'same-origin',

            cache:
              'no-store',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json',
            },

            body:
              JSON.stringify({
                settlementReference:
                  settlement.settlementReference,
              }),
          },
        );

      const payload =
        await response.json() as {
          ok:
            boolean;

          error?:
            string;
        };

      if (
        !response.ok ||
        payload.ok !==
          true
      ) {
        setSettlementError(
          payload.error ??
            'TRUST_CLUB_SETTLEMENT_CONFIRMATION_FAILED',
        );

        return;
      }

      await loadQueue();
    } catch {
      setSettlementError(
        'TRUST_CLUB_SETTLEMENT_CONFIRMATION_FAILED',
      );
    } finally {
      setSettlementActionFor(
        null,
      );
    }
  }

  async function issuePrivateRegistrationLink(
    invitationId:
      string,
  ) {
    setRegistrationActionFor(
      invitationId,
    );

    setRegistrationError(
      null,
    );

    try {
      const expiresAt =
        new Date(
          Date.now() +
            24 *
            60 *
            60 *
            1000,
        );

      const response =
        await fetch(
          `/api/trust-club/admin/invitations/${encodeURIComponent(
            invitationId,
          )}/issue-token`,
          {
            method:
              'POST',

            credentials:
              'same-origin',

            cache:
              'no-store',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json',
            },

            body:
              JSON.stringify({
                expiresAt:
                  expiresAt.toISOString(),
              }),
          },
        );

      const payload =
        await response.json() as {
          ok:
            boolean;

          rawToken?:
            string;

          error?:
            string;
        };

      if (
        !response.ok ||
        payload.ok !==
          true ||
        typeof payload.rawToken !==
          'string' ||
        payload.rawToken.trim().length ===
          0
      ) {
        setRegistrationError(
          payload.error ??
            'TRUST_CLUB_PRIVATE_REGISTRATION_LINK_ISSUANCE_FAILED',
        );

        return;
      }

      const privateLink =
        `${window.location.origin}/trust-club/register?token=${encodeURIComponent(
          payload.rawToken,
        )}`;

      setPrivateRegistrationLinks(
        (
          current,
        ) => ({
          ...current,

          [invitationId]:
            privateLink,
        }),
      );

      await loadQueue();
    } catch {
      setRegistrationError(
        'TRUST_CLUB_PRIVATE_REGISTRATION_LINK_ISSUANCE_FAILED',
      );
    } finally {
      setRegistrationActionFor(
        null,
      );
    }
  }

  async function copyPrivateRegistrationLink(
    invitationId:
      string,
  ) {
    const privateLink =
      privateRegistrationLinks[
        invitationId
      ];

    if (
      privateLink ===
      undefined
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        privateLink,
      );

      setRegistrationError(
        null,
      );
    } catch {
      setRegistrationError(
        'TRUST_CLUB_PRIVATE_REGISTRATION_LINK_COPY_FAILED',
      );
    }
  }
  useEffect(
    () => {
      void loadQueue();
    },
    [
      loadQueue,
    ],
  );

  return (
    <main
      style={{
        minHeight:
          '100vh',
        background:
          '#07111f',
        color:
          '#f8fafc',
        padding:
          '32px 20px 64px',
      }}
    >
      <div
        style={{
          width:
            'min(1180px, 100%)',
          margin:
            '0 auto',
        }}
      >
        <header
          style={{
            display:
              'flex',
            justifyContent:
              'space-between',
            gap:
              20,
            alignItems:
              'flex-start',
            flexWrap:
              'wrap',
            marginBottom:
              28,
          }}
        >
          <div>
            <p
              style={{
                margin:
                  '0 0 8px',
                color:
                  '#94a3b8',
                fontSize:
                  13,
                letterSpacing:
                  '0.12em',
                textTransform:
                  'uppercase',
              }}
            >
              Genesis Heritage Trust
            </p>

            <h1
              style={{
                margin:
                  0,
                fontSize:
                  'clamp(28px, 5vw, 44px)',
              }}
            >
              Trust Club Admin
            </h1>

            <p
              style={{
                margin:
                  '10px 0 0',
                color:
                  '#cbd5e1',
                maxWidth:
                  720,
                lineHeight:
                  1.6,
              }}
            >
              Private launch operations console for
              reviewing Trust Club admission requests.
            </p>
          </div>

          <div
            style={{
              display:
                'flex',
              gap:
                10,
              flexWrap:
                'wrap',
            }}
          >
            <button
              type="button"
              onClick={
                () => {
                  void loadQueue();
                }
              }
              disabled={
                state ===
                  'LOADING'
              }
              style={{
                border:
                  '1px solid #334155',
                background:
                  '#0f172a',
                color:
                  '#f8fafc',
                borderRadius:
                  10,
                padding:
                  '10px 16px',
                cursor:
                  'pointer',
              }}
            >
              Refresh Queue
            </button>

            <Link
              href="/trust-club/dashboard"
              style={{
                border:
                  '1px solid #334155',
                color:
                  '#f8fafc',
                borderRadius:
                  10,
                padding:
                  '10px 16px',
                textDecoration:
                  'none',
              }}
            >
              Trust Dashboard
            </Link>
          </div>
        </header>

        {state ===
          'LOADING' && (
          <section
            style={{
              border:
                '1px solid #1e293b',
              borderRadius:
                14,
              padding:
                24,
              background:
                '#0f172a',
            }}
          >
            Loading private launch queueâ€¦
          </section>
        )}

        {state ===
          'UNAUTHENTICATED' && (
          <section
            style={{
              border:
                '1px solid #7f1d1d',
              borderRadius:
                14,
              padding:
                24,
              background:
                '#1f1115',
            }}
          >
            <h2>
              Administrator sign-in required
            </h2>

            <p>
              This console is restricted to an
              authenticated Genesis Trust Club
              administrator.
            </p>

            <Link
              href="/trust-club/login"
              style={{
                color:
                  '#f8fafc',
              }}
            >
              Go to secure sign-in
            </Link>
          </section>
        )}

        {state ===
          'FORBIDDEN' && (
          <section
            style={{
              border:
                '1px solid #7f1d1d',
              borderRadius:
                14,
              padding:
                24,
              background:
                '#1f1115',
            }}
          >
            <h2>
              Administrative authority required
            </h2>

            <p>
              Your authenticated account does not
              hold the persisted TRUST_CLUB_ADMIN
              system role required for this console.
            </p>
          </section>
        )}

        {state ===
          'ERROR' && (
          <section
            style={{
              border:
                '1px solid #7c2d12',
              borderRadius:
                14,
              padding:
                24,
              background:
                '#1c1917',
            }}
          >
            <h2>
              Queue unavailable
            </h2>

            <p>
              The private launch queue could not be
              loaded.
            </p>

            {errorCode !==
              null && (
              <code>
                {errorCode}
              </code>
            )}
          </section>
        )}

        {state ===
          'READY' && (
          <>
            {paymentLinkError !==
              null ? (
                <section
                  role="alert"
                  style={{
                    border:
                      '1px solid #7c2d12',
                    borderRadius:
                      12,
                    padding:
                      14,
                    marginBottom:
                      16,
                    background:
                      '#1c1917',
                  }}
                >
                  Private payment link operation failed.
                  {' '}
                  <code>
                    {paymentLinkError}
                  </code>
                </section>
              ) : null}

            {settlementError !==
              null ? (
                <section
                  role="alert"
                  style={{
                    border:
                      '1px solid #7c2d12',
                    borderRadius:
                      12,
                    padding:
                      14,
                    marginBottom:
                      16,
                    background:
                      '#1c1917',
                  }}
                >
                  Settlement operation failed.
                  {' '}
                  <code>
                    {settlementError}
                  </code>
                </section>
              ) : null}

            {registrationError !==
              null ? (
                <section
                  role="alert"
                  style={{
                    border:
                      '1px solid #7c2d12',
                    borderRadius:
                      12,
                    padding:
                      14,
                    marginBottom:
                      16,
                    background:
                      '#1c1917',
                  }}
                >
                  Private registration link operation failed.
                  {' '}
                  <code>
                    {registrationError}
                  </code>
                </section>
              ) : null}

            <section
              style={{
                display:
                  'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(180px, 1fr))',
                gap:
                  12,
                marginBottom:
                  20,
              }}
            >
              <div
                style={{
                  background:
                    '#0f172a',
                  border:
                    '1px solid #1e293b',
                  borderRadius:
                    14,
                  padding:
                    18,
                }}
              >
                <div
                  style={{
                    color:
                      '#94a3b8',
                    fontSize:
                      13,
                  }}
                >
                  Queue records
                </div>

                <strong
                  style={{
                    display:
                      'block',
                    marginTop:
                      8,
                    fontSize:
                      28,
                  }}
                >
                  {items.length}
                </strong>
              </div>

              <div
                style={{
                  background:
                    '#0f172a',
                  border:
                    '1px solid #1e293b',
                  borderRadius:
                    14,
                  padding:
                    18,
                }}
              >
                <div
                  style={{
                    color:
                      '#94a3b8',
                    fontSize:
                      13,
                  }}
                >
                  Awaiting review
                </div>

                <strong
                  style={{
                    display:
                      'block',
                    marginTop:
                      8,
                    fontSize:
                      28,
                  }}
                >
                  {
                    items.filter(
                      (
                        item,
                      ) =>
                        item.status ===
                        'REQUESTED',
                    ).length
                  }
                </strong>
              </div>

              <div
                style={{
                  background:
                    '#0f172a',
                  border:
                    '1px solid #1e293b',
                  borderRadius:
                    14,
                  padding:
                    18,
                }}
              >
                <div
                  style={{
                    color:
                      '#94a3b8',
                    fontSize:
                      13,
                  }}
                >
                  Invitations issued
                </div>

                <strong
                  style={{
                    display:
                      'block',
                    marginTop:
                      8,
                    fontSize:
                      28,
                  }}
                >
                  {
                    items.filter(
                      (
                        item,
                      ) =>
                        item.status ===
                        'APPROVED',
                    ).length
                  }
                </strong>
              </div>

              <div
                style={{
                  background:
                    '#0f172a',
                  border:
                    '1px solid #1e293b',
                  borderRadius:
                    14,
                  padding:
                    18,
                }}
              >
                <div
                  style={{
                    color:
                      '#94a3b8',
                    fontSize:
                      13,
                  }}
                >
                  Registrations completed
                </div>

                <strong
                  style={{
                    display:
                      'block',
                    marginTop:
                      8,
                    fontSize:
                      28,
                  }}
                >
                  {
                    items.filter(
                      (
                        item,
                      ) =>
                        item.status ===
                        'CONSUMED',
                    ).length
                  }
                </strong>
              </div>
            </section>

            <section
              style={{
                border:
                  '1px solid #1e293b',
                borderRadius:
                  14,
                overflow:
                  'hidden',
                background:
                  '#0f172a',
              }}
            >
              <div
                style={{
                  padding:
                    '18px 20px',
                  borderBottom:
                    '1px solid #1e293b',
                }}
              >
                <h2
                  style={{
                    margin:
                      0,
                    fontSize:
                      20,
                  }}
                >
                  Admission Queue
                </h2>
              </div>

              {items.length ===
                0 ? (
                <div
                  style={{
                    padding:
                      24,
                    color:
                      '#94a3b8',
                  }}
                >
                  No admission requests are currently
                  in the queue.
                </div>
              ) : (
                <div
                  style={{
                    overflowX:
                      'auto',
                  }}
                >
                  <table
                    style={{
                      width:
                        '100%',
                      borderCollapse:
                        'collapse',
                      minWidth:
                        820,
                    }}
                  >
                    <thead>
                      <tr>
                        {
                          [
                            'Email',
                            'Status',
                            'Requested',
                            'Approved',
                            'Consumed',
                            'Invitation ID',
                            'Private Payment',
                              'Payment / Settlement',
                              'Private Registration',
                          ].map(
                            (
                              heading,
                            ) => (
                              <th
                                key={
                                  heading
                                }
                                style={{
                                  textAlign:
                                    'left',
                                  padding:
                                    '12px 16px',
                                  color:
                                    '#94a3b8',
                                  fontSize:
                                    12,
                                  borderBottom:
                                    '1px solid #1e293b',
                                }}
                              >
                                {heading}
                              </th>
                            ),
                          )
                        }
                      </tr>
                    </thead>

                    <tbody>
                      {items.map(
                        (
                          item,
                        ) => (
                          <tr
                            key={
                              item.invitationId
                            }
                          >
                            <td
                              style={{
                                padding:
                                  '14px 16px',
                                borderBottom:
                                  '1px solid #1e293b',
                              }}
                            >
                              {
                                item.normalizedEmail
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  '14px 16px',
                                borderBottom:
                                  '1px solid #1e293b',
                              }}
                            >
                              <strong>
                                {
                                  statusLabel(
                                    item.status,
                                  )
                                }
                              </strong>
                            </td>

                            <td
                              style={{
                                padding:
                                  '14px 16px',
                                borderBottom:
                                  '1px solid #1e293b',
                              }}
                            >
                              {
                                formatDate(
                                  item.createdAt,
                                )
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  '14px 16px',
                                borderBottom:
                                  '1px solid #1e293b',
                              }}
                            >
                              {
                                formatDate(
                                  item.approvedAt,
                                )
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  '14px 16px',
                                borderBottom:
                                  '1px solid #1e293b',
                              }}
                            >
                              {
                                formatDate(
                                  item.consumedAt,
                                )
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  '14px 16px',
                                borderBottom:
                                  '1px solid #1e293b',
                                fontFamily:
                                  'monospace',
                                fontSize:
                                  12,
                              }}
                            >
                              {
                                item.invitationId
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  '14px 16px',
                                borderBottom:
                                  '1px solid #1e293b',
                                minWidth:
                                  260,
                              }}
                            >
                              {item.status ===
                                'REQUESTED' ? (
                                  <>
                                    <div
                                      style={{
                                        marginBottom:
                                          8,
                                        color:
                                          '#cbd5e1',
                                        fontSize:
                                          12,
                                      }}
                                    >
                                      {item.paymentAccessExpiresAt ===
                                      null
                                        ? 'Private payment access not issued'
                                        : `Issued — expires ${formatDate(
                                            item.paymentAccessExpiresAt,
                                          )}`}
                                    </div>

                                    {item.paymentAccessExpiresAt ===
                                    null ? (
                                      <button
                                        type="button"
                                        disabled={
                                          issuingPaymentLinkFor ===
                                          item.invitationId
                                        }
                                        onClick={
                                          () => {
                                            void issuePrivatePaymentLink(
                                              item.invitationId,
                                            );
                                          }
                                        }
                                      >
                                        {issuingPaymentLinkFor ===
                                        item.invitationId
                                          ? 'Issuing...'
                                          : 'Issue Private Payment Link'}
                                      </button>
                                    ) : null}

                                    {privatePaymentLinks[
                                      item.invitationId
                                    ] !==
                                    undefined ? (
                                      <div
                                        style={{
                                          marginTop:
                                            10,
                                        }}
                                      >
                                        <input
                                          type="text"
                                          readOnly
                                          value={
                                            privatePaymentLinks[
                                              item.invitationId
                                            ]
                                          }
                                          aria-label="Private payment link"
                                          style={{
                                            width:
                                              '100%',
                                            marginBottom:
                                              8,
                                          }}
                                        />

                                        <button
                                          type="button"
                                          onClick={
                                            () => {
                                              void copyPrivatePaymentLink(
                                                item.invitationId,
                                              );
                                            }
                                          }
                                        >
                                          Copy Private Payment Link
                                        </button>
                                      </div>
                                    ) : null}
                                  </>
                                ) : (
                                  <span
                                    style={{
                                      color:
                                        '#64748b',
                                    }}
                                  >
                                    —
                                  </span>
                                )}
                            </td>
                              <td
                                style={{
                                  padding:
                                    '14px 16px',
                                  borderBottom:
                                    '1px solid #1e293b',
                                  minWidth:
                                    320,
                                  verticalAlign:
                                    'top',
                                }}
                              >
                                {item.payment ===
                                null ? (
                                  <span
                                    style={{
                                      color:
                                        '#64748b',
                                    }}
                                  >
                                    No Payment Intent
                                  </span>
                                ) : (
                                  <>
                                    <div
                                      style={{
                                        marginBottom:
                                          8,
                                      }}
                                    >
                                      <strong>
                                        {item.payment.paymentReference}
                                      </strong>
                                    </div>

                                    <div
                                      style={{
                                        color:
                                          '#cbd5e1',
                                        fontSize:
                                          12,
                                        marginBottom:
                                          8,
                                      }}
                                    >
                                      {`${item.payment.amountMinor} ${item.payment.currency} · ${item.payment.paymentMethod} · ${item.payment.status}`}
                                    </div>

                                    {item.payment.settlement ===
                                    null ? (
                                      <>
                                        <input
                                          type="text"
                                          value={
                                            settlementReferences[
                                              item.invitationId
                                            ] ??
                                            ''
                                          }
                                          onChange={
                                            (
                                              event,
                                            ) => {
                                              setSettlementReferences(
                                                (
                                                  current,
                                                ) => ({
                                                  ...current,
                                                  [item.invitationId]:
                                                    event.target.value,
                                                }),
                                              );
                                            }
                                          }
                                          placeholder="Settlement reference"
                                          aria-label="Settlement reference"
                                          style={{
                                            width:
                                              '100%',
                                            marginBottom:
                                              6,
                                          }}
                                        />

                                        <input
                                          type="text"
                                          value={
                                            originatingInstitutions[
                                              item.invitationId
                                            ] ??
                                            ''
                                          }
                                          onChange={
                                            (
                                              event,
                                            ) => {
                                              setOriginatingInstitutions(
                                                (
                                                  current,
                                                ) => ({
                                                  ...current,
                                                  [item.invitationId]:
                                                    event.target.value,
                                                }),
                                              );
                                            }
                                          }
                                          placeholder="Originating institution (optional)"
                                          aria-label="Originating institution"
                                          style={{
                                            width:
                                              '100%',
                                            marginBottom:
                                              6,
                                          }}
                                        />

                                        <input
                                          type="text"
                                          value={
                                            externalTransactionRefs[
                                              item.invitationId
                                            ] ??
                                            ''
                                          }
                                          onChange={
                                            (
                                              event,
                                            ) => {
                                              setExternalTransactionRefs(
                                                (
                                                  current,
                                                ) => ({
                                                  ...current,
                                                  [item.invitationId]:
                                                    event.target.value,
                                                }),
                                              );
                                            }
                                          }
                                          placeholder="External transaction reference (optional)"
                                          aria-label="External transaction reference"
                                          style={{
                                            width:
                                              '100%',
                                            marginBottom:
                                              6,
                                          }}
                                        />

                                        <input
                                          type="text"
                                          value={
                                            verificationReferences[
                                              item.invitationId
                                            ] ??
                                            ''
                                          }
                                          onChange={
                                            (
                                              event,
                                            ) => {
                                              setVerificationReferences(
                                                (
                                                  current,
                                                ) => ({
                                                  ...current,
                                                  [item.invitationId]:
                                                    event.target.value,
                                                }),
                                              );
                                            }
                                          }
                                          placeholder="Verification reference (optional)"
                                          aria-label="Verification reference"
                                          style={{
                                            width:
                                              '100%',
                                            marginBottom:
                                              8,
                                          }}
                                        />

                                        <button
                                          type="button"
                                          disabled={
                                            settlementActionFor ===
                                              item.invitationId ||
                                            item.payment.status !==
                                              'AWAITING_SETTLEMENT'
                                          }
                                          onClick={
                                            () => {
                                              void recordSettlement(
                                                item,
                                              );
                                            }
                                          }
                                        >
                                          {settlementActionFor ===
                                          item.invitationId
                                            ? 'Recording...'
                                            : 'Record Settlement Receipt'}
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          style={{
                                            color:
                                              '#cbd5e1',
                                            fontSize:
                                              12,
                                            marginBottom:
                                              8,
                                          }}
                                        >
                                          {`Settlement ${item.payment.settlement.settlementReference} · ${item.payment.settlement.status}`}
                                        </div>

                                        {item.payment.settlement.status ===
                                        'RECEIVED' ? (
                                          <button
                                            type="button"
                                            disabled={
                                              settlementActionFor ===
                                              item.invitationId
                                            }
                                            onClick={
                                              () => {
                                                void confirmSettlement(
                                                  item,
                                                );
                                              }
                                            }
                                          >
                                            {settlementActionFor ===
                                            item.invitationId
                                              ? 'Confirming...'
                                              : 'Confirm Settlement'}
                                          </button>
                                        ) : null}
                                      </>
                                    )}
                                  </>
                                )}
                              </td>

                              <td
                                style={{
                                  padding:
                                    '14px 16px',
                                  borderBottom:
                                    '1px solid #1e293b',
                                  minWidth:
                                    280,
                                  verticalAlign:
                                    'top',
                                }}
                              >
                                {item.status ===
                                  'REQUESTED' &&
                                item.payment?.status ===
                                  'CONFIRMED' &&
                                item.payment.settlement?.status ===
                                  'CONFIRMED' ? (
                                  <>
                                    <button
                                      type="button"
                                      disabled={
                                        registrationActionFor ===
                                        item.invitationId
                                      }
                                      onClick={
                                        () => {
                                          void issuePrivateRegistrationLink(
                                            item.invitationId,
                                          );
                                        }
                                      }
                                    >
                                      {registrationActionFor ===
                                      item.invitationId
                                        ? 'Issuing...'
                                        : 'Issue Private Registration Link'}
                                    </button>

                                    {privateRegistrationLinks[
                                      item.invitationId
                                    ] !==
                                    undefined ? (
                                      <div
                                        style={{
                                          marginTop:
                                            10,
                                        }}
                                      >
                                        <input
                                          type="text"
                                          readOnly
                                          value={
                                            privateRegistrationLinks[
                                              item.invitationId
                                            ]
                                          }
                                          aria-label="Private registration link"
                                          style={{
                                            width:
                                              '100%',
                                            marginBottom:
                                              8,
                                          }}
                                        />

                                        <button
                                          type="button"
                                          onClick={
                                            () => {
                                              void copyPrivateRegistrationLink(
                                                item.invitationId,
                                              );
                                            }
                                          }
                                        >
                                          Copy Private Registration Link
                                        </button>
                                      </div>
                                    ) : null}
                                  </>
                                ) : (
                                  <span
                                    style={{
                                      color:
                                        '#64748b',
                                    }}
                                  >
                                    Payment and settlement confirmation required
                                  </span>
                                )}
                              </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}