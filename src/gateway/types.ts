export type GatewayStatus = "online" | "offline" | "maintenance";

export interface AssetInfo {
  id: string;
  code: string;
  name: string;
  network: string;
  balance?: string;
  issuer?: string;
  logo?: string;
}

export interface HealthInfo {
  service: string;
  status: GatewayStatus;
  timestamp?: string;
}

export interface GatewayProvider {
  name: string;

  getHealth(): Promise<HealthInfo>;

  getAssets(): Promise<AssetInfo[]>;
}