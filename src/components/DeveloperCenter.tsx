export default function DeveloperCenter() {
  return (
    <section className="section dark" id="developers">
      <div>
        <p className="eyebrow">DEVELOPERS</p>

        <h2>Build on Genesis</h2>

        <p>
          Genesis will expose APIs, SDKs, examples, AFIP integration guides,
          OpenAPI specifications and sandbox tools for developers and partners.
        </p>

        <div className="cardGrid">
          <article className="panel">
            <h3>Public APIs</h3>
            <p>Status, assets, liquidity, treasury, AFIP and settlement endpoints.</p>
          </article>

          <article className="panel">
            <h3>AFIP Integration</h3>
            <p>Connect participant onboarding, claims and settlement conversations.</p>
          </article>

          <article className="panel">
            <h3>Sandbox</h3>
            <p>Developer testing tools and examples will be released progressively.</p>
          </article>
        </div>
      </div>
    </section>
  );
}