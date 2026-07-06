export default function InstitutionCenter() {
  return (
    <section className="section" id="institutions">
      <p className="eyebrow">INSTITUTIONS</p>

      <h2>Join the Genesis Capital Network</h2>

      <p>
        Genesis is designed for anchors, merchants, developers, treasury
        partners, liquidity providers and institutions that want to connect to
        tokenized settlement infrastructure.
      </p>

      <div className="cardGrid">
        <article className="panel">
          <h3>Anchors</h3>
          <p>Connect settlement, liquidity and asset infrastructure.</p>
        </article>

        <article className="panel">
          <h3>Merchants</h3>
          <p>Accept SUSDC and participate in Genesis payment flows.</p>
        </article>

        <article className="panel">
          <h3>Liquidity Partners</h3>
          <p>Explore future treasury, AMM and settlement pool participation.</p>
        </article>
      </div>
    </section>
  );
}