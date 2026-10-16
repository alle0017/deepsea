import { Crepe } from "@milkdown/crepe";
import { $prose } from "@milkdown/kit/utils";
import { Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { EditorPlugin } from "./editor_plugin";
import { EditorView } from "prosemirror-view";
import { ErrorToast } from "../error_toast";
import { readImage } from "@tauri-apps/plugin-clipboard-manager";

function fileAsDataUrl(file: File | Blob): Promise<string> {
      return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error(reader.error?.message));
            reader.readAsDataURL(file);
      });
}
async function insert(view: EditorView, files: (File | Blob)[]) {
      for (const file of files) {
            const src = await fileAsDataUrl(file);
            const { schema } = view.state;
            const type = schema.nodes["image-block"] ?? schema.nodes.image;
            const node = type.createAndFill({ src, alt: '' });
            if (node) {
                  view.dispatch(view.state.tr.replaceSelectionWith(node));
            }
      }
}

async function clipboardImageAsPngBlob(): Promise<Blob | null> {
      try {
            const img = await readImage(); // throws if the clipboard has no image
            const { width, height } = await img.size();
            const rgba = await img.rgba();

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")!.putImageData(
                  new ImageData(new Uint8ClampedArray(rgba), width, height),
                  0, 0
            );
            return await new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
      } catch {
            return null;
      }
}

const pasteImagePlugin = $prose(() =>
      new Plugin({
            key: new PluginKey("PASTE_IMAGE"),
            props: {
                  handleDOMEvents: {
                        paste(view, event) {
                              const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
                                    f.type.startsWith("image/")
                              );
                              if (files.length > 0) {
                                    event.preventDefault();
                                    insert(view, files).catch(() => ErrorToast('error loading images'));
                                    return true;
                              }
                              if (!event.clipboardData?.types.includes('Files')) {
                                    return false;
                              }
                              event.preventDefault();
                              clipboardImageAsPngBlob().then(async (blob) => {
                                    if (blob) {
                                          await insert(view, [blob]);
                                    }
                              }).catch(() => ErrorToast('error loading images'));
                              return true;
                        },
                  },
            },
      })
);

export class ImagePlugin implements EditorPlugin {
      onConfig(): void { }
      onBeforeCreate(crepe: Crepe): void {
            crepe.editor.use(pasteImagePlugin);
      }
      onCreate(): void { }
      onDestroy(): void { }
}