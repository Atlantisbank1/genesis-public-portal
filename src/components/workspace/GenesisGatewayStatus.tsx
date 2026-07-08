import { GenesisSDK } from "../../gateway/GenesisSDK";

export default async function GenesisGatewayStatus() {
  const health = await GenesisSDK.health();

  return (
    <section className="section">
      <p className="eyebrow">GENESIS GATEWAY</p>

      <h2>Gateway Status</h2>

      <div className="metricGrid">
        <article className="metricCard">
          <span>{health.service}</span>
          <strong>{health.status}</strong>
        </article>

        <article className="metricCard">
          <span>Last Update</span>
          <strong>{health.timestamp ?? "Unavailable"}</strong>
        </article>
      </div>
    </section>
  );
}