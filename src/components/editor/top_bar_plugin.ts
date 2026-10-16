import { Crepe, CrepeConfig } from "@milkdown/crepe";
import { EditorPlugin } from "./editor_plugin";
import { Shortcuts } from "../../services/shortcut";
import { Provider } from "../../lib";
import { ExportMenu, ExportMenuElement } from "../export_menu";
import { TopBar } from "../top_bar";


export class TopBarPlugin implements EditorPlugin {

      private exportMenu: ExportMenuElement | undefined;
      constructor(private readonly exportAs: ((ext: string, value: string) => void) | undefined, private readonly save: ((value: string) => void) | undefined) {}
      onConfig(config: CrepeConfig, crepe: () => Crepe): void {
            const exportMenu = ExportMenu({
                  onSelect: (format) => this.exportAs?.(format, crepe().getMarkdown()),
            });
            Provider.of(Shortcuts).registerCrossPlatform('s', () => this.save?.(crepe().getMarkdown()));
            config.featureConfigs ??= {};
            config.features ??= {}
            config.features[Crepe.Feature.TopBar] = true;
            config.featureConfigs[Crepe.Feature.TopBar] = {
                  buildTopBar: TopBar({ save: () => this.save?.(crepe().getMarkdown()), exportMenu  })   
            };
            this.exportMenu = exportMenu;
      }
      onBeforeCreate(): void {}
      onCreate(): void {}
      onDestroy(): void {
            Provider.of(Shortcuts).unregisterCrossPlatform('s');
            this.exportMenu?.destroy();
      }
      
}