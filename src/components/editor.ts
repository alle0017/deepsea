//@ts-ignore
import "@milkdown/crepe/theme/common/style.css";
//@ts-ignore
import "@milkdown/crepe/theme/nord-dark.css";
import { Component, hook, } from "../lib/index.js"
import { EditorModule } from "./editor/editor_plugin.js";
import { PreviewPlugin } from "./editor/preview_plugin.js";
import { SearchPlugin } from "./editor/search_plugin.js";
import { TopBarPlugin } from "./editor/top_bar_plugin.js";

const { div } = Component;

type Args = {
      save?: (value: string) => void
      value?: string
      leave?: (cleanup: () => void) => void,
      exportAs?: (format: string, value: string) => void,
}

export function Editor({ value, leave, exportAs, save }: Args) {
      value ??= '';
      async function create(el: HTMLElement) {
            const editor = new EditorModule([
                  new PreviewPlugin(),
                  new SearchPlugin(),
                  new TopBarPlugin(exportAs, save),
            ], el, value as string);

            await editor.create();

            leave?.(async () => {
                  await editor.destroy()
            })
      }

      return hook({ mount: create },
            div({ style: 'height: 80vh; min-height: 0; overflow-y: auto; overflow-x: hidden; overflow-anchor: none; padding-bottom: 60vh;' })
      )
}