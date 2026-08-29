'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

type PaymentMethod =
  | 'INSTITUTIONAL_RAIL'
  | 'BANK_TRANSFER'
  | 'STANDING_ORDER'
  | 'CRYPTO'
  | 'CASH'
  | 'MANUAL';

interface PaymentIntentResponse {
  ok:
    boolean;

  paymentIntent?: {
    paymentIntentId:
      string;

    paymentReference:
      string;

    normalizedEmail:
      string;

    planCode:
      string;

    amountMinor:
      string;

    currency:
      string;

    paymentMethod:
      PaymentMethod;

    status:
      string;

    expiresAt:
      string | null;

    createdAt:
      string;
  };

  error?:
    string;
}

const PAYMENT_METHODS:
  readonly {
    value:
      PaymentMethod;

    label:
      string;

    description:
      string;
  }[] = [
    {
      value:
        'BANK_TRANSFER',

      label:
        'Bank Transfer',

      description:
        'Choose bank transfer for settlement through your banking institution.',
    },
    {
      value:
        'STANDING_ORDER',

      label:
        'Standing Order',

      description:
        'Choose a standing order where recurring bank instructions are appropriate.',
    },
    {
      value:
        'CRYPTO',

      label:
        'Crypto',

      description:
        'Choose an available supported digital-asset settlement route.',
    },
    {
      value:
        'INSTITUTIONAL_RAIL',

      label:
        'Institutional Rail',

      description:
        'Choose an approved institutional settlement rail where available.',
    },
    {
      value:
        'CASH',

      label:
        'Cash',

      description:
        'Choose cash only where Genesis has approved a manual settlement arrangement.',
    },
    {
      value:
        'MANUAL',

      label:
        'Other / Manual',

      description:
        'Choose this option when Genesis has provided another approved settlement arrangement.',
    },
  ];

