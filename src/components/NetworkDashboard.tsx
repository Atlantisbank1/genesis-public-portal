const metrics = [
  {
    title: "Network Status",
    value: "Operational",
  },
  {
    title: "Tokenized Assets",
    value: "Preparing",
  },
  {
    title: "Treasury",
    value: "Online",
  },
  {
    title: "Liquidity",
    value: "Initializing",
  },
  {
    title: "Settlement",
    value: "Operational",
  },
  {
    title: "Developers",
    value: "Open",
  },
  {
    title: "Institutions",
    value: "Joining",
  },
  {
    title: "Public API",
    value: "Coming Soon",
  },
];

export default function NetworkDashboard() {
  return (
    <section className="section" id="network">
      <p className="eyebrow">LIVE NETWORK</p>

      <h2>Genesis Network Dashboard</h2>

      <p>
        A live overview of the Genesis Capital Network. These components are
        designed to connect to the Atlantis public infrastructure APIs as they
        become available.
      </p>

      <div className="metricGrid">
        {metrics.map((metric) => (
          <article className="metricCard" key={metric.title}>
            <span>{metric.title}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}