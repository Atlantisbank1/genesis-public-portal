export type GenesisModule = {

  id: string;

  title: string;

  route: string;

  enabled: boolean;
};

export const ModuleRegistry: GenesisModule[] = [

  {
    id: "wallet",
    title: "Wallet",
    route: "/wallet",
    enabled: true,
  },

  {
    id: "vault",
    title: "Capital Vault",
    route: "/vault",
    enabled: true,
  },

  {
    id: "exchange",
    title: "Exchange",
    route: "/exchange",
    enabled: true,
  },

  {
    id: "explorer",
    title: "Explorer",
    route: "/explorer",
    enabled: false,
  },

  {
    id: "marketplace",
    title: "Marketplace",
    route: "/marketplace",
    enabled: false,
  },

  {
    id: "treasury",
    title: "Treasury",
    route: "/treasury",
    enabled: false,
  },

  {
    id: "afip",
    title: "AFIP",
    route: "/afip",
    enabled: false,
  },

];