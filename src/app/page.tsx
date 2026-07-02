import Dictionary from "../components/Dictionary";

const susdcIssuer =
  "GCNVCJFLW6WSZOKPQPDBWKAOLEZVTGMSLKRL66RWIONM4BVJVCXAJDIU";

export default function Home() {
  return (
    <main className="site">
      <nav className="nav">
        <strong>Genesis Heritage Trust</strong>
        <div>
          <a href="#assets">Assets</a>
          <a href="#afip">AFIP</a>
          <a href="#merchants">Merchants</a>
          <a href="#dictionary">Dictionary</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">TRUST FIRST • TRANSPARENCY ALWAYS</p>
        <h1>Where Trust Meets Technology</h1>
        <h2>Genesis Heritage Trust · Atlantis Bank · AFIP</h2>
        <p>
          A public portal for trusted digital assets, participant onboarding,
          Stellar settlement, merchant payments, and simple financial language
          for everyone.
        </p>

        <div className="buttons">
          <a href="#afip">Learn AFIP</a>
          <a href="/.well-known/stellar.toml">stellar.toml</a>
          <a
            href={`https://stellar.expert/explorer/public/asset/SUSDC-${susdcIssuer}`}
            target="_blank"
          >
            View SUSDC
          </a>
        </div>
      </section>

      <section className="section" id="assets">
        <p className="eyebrow">DIGITAL ASSETS</p>
        <h2>SUSDC</h2>
        <p>
          SUSDC is a Stellar-based digital settlement asset used within the
          Atlantis ecosystem for payments, onboarding, treasury operations and
          merchant settlement.
        </p>

        <div className="infoBox">
          <span>Asset Code</span>
          <strong>SUSDC</strong>
        </div>

        <div className="infoBox">
          <span>Issuer</span>
          <strong>{susdcIssuer}</strong>
        </div>

        <div className="infoBox">
          <span>Status</span>
          <strong>Live on Stellar Public Network</strong>
        </div>
      </section>

      <section className="section dark" id="afip">
        <p className="eyebrow">AFIP</p>
        <h2>Asset Financial Interaction Protocol</h2>
        <p>
          AFIP helps people receive digital assets safely, even when their wallet
          is not ready yet.
        </p>

        <div className="flow">
          <div>Invitation</div>
          <span>→</span>
          <div>Trustline</div>
          <span>→</span>
          <div>Claim</div>
          <span>→</span>
          <div>Participant</div>
        </div>

        <p>
          Instead of failing, AFIP prepares the delivery, keeps evidence, and
          allows the participant to complete onboarding in a simple way.
        </p>
      </section>

      <section className="section" id="merchants">
        <p className="eyebrow">MERCHANTS</p>
        <h2>Can I accept SUSDC as payment?</h2>
        <p>
          Yes. Businesses, freelancers and service providers may receive SUSDC
          as payment, hold it, transfer it, or exchange it through available
          Stellar market liquidity.
        </p>
      </section>

      <Dictionary />

      <section className="section" id="contact">
        <p className="eyebrow">JOIN THE NETWORK</p>
        <h2>Become an AFIP Partner</h2>
        <p>
          Interested in accepting SUSDC, joining AFIP, or integrating with
          Atlantis digital settlement infrastructure?
        </p>
        <strong className="email">atlantisbank@walla.co.il</strong>
      </section>

      <footer>
        © 2026 Genesis Heritage Trust. All Rights Reserved.
        <br />
        Powered by Atlantis Bank Digital Infrastructure.
      </footer>
    </main>
  );
}