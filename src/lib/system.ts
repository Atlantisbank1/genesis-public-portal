import { apiGet } from "./api";

export type HealthResponse = {
  status: string;
  timestamp: string;
};

export async function getAtlantisHealth() {
  return apiGet<HealthResponse>("/health");
}