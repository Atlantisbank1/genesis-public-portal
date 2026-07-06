import Link from "next/link";
import { networkStatus } from "../../lib/network";

const modules = [
  ["Dashboard", "/"],
  ["Wallet", "/wallet"],
  ["Capital Vault", "/vault"],
  ["Exchange", "/exchange"],
  ["Explorer", "/explorer"],
  ["Marketplace", "/marketplace"],
  ["AFIP", "/afip"],
  ["Developers", "/developers"],
];

export default function GenesisWorkspace() {
  return (
    <section className="workspace">
      <aside className="workspaceSidebar">
        <div className="workspaceBrand">
          <img src="/SUSDC.PNG" alt="SUSDC" />
          <strong>Genesis OS</strong>
        </div>

        <nav className="workspaceMenu">
          {modules.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="workspaceMain">
        <header className="workspaceHeader">
          <div>
            <p className="eyebrow">WORKSPACE</p>
            <h2>Genesis Command Center</h2>
          </div>

          <span className="statusPill">{networkStatus.status}</span>
        </header>

        <div className="workspaceGrid">
          <article className="panel">
            <h3>Network</h3>
            <p>{networkStatus.name}</p>
            <strong>{networkStatus.homeDomain}</strong>
          </article>

          <article className="panel">
            <h3>Primary Asset</h3>
            <p>{networkStatus.asset}</p>
            <strong>Stellar Public Network</strong>
          </article>

          <article className="panel">
            <h3>Issuer</h3>
            <p className="mono">{networkStatus.issuer}</p>
          </article>

          <article className="panel">
            <h3>Version</h3>
            <p>{networkStatus.version}</p>
          </article>
        </div>
      </div>
    </section>
  );
}