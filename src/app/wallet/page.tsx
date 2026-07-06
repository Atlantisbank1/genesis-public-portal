import Link from "next/link";
import AppNavigation from "../../components/AppNavigation";

export default function WalletPage() {
  return (
    <main className="site">
      <AppNavigation />

      <section className="hero">
        <p className="eyebrow">GENESIS WALLET</p>

        <h1>Your Capital Command Center</h1>

        <h2>
          Manage assets, payments, AFIP claims, swaps and liquidity access.
        </h2>

        <p>
          Genesis Wallet is the user-facing wallet layer of the Genesis Capital
          Network, connected to Atlantis Bank infrastructure.
        </p>

        <div className="buttons">
          <Link href="/exchange">Open Exchange</Link>

          <Link href="/vault">Capital Vault</Link>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">WALLET OVERVIEW</p>

        <h2>Assets</h2>

        <div className="metricGrid">
          <article className="metricCard">
            <span>SUSDC</span>
            <strong>Coming Online</strong>
          </article>

          <article className="metricCard">
            <span>RYEK</span>
            <strong>Coming Online</strong>
          </article>

          <article className="metricCard">
            <span>XLM</span>
            <strong>Coming Online</strong>
          </article>

          <article className="metricCard">
            <span>USDC</span>
            <strong>Coming Online</strong>
          </article>
        </div>
      </section>

      <section className="section dark">
        <p className="eyebrow">ACTIONS</p>

        <h2>Wallet Actions</h2>

        <div className="cardGrid">
          <article className="panel">
            <h3>Receive</h3>

            <p>
              Receive assets using wallet address, QR code or AFIP invitation.
            </p>
          </article>

          <article className="panel">
            <h3>Send</h3>

            <p>
              Transfer supported assets through Atlantis settlement
              infrastructure.
            </p>
          </article>

          <article className="panel">
            <h3>Swap</h3>

            <p>
              Exchange supported assets through Genesis Exchange liquidity.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}