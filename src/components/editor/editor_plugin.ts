import { Crepe, CrepeConfig } from "@milkdown/crepe";

export interface EditorPlugin {
      onConfig(config: CrepeConfig, crepe: () => Crepe): void;
      onBeforeCreate(crepe: Crepe): void
      onCreate(crepe: Crepe): void
      onDestroy(crepe: Crepe): void
}

export class EditorModule {
      private readonly crepe: Crepe;
      constructor(private readonly plugins: EditorPlugin[], root: HTMLElement, defaultValue: string) {
            const config: CrepeConfig = {
                  root,
                  defaultValue,
                  features: {},
                  featureConfigs: {}
            };

            for (const plugin of plugins) {
                  plugin.onConfig(config, () => this.crepe);
            }
            this.crepe = new Crepe(config);
      }

      public async create() {
            for (const plugin of this.plugins) {
                  plugin.onBeforeCreate(this.crepe);
            }
            await this.crepe.create();
            for (const plugin of this.plugins) {
                  plugin.onCreate(this.crepe);
            }
      }

      public async destroy() {
            await this.crepe.destroy();
      }
}