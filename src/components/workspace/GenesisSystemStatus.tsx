import { getAtlantisHealth } from "../../lib/system";

export default async function GenesisSystemStatus() {
  let status = "Offline";
  let timestamp = "Unavailable";

  try {
    const health = await getAtlantisHealth();
    status = health.status === "ok" ? "Online" : health.status;
    timestamp = health.timestamp;
  } catch {
    status = "Offline";
  }

  return (
    <section className="section" id="system-status">
      <p className="eyebrow">LIVE SYSTEM STATUS</p>

      <h2>Atlantis Infrastructure</h2>

      <div className="metricGrid">
        <article className="metricCard">
          <span>Atlantis API</span>
          <strong>{status}</strong>
        </article>

        <article className="metricCard">
          <span>Last Health Check</span>
          <strong>{timestamp}</strong>
        </article>
      </div>
    </section>
  );
}