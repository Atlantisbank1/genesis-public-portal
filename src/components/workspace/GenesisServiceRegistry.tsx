import { GenesisServices } from "../../config/services";

export default function GenesisServiceRegistry() {
  return (
    <section className="section">
      <p className="eyebrow">SERVICE REGISTRY</p>

      <h2>Genesis Services</h2>

      <div className="cardGrid">
        {GenesisServices.map((service) => (
          <article className="panel" key={service.id}>
            <h3>{service.name}</h3>

            <p>{service.description}</p>

            <strong>
              {service.external ? "External Service" : "Genesis Service"}
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}