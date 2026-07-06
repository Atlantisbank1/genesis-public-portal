import Link from "next/link";
import AppNavigation from "../../components/AppNavigation";

export default function VaultPage() {
  return (
    <main className="site">
      <AppNavigation />

      <section className="hero">
        <p className="eyebrow">CAPITAL VAULT</p>
        <h1>Put Your Assets to Work</h1>
        <h2>Allocate digital assets to liquidity infrastructure.</h2>
        <p>
          Capital Vault allows participants to allocate supported assets into
          Genesis liquidity programs while tracking balances, earnings and
          allocation status.
        </p>

        <div className="buttons">
          <Link href="/wallet">Open Wallet</Link>
          <Link href="/exchange" className="secondary">Open Exchange</Link>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">PORTFOLIO</p>
        <h2>Current Allocation</h2>

        <div className="metricGrid">
          <article className="metricCard">
            <span>Total Deposited</span>
            <strong>Coming Online</strong>
          </article>

          <article className="metricCard">
            <span>Current Earnings</span>
            <strong>Coming Online</strong>
          </article>

          <article className="metricCard">
            <span>Estimated Yield</span>
            <strong>Preparing</strong>
          </article>

          <article className="metricCard">
            <span>Vault Status</span>
            <strong>Initializing</strong>
          </article>
        </div>
      </section>
    </main>
  );
}