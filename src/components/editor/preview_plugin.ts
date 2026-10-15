import { CrepeConfig, Crepe } from "@milkdown/crepe";
import { EditorPlugin } from "./editor_plugin";
import mermaid from "mermaid";
import { Component } from "../../lib";
import { EditorView } from '@codemirror/view';

export class PreviewPlugin implements EditorPlugin {
      private mermaidPreview(content: string, applyPreview: (icon: string | HTMLElement) => void): string | null | HTMLElement {
            const svgId = `mermaid-svg-${crypto.randomUUID()}`;
            const host = Component.div({ class: 'mermaid-preview' });

            mermaid
            .render(svgId, content)
            .then(({ svg }: { svg: string}) => {
                  host.innerHTML = svg;
            })
            .catch((err: Error) => {
                  console.error(err.message);
            });
            applyPreview(host);
            return host;
      }

      private preview(language: string, content: string, applyPreview: (icon: string | HTMLElement) => void) {
            if (!content) {
                  return null;
            }

            if (language.toLowerCase() == 'mermaid') {
                  return this.mermaidPreview(content, applyPreview);
            }
            return null;
      }
      public onConfig(config: CrepeConfig): void {
            config.featureConfigs ??= {};
            config.features ??= {};

            config.featureConfigs[Crepe.Feature.CodeMirror] = {
                  extensions: [EditorView.lineWrapping],
                  renderPreview: (l, c, b) => this.preview(l, c, b),
            };
      }
      public onBeforeCreate(): void {}
      public onCreate(): void {}
      public onDestroy(): void {}
}