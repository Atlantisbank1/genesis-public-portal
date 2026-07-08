import { GenesisAssets } from "../../config/assets";
import { GenesisConfig } from "../../config/genesis";
import { GenesisNetwork } from "../../config/network";
import GenesisCommandCenter from "./GenesisCommandCenter";
import GenesisSystemStatus from "./GenesisSystemStatus";

export default function GenesisWorkspace() {
  const primaryAsset = GenesisAssets.SUSDC;

  return (
    <section className="workspace" id="workspace">
      <aside className="workspaceSidebar">
        <div className="workspaceBrand">
          <img src={primaryAsset.logo} alt={primaryAsset.code} />
          <strong>{GenesisConfig.systemName}</strong>
        </div>

        <nav className="workspaceMenu">
          <a href="#system-status">System Status</a>
          <a href="#command-center">Command Center</a>
          <a href="/wallet">Wallet</a>
          <a href="/vault">Capital Vault</a>
          <a href="/exchange">Exchange</a>
        </nav>
      </aside>

      <div className="workspaceMain">
        <header className="workspaceHeader">
          <div>
            <p className="eyebrow">GENESIS OS</p>
            <h2>{GenesisConfig.commandCenter}</h2>
          </div>

          <span className="statusPill">Operational</span>
        </header>

        <div className="workspaceGrid">
          <article className="panel">
            <h3>Primary Asset</h3>
            <p>{primaryAsset.name}</p>
            <strong>{primaryAsset.code}</strong>
          </article>

          <article className="panel">
            <h3>Issuer</h3>
            <p className="mono">{primaryAsset.issuer}</p>
          </article>

          <article className="panel">
            <h3>Network</h3>
            <p>{GenesisNetwork.stellar.name}</p>
            <strong>{GenesisNetwork.domains.primary}</strong>
          </article>

          <article className="panel">
            <h3>Version</h3>
            <p>{GenesisConfig.version}</p>
          </article>
        </div>

        <GenesisSystemStatus />
        <GenesisCommandCenter />
      </div>
    </section>
  );
}