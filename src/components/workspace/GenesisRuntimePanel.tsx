import { Runtime } from "../../kernel/GenesisRuntime";

export default function GenesisRuntimePanel() {
  const runtime = Runtime.getState();

  return (
    <section className="section">
      <p className="eyebrow">GENESIS RUNTIME</p>

      <h2>Operating State</h2>

      <div className="metricGrid">
        <article className="metricCard">
          <span>Genesis OS</span>
          <strong>{runtime.online ? "Running" : "Stopped"}</strong>
        </article>

        <article className="metricCard">
          <span>Network</span>
          <strong>{runtime.currentNetwork}</strong>
        </article>

        <article className="metricCard">
          <span>API</span>
          <strong>{runtime.apiConnected ? "Connected" : "Disconnected"}</strong>
        </article>

        <article className="metricCard">
          <span>Active Module</span>
          <strong>{runtime.activeModule ?? "None"}</strong>
        </article>
      </div>
    </section>
  );
}