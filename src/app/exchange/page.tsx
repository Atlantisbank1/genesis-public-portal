import Link from "next/link";
import AppNavigation from "../../components/AppNavigation";

export default function ExchangePage() {
  return (
    <main className="site">
      <AppNavigation />

      <section className="hero">
        <p className="eyebrow">GENESIS EXCHANGE</p>
        <h1>Digital Asset Exchange</h1>
        <h2>Swap, route and discover supported Genesis assets.</h2>
        <p>
          Genesis Exchange will connect SUSDC, RYEK, XLM, USDC and future assets
          through liquidity routes powered by Genesis OS.
        </p>

        <div className="buttons">
          <Link href="/wallet">Open Wallet</Link>
          <Link href="/vault" className="secondary">Capital Vault</Link>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">MARKETS</p>
        <h2>Supported Assets</h2>

        <div className="cardGrid">
          <article className="panel">
            <h3>SUSDC</h3>
            <p>Primary Genesis settlement asset.</p>
          </article>

          <article className="panel">
            <h3>RYEK</h3>
            <p>Royal digital asset.</p>
          </article>

          <article className="panel">
            <h3>USDC</h3>
            <p>External Stellar settlement asset.</p>
          </article>
        </div>
      </section>
    </main>
  );
}