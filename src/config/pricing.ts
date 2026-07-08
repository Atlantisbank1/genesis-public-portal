export const PricingConfig = {
  baseCurrency: "USD",

  assets: {
    SUSDC: {
      peg: "USD",
      targetPrice: 1,
    },

    ROYAL: {
      peg: "GOLD_OUNCE",
      displayName: "Royal Gold Reserve Asset",
    },
  },

  gold: {
    unit: "troy_ounce",
    fallbackUsdPrice: 2400,
    apiUrl: process.env.NEXT_PUBLIC_GOLD_PRICE_API_URL ?? "",
  },
};