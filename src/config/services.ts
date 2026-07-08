export type GenesisService = {
  id: string;
  name: string;
  description: string;
  endpoint?: string;
  external?: boolean;
};

export const GenesisServices: GenesisService[] = [
  {
    id: "api",
    name: "Atlantis API",
    description: "Core banking platform",
    endpoint: "/health",
  },

  {
    id: "stellar",
    name: "Stellar Horizon",
    description: "Public blockchain network",
    external: true,
    endpoint: "https://horizon.stellar.org",
  },

  {
    id: "toml",
    name: "stellar.toml",
    description: "Genesis metadata",
    external: true,
    endpoint:
      "https://genesistrust.online/.well-known/stellar.toml",
  },

  {
    id: "wallet",
    name: "Genesis Wallet",
    description: "Digital wallet service",
  },

  {
    id: "vault",
    name: "Capital Vault",
    description: "Liquidity & deposits",
  },

  {
    id: "exchange",
    name: "Genesis Exchange",
    description: "Digital asset exchange",
  },

  {
    id: "afip",
    name: "AFIP",
    description: "Asset Financial Interaction Protocol",
  },

  {
    id: "treasury",
    name: "Treasury",
    description: "Settlement & reserves",
  },
];