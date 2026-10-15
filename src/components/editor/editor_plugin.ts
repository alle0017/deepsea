import { Crepe, CrepeConfig } from "@milkdown/crepe";

export interface EditorPlugin {
      onConfig(config: CrepeConfig, crepe: () => Crepe): void;
      onBeforeCreate(crepe: Crepe, root: HTMLElement): void
      onCreate(crepe: Crepe, root: HTMLElement): void
      onDestroy(crepe: Crepe, root: HTMLElement): void
}

export class EditorModule {
      private readonly crepe: Crepe;
      constructor(private readonly plugins: EditorPlugin[], private readonly root: HTMLElement, defaultValue: string) {
            const config: CrepeConfig = {
                  root,
                  defaultValue,
                  features: undefined,
                  featureConfigs: undefined,
            };

            for (const plugin of plugins) {
                  plugin.onConfig(config, () => this.crepe);
            }
            this.crepe = new Crepe(config);
      }

      public async create() {
            for (const plugin of this.plugins) {
                  plugin.onBeforeCreate(this.crepe, this.root);
            }
            await this.crepe.create();
            for (const plugin of this.plugins) {
                  plugin.onCreate(this.crepe, this.root);
            }
      }

      public async destroy() {
            for (const plugin of this.plugins) {
                  plugin.onDestroy(this.crepe, this.root);
            }
            await this.crepe.destroy();
      }
}
