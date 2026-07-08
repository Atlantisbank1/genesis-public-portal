import { Gateway } from "./Gateway";
import { AtlantisProvider } from "./AtlantisProvider";

let initialized = false;

function initialize() {
  if (initialized) return;

  Gateway.register(AtlantisProvider);

  initialized = true;
}

export const GenesisSDK = {
  async health() {
    initialize();
    return Gateway.getHealth();
  },

  async assets() {
    initialize();
    return Gateway.getAssets();
  },
};