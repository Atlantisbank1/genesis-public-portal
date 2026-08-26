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

type StandardTrustCreated = {
  status:
    'CREATED';

  actionId:
    string;

  actionStatus:
    string;

  actionType:
    string;

  memberId:
    string;
};

type StandardTrustFormation = {
  actionId:
    string;

  trustName:
    string | null;

  trustPurpose:
    string | null;

  settlorName:
    string | null;

  trusteeName:
    string | null;

  beneficiaryName:
    string | null;

  protectorName:
    string | null;

  initialPropertyDescription:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;
};

type FormationReadyResponse = {
  status:
    'READY';

  actionId:
    string;

  actionType:
    'CREATE_STANDARD_TRUST';

  actionStatus:
    string;

  formation:
    StandardTrustFormation |
    null;
};

type FormationSavedResponse = {
  status:
    'SAVED';

  actionId:
    string;

  actionType:
    'CREATE_STANDARD_TRUST';

  actionStatus:
    string;

  formation:
    StandardTrustFormation;
};

type FormationDraft = {
  trustName:
    string;

  trustPurpose:
    string;

  settlorName:
    string;

  trusteeName:
    string;

  beneficiaryName:
    string;

  protectorName:
    string;

  initialPropertyDescription:
    string;
};

const EMPTY_FORMATION_DRAFT:
  FormationDraft = {
    trustName:
      '',

    trustPurpose:
      '',

    settlorName:
      '',

    trusteeName:
      '',

    beneficiaryName:
      '',

    protectorName:
      '',

    initialPropertyDescription:
      '',
  };

const ACTION_STORAGE_KEY =
  'genesis-trust-club-standard-trust-action-id';

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

function isStandardTrustCreated(
  value:
    unknown,
): value is StandardTrustCreated {
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
      'CREATED' &&
    'actionId' in value &&
    typeof value.actionId ===
      'string' &&
    'actionStatus' in value &&
    typeof value.actionStatus ===
      'string' &&
    'actionType' in value &&
    typeof value.actionType ===
      'string' &&
    'memberId' in value &&
    typeof value.memberId ===
      'string'
  );
}

function isFormationReadyResponse(
  value:
    unknown,
): value is FormationReadyResponse {
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
    'actionId' in value &&
    typeof value.actionId ===
      'string' &&
    'actionType' in value &&
    value.actionType ===
      'CREATE_STANDARD_TRUST' &&
    'actionStatus' in value &&
    typeof value.actionStatus ===
      'string' &&
    'formation' in value
  );
}

function isFormationSavedResponse(
  value:
    unknown,
): value is FormationSavedResponse {
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
      'SAVED' &&
    'actionId' in value &&
    typeof value.actionId ===
      'string' &&
    'actionType' in value &&
    value.actionType ===
      'CREATE_STANDARD_TRUST' &&
    'actionStatus' in value &&
    typeof value.actionStatus ===
      'string' &&
    'formation' in value &&
    typeof value.formation ===
      'object' &&
    value.formation !==
      null
  );
}

function formationToDraft(
  formation:
    StandardTrustFormation |
    null,
): FormationDraft {
  if (
    formation ===
      null
  ) {
    return {
      ...EMPTY_FORMATION_DRAFT,
    };
  }

  return {
    trustName:
      formation.trustName ??
      '',

    trustPurpose:
      formation.trustPurpose ??
      '',

    settlorName:
      formation.settlorName ??
      '',

    trusteeName:
      formation.trusteeName ??
      '',

    beneficiaryName:
      formation.beneficiaryName ??
      '',

    protectorName:
      formation.protectorName ??
      '',

    initialPropertyDescription:
      formation.initialPropertyDescription ??
      '',
  };
}

