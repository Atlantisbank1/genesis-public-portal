import { GenesisAssets } from "../../config/assets";

export default function GenesisAssetRegistry() {
  const assets = Object.values(GenesisAssets);

  return (
    <section className="section" id="asset-registry">
      <p className="eyebrow">ASSET REGISTRY</p>

      <h2>Genesis Assets</h2>

      <div className="cardGrid">
        {assets.map((asset) => (
          <article className="panel" key={asset.code}>
            <img
              src={asset.logo}
              alt={asset.code}
              style={{ width: 48, height: 48, borderRadius: "50%" }}
            />

            <h3>{asset.code}</h3>
            <p>{asset.name}</p>
            <p className="mono">{asset.issuer}</p>
            <small>{asset.network}</small>
          </article>
        ))}
      </div>
    </section>
  );
}