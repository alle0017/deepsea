import { Crepe } from "@milkdown/crepe";
import { EditorPlugin } from "./editor_plugin";
import { $prose } from "@milkdown/utils";
import { search } from "prosemirror-search";
import { FindBar, FindBarElement } from "../find_bar";
import { Shortcuts } from "../../services/shortcut";
import { Provider } from "../../lib";
import { editorViewCtx } from "@milkdown/core";


const searchPlugin = $prose(() => search());

export class SearchPlugin implements EditorPlugin {

      private bar: FindBarElement | undefined;
      onConfig(): void {}
      onBeforeCreate(crepe: Crepe): void {
            crepe.editor.use(searchPlugin);
      }
      onCreate(crepe: Crepe): void {
            const getView = () => crepe.editor.action((ctx) => ctx.get(editorViewCtx));
            this.bar = FindBar({ getView });
            Provider.of(Shortcuts).registerCrossPlatform('f', () => this.bar?.isOpen() ? this.bar?.close(): this.bar?.open());
      }
      onDestroy(): void {
            Provider.of(Shortcuts).unregisterCrossPlatform('f');
            this.bar?.el.remove();
      }
      
}