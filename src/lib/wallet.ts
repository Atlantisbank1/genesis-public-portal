import { apiGet } from "./api";

export type WalletAsset = {
  code: string;
  balance: string;
  valueUsd?: string;
};

export async function getWalletAssets(walletId: string) {
  return apiGet<WalletAsset[]>(`/wallets/${walletId}/assets`);
}