import Link from "next/link";
import { GenesisApplications } from "../../kernel/ApplicationManager";

export default function GenesisCommandCenter() {
  const applications = GenesisApplications.getVisible();

  return (
    <section className="section" id="command-center">
      <p className="eyebrow">GENESIS COMMAND CENTER</p>

      <h2>Applications</h2>

      <p>
        Genesis OS applications are managed by the Genesis Kernel and displayed
        dynamically through the Application Manager.
      </p>

      <div className="commandGrid">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={app.enabled ? app.route : "#command-center"}
            className={`commandTile ${app.enabled ? "" : "disabled"}`}
          >
            <span className="commandIcon">{app.icon}</span>
            <strong>{app.title}</strong>
            <p>{app.description}</p>
            <small>
              {app.category} · v{app.version} ·{" "}
              {app.enabled ? "Online" : "Preparing"}
            </small>
          </Link>
        ))}
      </div>
    </section>
  );
}