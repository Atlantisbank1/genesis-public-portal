import { ModuleRegistry, GenesisModule } from "./ModuleRegistry";

export class ApplicationManager {
  private readonly modules: GenesisModule[];

  constructor() {
    this.modules = ModuleRegistry;
  }

  getAll() {
    return this.modules;
  }

  getVisible() {
    return this.modules.filter((module) => module.visible);
  }

  getEnabled() {
    return this.modules.filter((module) => module.enabled);
  }

  getById(id: string) {
    return this.modules.find((module) => module.id === id);
  }
}

export const GenesisApplications = new ApplicationManager();