import Link from 'next/link';

export default function TrustClubPage() {
  return (
    <main className="trustClubSite">
      <section className="trustClubHero">
        <div className="trustClubHeroInner">
          <p className="trustClubEyebrow">
            GENESIS HERITAGE TRUST
          </p>

          <h1>
            Trust Club
          </h1>

          <h2>
            Private trust formation and administration through a controlled Genesis service environment.
          </h2>

          <p className="trustClubLead">
            Create your account, complete eligibility review,
            enter Membership, and begin a standard trust
            formation request through the Genesis Trust Club.
          </p>

          <div className="trustClubActions">
            <Link
              href="/trust-club/register"
              className="trustClubButton"
            >
              Create Account
            </Link>

            <Link
              href="/trust-club/login"
              className="trustClubButton trustClubButtonSecondary"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="trustClubSection">
        <p className="trustClubEyebrow">
          SERVICE FLOW
        </p>

        <h2>
          From Registration to Trust Formation
        </h2>

        <div className="trustClubFlowGrid">
          <article className="trustClubPanel">
            <span className="trustClubStep">
              01
            </span>

            <h3>
              Register
            </h3>

            <p>
              Create a secure Genesis Trust Club identity using
              email and password authentication.
            </p>
          </article>

          <article className="trustClubPanel">
            <span className="trustClubStep">
              02
            </span>

            <h3>
              Eligibility Review
            </h3>

            <p>
              New applicants enter a controlled review stage
              before Membership access is permitted.
            </p>
          </article>

          <article className="trustClubPanel">
            <span className="trustClubStep">
              03
            </span>

            <h3>
              Membership
            </h3>

            <p>
              Eligible applicants proceed into the Trust Club
              Membership lifecycle.
            </p>
          </article>

          <article className="trustClubPanel">
            <span className="trustClubStep">
              04
            </span>

            <h3>
              Form a Trust
            </h3>

            <p>
              Active Members may submit a Standard Trust
              Formation request through the certified service
              workflow.
            </p>
          </article>
        </div>
      </section>

      <section className="trustClubSection trustClubSectionMuted">
        <p className="trustClubEyebrow">
          CONTROLLED ACCESS
        </p>

        <h2>
          Security Before Service Activation
        </h2>

        <p className="trustClubSectionText">
          Registration does not automatically activate Trust Club
          services. Eligibility, Membership status, subscription
          status, entitlements and service authorization remain
          independently controlled.
        </p>
      </section>
    </main>
  );
}