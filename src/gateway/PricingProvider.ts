import { PricingConfig } from "../config/pricing";

export type AssetPrice = {
  code: string;
  priceUsd: number;
  source: string;
  updatedAt: string;
};

export async function getRoyalPrice(): Promise<AssetPrice> {
  return {
    code: "ROYAL",
    priceUsd: PricingConfig.gold.fallbackUsdPrice,
    source: "fallback-gold-ounce-price",
    updatedAt: new Date().toISOString(),
  };
}

export async function getSusdcPrice(): Promise<AssetPrice> {
  return {
    code: "SUSDC",
    priceUsd: PricingConfig.assets.SUSDC.targetPrice,
    source: "usd-peg",
    updatedAt: new Date().toISOString(),
  };
}