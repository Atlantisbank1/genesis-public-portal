export const GenesisKernel = {
  name: "Genesis OS",

  version: "3.0 Alpha",

  workspace: "Genesis Command Center",

  api: process.env.NEXT_PUBLIC_ATLANTIS_API_URL ??
       "http://localhost:3000",

  modules: [
    "Wallet",
    "Capital Vault",
    "Exchange",
    "Marketplace",
    "Explorer",
    "Treasury",
    "AFIP",
    "Developers",
  ],
};