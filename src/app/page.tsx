import Dictionary from "../components/Dictionary";

const susdcIssuer =
  "GCNVCJFLW6WSZOKPQPDBWKAOLEZVTGMSLKRL66RWIONM4BVJVCXAJDIU";

const metrics = [
  ["Network Status", "Operational"],
  ["Tokenized Assets", "Active"],
  ["Treasury Coverage", "Live"],
  ["Liquidity Engine", "Preparing"],
  ["AFIP Network", "Operational"],
  ["Developer API", "Coming Soon"],
];

export default function Home() {
  return (
    <main className="site">
      <nav className="nav">
        <strong>Genesis Capital Network</strong>
        <div>
          <a href="#network">Network</a>
          <a href="#liquidity">Liquidity</a>
          <a href="#tokenization">Tokenization</a>
          <a href="#afip">AFIP</a>
          <a href="#developers">Developers</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">LIVE CAPITAL INFRASTRUCTURE</p>
        <h1>Genesis Capital Network</h1>
        <h2>
          Infrastructure for Tokenized Assets, Institutional Liquidity and Open
          Settlement.
        </h2>
        <p>
          Genesis Capital Network connects real-world assets, treasury-backed
          digital settlement, AFIP onboarding, liquidity infrastructure and open
          financial networks.
        </p>

        <div className="buttons">
          <a href="#network">View Network</a>
          <a href="#developers">Developers</a>
          <a href="/.well-known/stellar.toml">stellar.toml</a>
        </div>
      </section>

      <section className="section dark" id="network">
        <p className="eyebrow">LIVE NETWORK</p>
        <h2>Capital Network Dashboard</h2>
        <p>
          Public indicators for the Genesis ecosystem. Live API connectivity will
          be added progressively as Atlantis services are opened to partners.
        </p>

        <div className="metricGrid">
          {metrics.map(([label, value]) => (
            <article key={label} className="metricCard">
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="liquidity">
        <p className="eyebrow">LIQUIDITY CENTER</p>
        <h2>Liquidity Operating System</h2>
        <p>
          Atlantis is building liquidity infrastructure for treasury-backed
          digital assets, settlement flows, AMM operations, proof reporting and
          institutional integrations.
        </p>

        <div className="infoBox">
          <span>Primary Settlement Asset</span>
          <strong>SUSDC</strong>
        </div>

        <div className="infoBox">
          <span>Issuer</span>
          <strong>{susdcIssuer}</strong>
        </div>

        <div className="infoBox">
          <span>Public Network</span>
          <strong>Stellar Public Network</strong>
        </div>
      </section>

      <section className="section dark" id="tokenization">
        <p className="eyebrow">TOKENIZATION</p>
        <h2>Real-World Asset Infrastructure</h2>
        <p>
          Genesis is designed to support tokenized assets, treasury assets,
          receivables, judgments, institutional notes and other approved
          asset-backed settlement structures.
        </p>
      </section>

      <section className="section" id="afip">
        <p className="eyebrow">AFIP</p>
        <h2>Asset Financial Interaction Protocol</h2>
        <p>
          AFIP enables participant onboarding, claim-based delivery, direct
          payments, evidence generation and structured settlement conversations.
        </p>

        <div className="flow">
          <div>Asset</div>
          <span>→</span>
          <div>AFIP</div>
          <span>→</span>
          <div>Treasury</div>
          <span>→</span>
          <div>Settlement</div>
        </div>
      </section>

      <section className="section dark" id="developers">
        <p className="eyebrow">DEVELOPERS</p>
        <h2>Connect to Genesis</h2>
        <p>
          Developer APIs, OpenAPI specifications, sandbox tools, AFIP
          integration guides and liquidity endpoints will be released as the
          public network matures.
        </p>
      </section>

      <Dictionary />

      <section className="section" id="contact">
        <p className="eyebrow">INSTITUTIONS</p>
        <h2>Become a Network Partner</h2>
        <p>
          Anchors, institutions, developers, merchants and treasury partners may
          contact Genesis to explore integration with Atlantis settlement
          infrastructure.
        </p>
        <strong className="email">atlantisbank@walla.co.il</strong>
      </section>

      <footer>
        © 2026 Genesis Heritage Trust. All Rights Reserved.
        <br />
        Genesis Capital Network · Version 2.0 Alpha
        <br />
        Powered by Atlantis Bank Digital Infrastructure.
      </footer>
    </main>
  );
}