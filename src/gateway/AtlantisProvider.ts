import { getAtlantisHealth } from "../lib/system";
import { AssetInfo, GatewayProvider, HealthInfo } from "./types";
import { GenesisAssets } from "../config/assets";

export const AtlantisProvider: GatewayProvider = {
  name: "Atlantis Platform",

  async getHealth(): Promise<HealthInfo> {
    try {
      const health = await getAtlantisHealth();

      return {
        service: "Atlantis API",
        status: health.status === "ok" ? "online" : "maintenance",
        timestamp: health.timestamp,
      };
    } catch {
      return {
        service: "Atlantis API",
        status: "offline",
      };
    }
  },

  async getAssets(): Promise<AssetInfo[]> {
    return Object.values(GenesisAssets).map((asset) => ({
      id: asset.code.toLowerCase(),
      code: asset.code,
      name: asset.name,
      network: asset.network,
      issuer: asset.issuer,
      logo: asset.logo,
    }));
  },
};