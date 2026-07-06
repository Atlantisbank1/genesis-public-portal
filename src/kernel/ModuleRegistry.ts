export type GenesisModule = {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  category: "Finance" | "Infrastructure" | "Developer";
  enabled: boolean;
  visible: boolean;
  version: string;
};

export const ModuleRegistry: GenesisModule[] = [
  {
    id: "wallet",
    title: "Genesis Wallet",
    description: "Manage digital assets and payments.",
    route: "/wallet",
    icon: "💼",
    category: "Finance",
    enabled: true,
    visible: true,
    version: "1.0",
  },
  {
    id: "vault",
    title: "Capital Vault",
    description: "Treasury deposits and liquidity.",
    route: "/vault",
    icon: "🏦",
    category: "Finance",
    enabled: true,
    visible: true,
    version: "1.0",
  },
  {
    id: "exchange",
    title: "Exchange",
    description: "Swap and settlement engine.",
    route: "/exchange",
    icon: "🔄",
    category: "Finance",
    enabled: true,
    visible: true,
    version: "1.0",
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Blockchain explorer.",
    route: "/explorer",
    icon: "🔍",
    category: "Infrastructure",
    enabled: false,
    visible: true,
    version: "0.1",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Tokenized asset marketplace.",
    route: "/marketplace",
    icon: "🌍",
    category: "Finance",
    enabled: false,
    visible: true,
    version: "0.1",
  },
  {
    id: "treasury",
    title: "Treasury",
    description: "Treasury operations.",
    route: "/treasury",
    icon: "🏛️",
    category: "Infrastructure",
    enabled: false,
    visible: true,
    version: "0.1",
  },
  {
    id: "afip",
    title: "AFIP",
    description: "Asset Financial Interaction Protocol.",
    route: "/afip",
    icon: "⚡",
    category: "Infrastructure",
    enabled: false,
    visible: true,
    version: "0.1",
  },
  {
    id: "developers",
    title: "Developer Center",
    description: "SDKs and APIs.",
    route: "/developers",
    icon: "🛠️",
    category: "Developer",
    enabled: true,
    visible: true,
    version: "1.0",
  },
];