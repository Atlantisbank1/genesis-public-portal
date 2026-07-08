import { GatewayProvider } from "./types";

class GenesisGateway {
  private providers: GatewayProvider[] = [];

  register(provider: GatewayProvider) {
    this.providers.push(provider);
  }

  getProviders() {
    return this.providers;
  }
}

export const Gateway = new GenesisGateway();