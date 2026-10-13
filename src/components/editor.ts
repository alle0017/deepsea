import { search } from "prosemirror-search";

import { Crepe } from "@milkdown/crepe";
import { $prose } from "@milkdown/utils";
import { editorViewCtx } from "@milkdown/core";

//@ts-ignore
import "@milkdown/crepe/theme/common/style.css";
//@ts-ignore
import "@milkdown/crepe/theme/nord-dark.css";

import mermaid from "mermaid";

import { Component, hook, Provider } from "../lib/index.js"
import { Shortcuts } from "../services/shortcut.js";
import { FindBar } from "./find_bar.js";
import { TopBar } from "./top_bar.js";
import { ExportMenu } from "./export_menu.js";

const { div } = Component;

type Args = {
      save?: (value: string) => void
      value?: string
      leave?: (cleanup: () => void) => void,
      exportAs?: (format: string, value: string) => void,
}
const searchPlugin = $prose(() => search());

function mermaidPreview(language: string, content: string, applyPreview: (icon: string) => void) {
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

export function Editor({ value, save, leave, exportAs }: Args) {
      value ??= '';
      async function create(el: HTMLElement) {
            const exportMenu = ExportMenu({
                  onSelect: (format) => exportAs?.(format, crepe.getMarkdown()),
            });
            const crepe = new Crepe({
                  root: el,
                  defaultValue: value,
                  features: {
                        [Crepe.Feature.TopBar]: true
                  },
                  featureConfigs: {
                        [Crepe.Feature.TopBar]: {
                              buildTopBar: TopBar({ save: () => save?.(crepe.getMarkdown()), exportMenu  })
                        },
                        [Crepe.Feature.CodeMirror]: {
                              renderPreview: mermaidPreview,
                        },
                  }
            })
            crepe.editor.use(searchPlugin);
            await crepe.create();
            const getView = () => crepe.editor.action((ctx) => ctx.get(editorViewCtx));
            const bar = FindBar({ getView });

            Provider.of(Shortcuts).registerCrossPlatform('s', () => save?.(crepe.getMarkdown()));
            Provider.of(Shortcuts).registerCrossPlatform('f', () => bar.open());

            leave?.(async () => {
                  Provider.of(Shortcuts).unregisterCrossPlatform('s');
                  Provider.of(Shortcuts).unregisterCrossPlatform('f');
                  await crepe.destroy();
            })
      }

      return hook({ mount: create },
            div({})
      )
}