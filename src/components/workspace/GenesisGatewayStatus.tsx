import { GenesisSDK } from "../../gateway/GenesisSDK";

export default async function GenesisGatewayStatus() {
  const healthList = await GenesisSDK.health();

  return (
    <section className="section">
      <p className="eyebrow">GENESIS GATEWAY</p>

      <h2>Gateway Providers</h2>

      <div className="metricGrid">
        {healthList.map((health) => (
          <article className="metricCard" key={health.service}>
            <span>{health.service}</span>
            <strong>{health.status}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}