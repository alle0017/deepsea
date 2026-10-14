import { readTextFile, writeFile, writeTextFile } from "@tauri-apps/plugin-fs";
import * as dialog from "@tauri-apps/plugin-dialog";
import { history } from "./history";

export class File {
      public static asName(path: string) {
            let name = '';

            for (let i = 0; i < path.length; i++) {
                  const char = path[path.length - i - 1];
                  if (char == '\\' || char == '/') {
                        break;
                  }
                  name = char + name;
            }
            return name;
      }

      public readonly name: string;

      constructor(public readonly path: string, public text: string) {
            if (path.includes('.md')) {
                  history.add(path);
            }
            this.name = File.asName(path);
      }
      public copy(path: string) {
            return new File(path, this.text);
      }
      public export(ext: string) {
            return this.copy(this.path.slice(0, this.path.lastIndexOf('.')) + ext)
      }
      public async save(text: string = this.text) {
            this.text = text;
            await writeTextFile(this.path, this.text);
      }
      public async saveFileFromBlob(blob: Blob) {
            const buff = await blob.arrayBuffer();
            await writeFile(this.path, new Uint8Array(buff));
      }
}

export async function select() {
      const file = await dialog.open({
            title: 'select a file to open',
            filters: [{ name: 'extension', extensions: ['md', 'txt'] }]
      });

      if (!file) {
            throw new Error('file not opened correctly');
      }

      return new File(file, await readTextFile(file));
}

export async function create() {
      const file = await dialog.save({
            title: 'create a file',
            filters: [{ name: 'extension', extensions: ['md', 'txt'] }]
      });

      if (!file) {
            throw new Error('file not opened correctly');
      }

      return new File(file, '');
}

export async function open(path: string) {
      return new File(path, await readTextFile(path));
}