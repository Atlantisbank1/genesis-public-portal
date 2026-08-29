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
    return '—';
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
            Loading private launch queue…
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