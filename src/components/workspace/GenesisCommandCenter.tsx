import Link from "next/link";
import { ModuleRegistry } from "../../kernel/ModuleRegistry";

export default function GenesisCommandCenter() {
  const visibleModules = ModuleRegistry.filter((module) => module.visible);

  return (
    <section className="section" id="command-center">
      <p className="eyebrow">GENESIS COMMAND CENTER</p>

      <h2>Applications</h2>

      <p>
        Genesis OS applications are registered through the Genesis Kernel. Each
        module can be enabled, versioned, routed and expanded without changing
        the command center.
      </p>

      <div className="commandGrid">
        {visibleModules.map((module) => (
          <Link
            key={module.id}
            href={module.enabled ? module.route : "#command-center"}
            className={`commandTile ${module.enabled ? "" : "disabled"}`}
          >
            <span className="commandIcon">{module.icon}</span>

            <strong>{module.title}</strong>

            <p>{module.description}</p>

            <small>
              {module.category} · v{module.version} ·{" "}
              {module.enabled ? "Online" : "Preparing"}
            </small>
          </Link>
        ))}
      </div>
    </section>
  );
}