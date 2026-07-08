import { GenesisMarkets } from "../config/markets";
import { getRoyalPrice, getSusdcPrice } from "./PricingProvider";

export async function getRoyalSusdcMarket() {
  const royal = await getRoyalPrice();
  const susdc = await getSusdcPrice();

  return {
    ...GenesisMarkets.ROYAL_SUSDC,
    royalPriceUsd: royal.priceUsd,
    susdcPriceUsd: susdc.priceUsd,
    impliedRoyalSusdcRate: royal.priceUsd / susdc.priceUsd,
    updatedAt: royal.updatedAt,
  };
}