function formatMoney(
  amountMinor:
    string,
  currency:
    string,
): string {
  const amount =
    Number(
      amountMinor,
    ) / 100;

  if (
    !Number.isFinite(
      amount,
    )
  ) {
    return `${amountMinor} ${currency}`;
  }

  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style:
          'currency',

        currency,
      },
    ).format(
      amount,
    );
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function TrustClubPrivatePaymentPage() {
  const [
    paymentAccessToken,
    setPaymentAccessToken,
  ] =
    useState('');

  const [
    selectedMethod,
    setSelectedMethod,
  ] =
    useState<PaymentMethod>(
      'BANK_TRANSFER',
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    errorCode,
    setErrorCode,
  ] =
    useState<string | null>(
      null,
    );

  const [
    paymentIntent,
    setPaymentIntent,
  ] =
    useState<
      NonNullable<
        PaymentIntentResponse['paymentIntent']
      > | null
    >(null);

  useEffect(
    () => {
      const params =
        new URLSearchParams(
          window.location.search,
        );

      const token =
        params.get(
          'token',
        );

      if (
        token !==
          null &&
        token.trim().length >
          0
      ) {
        setPaymentAccessToken(
          token.trim(),
        );

        /*
         * Hold the raw private capability only in React memory,
         * then immediately remove it from the visible URL.
         * Reloading the page intentionally loses the capability.
         */
        window.history.replaceState(
          null,
          '',
          '/trust-club/payment',
        );
      }
    },
    [],
  );

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const token =
      paymentAccessToken.trim();

    if (
      token.length ===
      0
    ) {
      setErrorCode(
        'TRUST_CLUB_PAYMENT_ACCESS_TOKEN_REQUIRED',
      );

      return;
    }

    setSubmitting(
      true,
    );

    setErrorCode(
      null,
    );

    try {
      const response =
        await fetch(
          '/api/trust-club/invitations/payment-intent',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json',
            },

            cache:
              'no-store',

            body:
              JSON.stringify({
                paymentAccessToken:
                  token,

                paymentMethod:
                  selectedMethod,
              }),
          },
        );

      const payload =
        await response.json() as
          PaymentIntentResponse;

      if (
        !response.ok ||
        payload.ok !==
          true ||
        payload.paymentIntent ===
          undefined
      ) {
        setErrorCode(
          payload.error ??
            'TRUST_CLUB_PAYMENT_INTENT_CREATION_FAILED',
        );

        return;
      }

      setPaymentIntent(
        payload.paymentIntent,
      );

      setPaymentAccessToken(
        '',
      );
    } catch {
      setErrorCode(
        'TRUST_CLUB_PAYMENT_INTENT_CREATION_FAILED',
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

  if (
    paymentIntent !==
    null
  ) {
    return (
      <main
        style={{
          maxWidth:
            '760px',
          margin:
            '0 auto',
          padding:
            '48px 24px 80px',
        }}
      >
        <p>
          Genesis Heritage Trust
        </p>

        <h1>
          Payment Instructions
        </h1>

        <p>
          Your payment instruction has been created.
          Settlement must still be independently verified
          before registration access can be issued.
        </p>

        <dl>
          <dt>
            Account Email
          </dt>
          <dd>
            {paymentIntent.normalizedEmail}
          </dd>

          <dt>
            Membership
          </dt>
          <dd>
            Standard Family Membership
          </dd>

          <dt>
            Amount
          </dt>
          <dd>
            {formatMoney(
              paymentIntent.amountMinor,
              paymentIntent.currency,
            )}
          </dd>

          <dt>
            Payment Method
          </dt>
          <dd>
            {PAYMENT_METHODS.find(
              (method) =>
                method.value ===
                paymentIntent.paymentMethod,
            )?.label ??
              paymentIntent.paymentMethod}
          </dd>

          <dt>
            Payment Reference
          </dt>
          <dd>
            <strong>
              {paymentIntent.paymentReference}
            </strong>
          </dd>

          <dt>
            Status
          </dt>
          <dd>
            Awaiting Settlement
          </dd>
        </dl>

        <p>
          Use the payment reference exactly as shown.
          Registration is not active until Genesis verifies
          settlement and issues the separate private
          registration invitation.
        </p>

        <p>
          <Link href="/">
            Return to Genesis
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth:
          '760px',
        margin:
          '0 auto',
        padding:
          '48px 24px 80px',
      }}
    >
      <p>
        Genesis Heritage Trust
      </p>

      <h1>
        Trust Club Private Payment
      </h1>

      <p>
        This is a private admission payment page.
        Choose your preferred payment method below.
        Genesis determines the authoritative membership
        price and currency on the server.
      </p>

      <p>
        Standard Family Membership:
        <strong> ₪99 per month</strong>.
        Spouse or partner inclusion carries no additional
        membership surcharge.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <fieldset
          disabled={
            submitting
          }
        >
          <legend>
            Select Payment Method
          </legend>

          {PAYMENT_METHODS.map(
            (method) => (
              <label
                key={
                  method.value
                }
                style={{
                  display:
                    'block',
                  marginBottom:
                    '18px',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={
                    method.value
                  }
                  checked={
                    selectedMethod ===
                    method.value
                  }
                  onChange={
                    () => {
                      setSelectedMethod(
                        method.value,
                      );
                    }
                  }
                />

                {' '}

                <strong>
                  {method.label}
                </strong>

                <span
                  style={{
                    display:
                      'block',
                    marginLeft:
                      '24px',
                  }}
                >
                  {method.description}
                </span>
              </label>
            ),
          )}
        </fieldset>

        {errorCode !==
          null ? (
            <p
              role="alert"
            >
              Payment request could not be created.
              Reference: {errorCode}
            </p>
          ) : null}

        <button
          type="submit"
          disabled={
            submitting ||
            paymentAccessToken.length ===
              0
          }
        >
          {submitting
            ? 'Creating Payment Instruction...'
            : 'Continue to Payment Instructions'}
        </button>
      </form>

      {paymentAccessToken.length ===
        0 ? (
          <p>
            This private payment link is missing or invalid.
            Please use the secure link supplied by Genesis.
          </p>
        ) : null}

      <p>
        Selecting a payment method does not confirm payment,
        settlement, membership, or registration.
      </p>

      <p>
        <Link href="/">
          Return to Genesis
        </Link>
      </p>
    </main>
  );
}

export const TRUST_CLUB_PRIVATE_PAYMENT_PAGE_AUTHORITY_RULE =
  'CUSTOMER_SELECTS_PAYMENT_METHOD_BUT_SERVER_OWNS_PRICE_CURRENCY_AND_PAYMENT_INTENT' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_PAGE_SETTLEMENT_RULE =
  'PAYMENT_METHOD_SELECTION_DOES_NOT_CONFIRM_SETTLEMENT' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_PAGE_REGISTRATION_RULE =
  'PAYMENT_PAGE_DOES_NOT_AUTHORIZE_REGISTRATION_OR_MEMBERSHIP' as const;

export const TRUST_CLUB_PRIVATE_PAYMENT_PAGE_TOKEN_RULE =
  'RAW_PAYMENT_ACCESS_TOKEN_IS_TRANSIENT_PRIVATE_PAYMENT_PROOF' as const;