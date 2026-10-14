import { CrepeConfig, Crepe } from "@milkdown/crepe";
import { EditorPlugin } from "./editor_plugin";
import mermaid from "mermaid";

export class MermaidPlugin implements EditorPlugin {
      private mermaidPreview(language: string, content: string, applyPreview: (icon: string) => void) {
            if (language === "mermaid" && content) {
                  const svgId = `mermaid-svg-${crypto.randomUUID()}`;
                  mermaid
                        .render(svgId, content)
                        .then((output: any) => {
                              applyPreview(output.svg);
                        })
                        .catch((err: Error) => {
                              console.error(err.message);
                        });
                  return null;
            }
            return null;
      }
      public onConfig(config: CrepeConfig): void {
            config.featureConfigs ??= {};
            config.featureConfigs[Crepe.Feature.CodeMirror] = {
                  renderPreview: (l, c, b) => this.mermaidPreview(l, c, b),
            };
      }
      public onBeforeCreate(): void {}
      public onCreate(): void {}
      public onDestroy(): void {}
}