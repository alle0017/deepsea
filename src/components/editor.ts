//@ts-ignore
import "@milkdown/crepe/theme/common/style.css";
//@ts-ignore
import "@milkdown/crepe/theme/nord-dark.css";
import { Component, hook, Provider, react, Reactive, } from "../lib/index.js"
import { EditorModule } from "./editor/editor_plugin.js";
import { PreviewPlugin } from "./editor/preview_plugin.js";
import { SearchPlugin } from "./editor/search_plugin.js";
import { TopBarPlugin } from "./editor/top_bar_plugin.js";
import { column, row, Theme } from "../theme.js";
import { icon, Icons } from "./icons.js";
import { text } from '../lib/components';

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
            editor.editor.on(api => {
                  api.markdownUpdated((_, str: string) => letters.value = str.length);
            })
            leave?.(async () => {
                  await editor.destroy()
            })
      }
      const letters = new Reactive(value.length);
      const style = `
            background-color: ${Provider.of(Theme).background}; 
            width: 90vw;
            height: 60vh;
            max-height: calc(90vh - 32px - 10px);
            min-height: 0;
            overflow-y: scroll;
            overflow-x: hidden;
            overflow-anchor: none;
            padding-bottom: 60vh;
            border-radius: 7px;
      `;
      return div({ style: `height: 98vh; width: 90vw; margin-left: 5vw; overflow: hidden; ${column()}`},
            hook({ mount: create },
                  div({ style })
            ),
            div({ style: `width: 100%; height: 32px; ${row()}` },
                  div({ style: `align-items: center; ${row('2px')}` },
                        icon({}, Icons.WordCount),
                        ':',
                        react([letters], () => text(`${letters.value}`))
                  )
            )
      )
}