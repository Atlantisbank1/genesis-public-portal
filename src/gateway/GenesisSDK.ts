import { AtlantisProvider } from "./AtlantisProvider";

export const GenesisSDK = {
  async health() {
    return AtlantisProvider.getHealth();
  },

  async assets() {
    return AtlantisProvider.getAssets();
  },
};