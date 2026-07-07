export const GenesisConfig = {
  systemName: "Genesis OS",

  commandCenter: "Genesis Command Center",

  version: "3.0 Alpha",

  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_ATLANTIS_API_URL ??
      "http://localhost:3000",
  },

  organization: {
    name: "Genesis Heritage Trust",
    portal: "Genesis Capital Network",
    homeDomain: "genesistrust.online",
  },
};