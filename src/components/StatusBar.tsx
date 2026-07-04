const statusItems = [
  ["Stellar", "Online"],
  ["AFIP", "Online"],
  ["Treasury", "Online"],
  ["Settlement", "Online"],
  ["API", "Preparing"],
];

export default function StatusBar() {
  return (
    <section className="statusBar">
      {statusItems.map(([label, value]) => (
        <div className="statusItem" key={label}>
          <strong>● {value}</strong>
          {label}
        </div>
      ))}
    </section>
  );
}