export default function StandardTrustFormationPage() {
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
    loadError,
    setLoadError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    consentAccepted,
    setConsentAccepted,
  ] =
    useState(
      false,
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false,
    );

  const [
    submitError,
    setSubmitError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    created,
    setCreated,
  ] =
    useState<StandardTrustCreated | null>(
      null,
    );

  const [
    activeActionId,
    setActiveActionId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    actionStatus,
    setActionStatus,
  ] =
    useState<string | null>(
      null,
    );

  const [
    formationDraft,
    setFormationDraft,
  ] =
    useState<FormationDraft>({
      ...EMPTY_FORMATION_DRAFT,
    });

  const [
    formationLoaded,
    setFormationLoaded,
  ] =
    useState(
      false,
    );

  const [
    formationLoading,
    setFormationLoading,
  ] =
    useState(
      false,
    );

  const [
    formationSaving,
    setFormationSaving,
  ] =
    useState(
      false,
    );

  const [
    formationError,
    setFormationError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    formationSaved,
    setFormationSaved,
  ] =
    useState(
      false,
    );

  const loadFormation =
    useCallback(
      async (
        actionId:
          string,
      ) => {
        setFormationLoading(
          true,
        );

        setFormationError(
          null,
        );

        try {
          const response =
            await fetch(
              `/api/trust-club/formations/standard-trust?actionId=${encodeURIComponent(actionId)}`,
              {
                method:
                  'GET',

                credentials:
                  'same-origin',

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
            response.status ===
              404
          ) {
            window.localStorage.removeItem(
              ACTION_STORAGE_KEY,
            );

            setActiveActionId(
              null,
            );

            setActionStatus(
              null,
            );

            setFormationLoaded(
              false,
            );

            return;
          }

          if (
            !response.ok
          ) {
            setFormationError(
              `Formation could not be loaded. HTTP ${response.status}.`,
            );

            return;
          }

          const payload:
            unknown =
            await response.json();

          if (
            !isFormationReadyResponse(
              payload,
            )
          ) {
            setFormationError(
              'Formation returned an unexpected response.',
            );

            return;
          }

          setActiveActionId(
            payload.actionId,
          );

          setActionStatus(
            payload.actionStatus,
          );

          setFormationDraft(
            formationToDraft(
              payload.formation,
            ),
          );

          setFormationLoaded(
            true,
          );

          setFormationSaved(
            payload.formation !==
              null,
          );
        }
        catch {
          setFormationError(
            'Formation could not be loaded.',
          );
        }
        finally {
          setFormationLoading(
            false,
          );
        }
      },
      [
        router,
      ],
    );

  const loadStatus =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setLoadError(
          null,
        );

        try {
          const response =
            await fetch(
              '/api/trust-club/status',
              {
                method:
                  'GET',

                credentials:
                  'same-origin',

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
            setLoadError(
              'Trust Club status could not be loaded.',
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
            setLoadError(
              'Trust Club returned an unexpected status response.',
            );

            return;
          }

          setStatus(
            payload,
          );

          const storedActionId =
            window.localStorage.getItem(
              ACTION_STORAGE_KEY,
            );

          if (
            storedActionId !==
              null &&
            storedActionId.trim()
              .length >
              0
          ) {
            await loadFormation(
              storedActionId,
            );
          }
        }
        catch {
          setLoadError(
            'Trust Club status could not be loaded.',
          );
        }
        finally {
          setLoading(
            false,
          );
        }
      },
      [
        loadFormation,
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

  async function handleCreateTrust() {
    if (
      submitting ||
      !consentAccepted ||
      status ===
        null ||
      !status.access.canStartTrust
    ) {
      return;
    }

    setSubmitting(
      true,
    );

    setSubmitError(
      null,
    );

    try {
      const response =
        await fetch(
          '/api/trust-club/requests/standard-trust',
          {
            method:
              'POST',

            credentials:
              'same-origin',

            headers: {
              'Content-Type':
                'application/json',
            },

            cache:
              'no-store',

            body:
              JSON.stringify({
                consentAccepted:
                  true,
              }),
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

      const payload:
        unknown =
        await response.json();

      if (
        !response.ok
      ) {
        let reason =
          'Standard Trust Formation could not be started.';

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
            `Standard Trust Formation could not be started: ${payload.status}.`;
        }

        setSubmitError(
          reason,
        );

        return;
      }

      if (
        !isStandardTrustCreated(
          payload,
        )
      ) {
        setSubmitError(
          'Standard Trust Formation returned an unexpected response.',
        );

        return;
      }

      setCreated(
        payload,
      );

      setActiveActionId(
        payload.actionId,
      );

      setActionStatus(
        payload.actionStatus,
      );

      window.localStorage.setItem(
        ACTION_STORAGE_KEY,
        payload.actionId,
      );

      setFormationDraft({
        ...EMPTY_FORMATION_DRAFT,
      });

      setFormationLoaded(
        true,
      );

      setFormationSaved(
        false,
      );
    }
    catch {
      setSubmitError(
        'Standard Trust Formation could not be started.',
      );
    }
    finally {
      setSubmitting(
        false,
      );
    }
  }

  function updateFormationField(
    field:
      keyof FormationDraft,
    value:
      string,
  ) {
    setFormationDraft(
      (
        current,
      ) => ({
        ...current,
        [field]:
          value,
      }),
    );

    setFormationSaved(
      false,
    );
  }

  async function handleSaveFormation() {
    if (
      activeActionId ===
        null ||
      formationSaving ||
      actionStatus !==
        'DRAFT'
    ) {
      return;
    }

    setFormationSaving(
      true,
    );

    setFormationError(
      null,
    );

    setFormationSaved(
      false,
    );

    try {
      const response =
        await fetch(
          '/api/trust-club/formations/standard-trust',
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
            },

            body:
              JSON.stringify({
                actionId:
                  activeActionId,

                trustName:
                  formationDraft.trustName,

                trustPurpose:
                  formationDraft.trustPurpose,

                settlorName:
                  formationDraft.settlorName,

                trusteeName:
                  formationDraft.trusteeName,

                beneficiaryName:
                  formationDraft.beneficiaryName,

                protectorName:
                  formationDraft.protectorName,

                initialPropertyDescription:
                  formationDraft.initialPropertyDescription,
              }),
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

      const payload:
        unknown =
        await response.json();

      if (
        !response.ok
      ) {
        let reason =
          `Formation could not be saved. HTTP ${response.status}.`;

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
            `Formation could not be saved: ${payload.status}.`;
        }

        setFormationError(
          reason,
        );

        return;
      }

      if (
        !isFormationSavedResponse(
          payload,
        )
      ) {
        setFormationError(
          'Formation save returned an unexpected response.',
        );

        return;
      }

      setActionStatus(
        payload.actionStatus,
      );

      setFormationDraft(
        formationToDraft(
          payload.formation,
        ),
      );

      setFormationSaved(
        true,
      );
    }
    catch {
      setFormationError(
        'Formation could not be saved.',
      );
    }
    finally {
      setFormationSaving(
        false,
      );
    }
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
            Standard Trust Formation
          </h1>

          <p className="trustClubDashboardLead">
            Verifying your authenticated Trust Club access.
          </p>
        </section>
      </main>
    );
  }

  if (
    loadError !==
      null
  ) {
    return (
      <main className="trustClubDashboardPage">
        <section className="trustClubDashboardShell">
          <p className="trustClubEyebrow">
            GENESIS TRUST CLUB
          </p>

          <h1>
            Standard Trust Formation
          </h1>

          <div className="trustClubError">
            {loadError}
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

  if (
    !status.access.canStartTrust
  ) {
    return (
      <main className="trustClubDashboardPage">
        <section className="trustClubDashboardShell">
          <p className="trustClubEyebrow">
            GENESIS TRUST CLUB
          </p>

          <h1>
            Standard Trust Formation
          </h1>

          <section className="trustClubAccessCard">
            <span className="trustClubAccessState trustClubAccessState-RESTRICTED">
              ACCESS NOT AVAILABLE
            </span>

            <h2>
              Trust Formation Unavailable
            </h2>

            <p>
              Your current Trust Club status does not permit
              Standard Trust Formation.
            </p>
          </section>

          <Link
            href="/trust-club/dashboard"
            className="trustClubButton"
          >
            Return to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  if (
    activeActionId !==
      null
  ) {
    return (
      <main className="trustClubDashboardPage">
        <section className="trustClubDashboardShell">
          <header className="trustClubDashboardHeader">
            <div>
              <p className="trustClubEyebrow">
                GENESIS TRUST CLUB
              </p>

              <h1>
                Standard Trust Formation
              </h1>

              <p className="trustClubDashboardLead">
                {
                  actionStatus ===
                    'DRAFT'
                    ? 'Complete and save the formation information associated with your existing Standard Trust action.'
                    : actionStatus ===
                        'COMPLETE'
                      ? 'Review the completed Standard Trust formation record associated with your certified formation lifecycle.'
                      : 'Review the Standard Trust formation information associated with the current controlled lifecycle state.'
                }
              </p>
            </div>

            <Link
              href="/trust-club/dashboard"
              className="trustClubDashboardSignOut"
            >
              Dashboard
            </Link>
          </header>

          <section className="trustClubAccessCard">
            <span className="trustClubAccessState trustClubAccessState-ACTIVE">
              {
                actionStatus ===
                  'DRAFT'
                  ? 'FORMATION DRAFT'
                  : actionStatus ===
                      'READY'
                    ? 'READY FOR REVIEW'
                    : actionStatus ===
                        'IN_PROGRESS'
                      ? 'FORMATION IN PROGRESS'
                      : actionStatus ===
                          'INTERNAL_COMPLETE'
                        ? 'INTERNAL FORMATION COMPLETE'
                        : actionStatus ===
                            'EXTERNAL_PENDING'
                          ? 'EXTERNAL COMPLETION PENDING'
                          : actionStatus ===
                              'COMPLETE'
                            ? 'FORMATION COMPLETE'
                            : 'FORMATION STATUS UNKNOWN'
              }
            </span>

            <h2>
              Existing Formation Action
            </h2>

            <p>
              {
                actionStatus ===
                  'DRAFT'
                  ? 'Your Standard Trust formation remains in draft. You may continue editing and saving the formation information.'
                  : actionStatus ===
                      'READY'
                    ? 'Your Standard Trust formation is ready for the next controlled lifecycle step. Formation information is now read-only.'
                    : actionStatus ===
                        'IN_PROGRESS'
                      ? 'Your Standard Trust formation is currently progressing through the controlled formation lifecycle.'
                      : actionStatus ===
                          'INTERNAL_COMPLETE'
                        ? 'Internal formation processing is complete. The action remains subject to the next controlled lifecycle step.'
                        : actionStatus ===
                            'EXTERNAL_PENDING'
                          ? 'Internal formation is complete and the action is awaiting verified external completion.'
                          : actionStatus ===
                              'COMPLETE'
                            ? 'Your Standard Trust formation has completed the certified formation lifecycle.'
                            : 'The current Standard Trust formation lifecycle status could not be projected.'
              }
            </p>
          </section>

          <section className="trustClubDashboardGrid">
            <article className="trustClubDashboardCard">
              <span>
                Action
              </span>

              <strong>
                CREATE STANDARD TRUST
              </strong>

              <small>
                Formation owner
              </small>
            </article>

            <article className="trustClubDashboardCard">
              <span>
                Status
              </span>

              <strong>
                {actionStatus ?? 'UNKNOWN'}
              </strong>

              <small>
                Current action lifecycle
              </small>
            </article>

            <article className="trustClubDashboardCard">
              <span>
                Action ID
              </span>

              <strong>
                {activeActionId}
              </strong>

              <small>
                Controlled formation reference
              </small>
            </article>

            <article className="trustClubDashboardCard">
              <span>
                Save State
              </span>

              <strong>
                {
                  formationSaved
                    ? 'SAVED'
                    : 'UNSAVED'
                }
              </strong>

              <small>
                Formation persistence state
              </small>
            </article>
          </section>

          {
            formationLoading
              ? (
                  <section className="trustClubDashboardActions">
                    <div>
                      <p className="trustClubEyebrow">
                        FORMATION
                      </p>

                      <h2>
                        Loading Formation
                      </h2>

                      <p>
                        Retrieving the existing formation record.
                      </p>
                    </div>
                  </section>
                )
              : (
                  <>
                    <section className="trustClubDashboardActions">
                      <div
                        style={{
                          width:
                            '100%',
                        }}
                      >
                        <p className="trustClubEyebrow">
                          FORMATION INFORMATION
                        </p>

                        <h2>
                          Standard Trust Intake
                        </h2>

                        <p>
                          {
                            actionStatus ===
                              'DRAFT'
                              ? 'Enter the current formation information. You can save and return later while the Action remains in DRAFT.'
                              : actionStatus ===
                                  'COMPLETE'
                                ? 'This completed Standard Trust formation record is read-only and reflects the formation information preserved through the certified lifecycle.'
                                : 'The Standard Trust formation information is read-only while the Action is outside DRAFT.'
                          }
                        </p>

                        <div
                          style={{
                            display:
                              'grid',

                            gap:
                              '18px',

                            marginTop:
                              '26px',
                          }}
                        >
                          <label>
                            <span>
                              Trust Name
                            </span>

                            <input
                              type="text"
                              value={
                                formationDraft.trustName
                              }
                              disabled={
                                formationSaving ||
                                actionStatus !==
                                  'DRAFT'
                              }
                              onChange={
                                (
                                  event,
                                ) =>
                                  updateFormationField(
                                    'trustName',
                                    event.target.value,
                                  )
                              }
                              style={{
                                width:
                                  '100%',

                                marginTop:
                                  '8px',

                                padding:
                                  '14px',

                                borderRadius:
                                  '10px',

                                border:
                                  '1px solid rgba(255,255,255,0.18)',

                                background:
                                  'rgba(0,0,0,0.28)',

                                color:
                                  'inherit',
                              }}
                            />
                          </label>

                          <label>
                            <span>
                              Trust Purpose
                            </span>

                            <textarea
                              value={
                                formationDraft.trustPurpose
                              }
                              disabled={
                                formationSaving ||
                                actionStatus !==
                                  'DRAFT'
                              }
                              onChange={
                                (
                                  event,
                                ) =>
                                  updateFormationField(
                                    'trustPurpose',
                                    event.target.value,
                                  )
                              }
                              rows={
                                4
                              }
                              style={{
                                width:
                                  '100%',

                                marginTop:
                                  '8px',

                                padding:
                                  '14px',

                                borderRadius:
                                  '10px',

                                border:
                                  '1px solid rgba(255,255,255,0.18)',

                                background:
                                  'rgba(0,0,0,0.28)',

                                color:
                                  'inherit',

                                resize:
                                  'vertical',
                              }}
                            />
                          </label>

                          <label>
                            <span>
                              Settlor Name
                            </span>

                            <input
                              type="text"
                              value={
                                formationDraft.settlorName
                              }
                              disabled={
                                formationSaving ||
                                actionStatus !==
                                  'DRAFT'
                              }
                              onChange={
                                (
                                  event,
                                ) =>
                                  updateFormationField(
                                    'settlorName',
                                    event.target.value,
                                  )
                              }
                              style={{
                                width:
                                  '100%',

                                marginTop:
                                  '8px',

                                padding:
                                  '14px',

                                borderRadius:
                                  '10px',

                                border:
                                  '1px solid rgba(255,255,255,0.18)',

                                background:
                                  'rgba(0,0,0,0.28)',

                                color:
                                  'inherit',
                              }}
                            />
                          </label>

                          <label>
                            <span>
                              Trustee Name
                            </span>

                            <input
                              type="text"
                              value={
                                formationDraft.trusteeName
                              }
                              disabled={
                                formationSaving ||
                                actionStatus !==
                                  'DRAFT'
                              }
                              onChange={
                                (
                                  event,
                                ) =>
                                  updateFormationField(
                                    'trusteeName',
                                    event.target.value,
                                  )
                              }
                              style={{
                                width:
                                  '100%',

                                marginTop:
                                  '8px',

                                padding:
                                  '14px',

                                borderRadius:
                                  '10px',

                                border:
                                  '1px solid rgba(255,255,255,0.18)',

                                background:
                                  'rgba(0,0,0,0.28)',

                                color:
                                  'inherit',
                              }}
                            />
                          </label>

                          <label>
                            <span>
                              Beneficiary Name
                            </span>

                            <input
                              type="text"
                              value={
                                formationDraft.beneficiaryName
                              }
                              disabled={
                                formationSaving ||
                                actionStatus !==
                                  'DRAFT'
                              }
                              onChange={
                                (
                                  event,
                                ) =>
                                  updateFormationField(
                                    'beneficiaryName',
                                    event.target.value,
                                  )
                              }
                              style={{
                                width:
                                  '100%',

                                marginTop:
                                  '8px',

                                padding:
                                  '14px',

                                borderRadius:
                                  '10px',

                                border:
                                  '1px solid rgba(255,255,255,0.18)',

                                background:
                                  'rgba(0,0,0,0.28)',

                                color:
                                  'inherit',
                              }}
                            />
                          </label>

                          <label>
                            <span>
                              Protector Name
                            </span>

                            <input
                              type="text"
                              value={
                                formationDraft.protectorName
                              }
                              disabled={
                                formationSaving ||
                                actionStatus !==
                                  'DRAFT'
                              }
                              onChange={
                                (
                                  event,
                                ) =>
                                  updateFormationField(
                                    'protectorName',
                                    event.target.value,
                                  )
                              }
                              style={{
                                width:
                                  '100%',

                                marginTop:
                                  '8px',

                                padding:
                                  '14px',

                                borderRadius:
                                  '10px',

                                border:
                                  '1px solid rgba(255,255,255,0.18)',

                                background:
                                  'rgba(0,0,0,0.28)',

                                color:
                                  'inherit',
                              }}
                            />
                          </label>

                          <label>
                            <span>
                              Initial Property Description
                            </span>

                            <textarea
                              value={
                                formationDraft.initialPropertyDescription
                              }
                              disabled={
                                formationSaving ||
                                actionStatus !==
                                  'DRAFT'
                              }
                              onChange={
                                (
                                  event,
                                ) =>
                                  updateFormationField(
                                    'initialPropertyDescription',
                                    event.target.value,
                                  )
                              }
                              rows={
                                4
                              }
                              style={{
                                width:
                                  '100%',

                                marginTop:
                                  '8px',

                                padding:
                                  '14px',

                                borderRadius:
                                  '10px',

                                border:
                                  '1px solid rgba(255,255,255,0.18)',

                                background:
                                  'rgba(0,0,0,0.28)',

                                color:
                                  'inherit',

                                resize:
                                  'vertical',
                              }}
                            />
                          </label>
                        </div>

                        {
                          formationError !==
                            null &&
                          (
                            <div className="trustClubError">
                              {formationError}
                            </div>
                          )
                        }

                        {
                          formationSaved &&
                          formationError ===
                            null &&
                          (
                            <div
                              className="trustClubAccessState trustClubAccessState-ACTIVE"
                              style={{
                                display:
                                  'inline-block',

                                marginTop:
                                  '20px',
                              }}
                            >
                              FORMATION SAVED
                            </div>
                          )
                        }
                      </div>

                      {
                        actionStatus ===
                          'DRAFT'
                          ? (
                              <button
                                type="button"
                                className="trustClubButton"
                                disabled={
                                  formationSaving
                                }
                                onClick={
                                  () =>
                                    void handleSaveFormation()
                                }
                              >
                                {
                                  formationSaving
                                    ? 'Saving...'
                                    : 'Save Formation'
                                }
                              </button>
                            )
                          : (
                              <span className="trustClubAccessState trustClubAccessState-ACTIVE">
                                READ ONLY
                              </span>
                            )
                      }
                    </section>

                    <section className="trustClubDashboardActions">
                      <div>
                        <p className="trustClubEyebrow">
                          {
                            actionStatus ===
                              'DRAFT'
                              ? 'RESUME'
                              : 'FORMATION RECORD'
                          }
                        </p>

                        <h2>
                          {
                            actionStatus ===
                              'DRAFT'
                              ? 'Continue Later'
                              : actionStatus ===
                                  'COMPLETE'
                                ? 'Completed Formation Record'
                                : 'Current Formation Record'
                          }
                        </h2>

                        <p>
                          {
                            actionStatus ===
                              'DRAFT'
                              ? 'This Action remains in DRAFT. Reloading this page will resume the Formation through the authenticated Formation API.'
                              : actionStatus ===
                                  'COMPLETE'
                                ? 'This Action is COMPLETE. The formation record is read-only. Reloading this page will refresh the preserved record through the authenticated Formation API.'
                                : 'This Action is outside DRAFT. The formation record is read-only. Reloading this page will refresh the current record through the authenticated Formation API.'
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        className="trustClubButton"
                        disabled={
                          formationLoading
                        }
                        onClick={
                          () =>
                            void loadFormation(
                              activeActionId,
                            )
                        }
                      >
                        Reload Formation
                      </button>
                    </section>
                  </>
                )
          }

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

  return (
    <main className="trustClubDashboardPage">
      <section className="trustClubDashboardShell">
        <header className="trustClubDashboardHeader">
          <div>
            <p className="trustClubEyebrow">
              GENESIS TRUST CLUB
            </p>

            <h1>
              Standard Trust Formation
            </h1>

            <p className="trustClubDashboardLead">
              Begin your controlled Standard Trust Formation request.
            </p>
          </div>

          <Link
            href="/trust-club/dashboard"
            className="trustClubDashboardSignOut"
          >
            Dashboard
          </Link>
        </header>

        <section className="trustClubAccessCard">
          <span className="trustClubAccessState trustClubAccessState-ACTIVE">
            ELIGIBLE TO PROCEED
          </span>

          <h2>
            Formation Request
          </h2>

          <p>
            Your Eligibility, Membership and subscription state
            currently permit access to Standard Trust Formation.
          </p>
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
              {status.membership?.status ?? 'NOT ESTABLISHED'}
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
              {status.membership?.subscriptionStatus ?? 'NOT ESTABLISHED'}
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
              {status.membership?.planCode ?? 'STANDARD MEMBERSHIP'}
            </strong>

            <small>
              Current Trust Club plan
            </small>
          </article>
        </section>

        <section className="trustClubDashboardActions">
          <div>
            <p className="trustClubEyebrow">
              FORMATION CONSENT
            </p>

            <h2>
              Start Standard Trust Formation
            </h2>

            <p>
              By proceeding, you confirm that you intentionally
              request creation of a Standard Trust Formation action
              under your authenticated Trust Club Membership.
            </p>

            <label
              style={{
                display:
                  'flex',

                alignItems:
                  'flex-start',

                gap:
                  '12px',

                marginTop:
                  '20px',

                maxWidth:
                  '720px',

                color:
                  '#c8d5e2',

                lineHeight:
                  1.6,
              }}
            >
              <input
                type="checkbox"
                checked={
                  consentAccepted
                }
                disabled={
                  submitting
                }
                onChange={
                  (
                    event,
                  ) =>
                    setConsentAccepted(
                      event.target.checked,
                    )
                }
                style={{
                  marginTop:
                    '5px',
                }}
              />

              <span>
                I confirm that I wish to begin Standard Trust
                Formation and consent to creation of the
                corresponding Trust Club action record.
              </span>
            </label>

            {
              submitError !==
                null &&
              (
                <div className="trustClubError">
                  {submitError}
                </div>
              )
            }
          </div>

          <button
            type="button"
            className="trustClubButton"
            disabled={
              !consentAccepted ||
              submitting
            }
            onClick={
              () =>
                void handleCreateTrust()
            }
            style={
              !consentAccepted ||
              submitting
                ? {
                    opacity:
                      0.38,

                    cursor:
                      'not-allowed',
                  }
                : undefined
            }
          >
            {
              submitting
                ? 'Starting...'
                : 'Begin Formation'
            }
          </button>
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
