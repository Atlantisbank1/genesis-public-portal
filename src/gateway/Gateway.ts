import { AssetInfo, GatewayProvider, HealthInfo } from "./types";

class GenesisGateway {
  private providers: GatewayProvider[] = [];

  register(provider: GatewayProvider) {
    this.providers.push(provider);
  }

  getProviders() {
    return this.providers;
  }

  async getHealth(): Promise<HealthInfo[]> {
    return Promise.all(
      this.providers.map((provider) => provider.getHealth())
    );
  }

  async getAssets(): Promise<AssetInfo[]> {
    const assets = await Promise.all(
      this.providers.map((provider) => provider.getAssets())
    );

    return assets.flat();
  }
}

export const Gateway = new GenesisGateway();