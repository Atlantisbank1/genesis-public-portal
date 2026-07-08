export type RuntimeState = {
  online: boolean;
  connectedWallet?: string;
  currentNetwork: string;
  apiConnected: boolean;
  activeModule?: string;
};

class GenesisRuntime {
  private state: RuntimeState = {
    online: true,
    currentNetwork: "Stellar Public Network",
    apiConnected: false,
  };

  getState() {
    return this.state;
  }

  setApiConnected(value: boolean) {
    this.state.apiConnected = value;
  }

  setWallet(address: string) {
    this.state.connectedWallet = address;
  }

  setActiveModule(module: string) {
    this.state.activeModule = module;
  }

  setNetwork(network: string) {
    this.state.currentNetwork = network;
  }
}

export const Runtime = new GenesisRuntime();