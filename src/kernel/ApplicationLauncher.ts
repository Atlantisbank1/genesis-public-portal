import { ModuleRegistry } from "./ModuleRegistry";

export type LaunchResult = {
  id: string;
  title: string;
  route: string;
  canLaunch: boolean;
  status: "online" | "preparing" | "hidden";
};

export function getLaunchableApplications(): LaunchResult[] {
  return ModuleRegistry.filter((module) => module.visible).map((module) => ({
    id: module.id,
    title: module.title,
    route: module.route,
    canLaunch: module.enabled,
    status: module.enabled ? "online" : "preparing",
  }));
}

export function getApplicationById(id: string): LaunchResult | undefined {
  return getLaunchableApplications().find((app) => app.id === id);
}