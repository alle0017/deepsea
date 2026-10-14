import { Editor } from "../components/editor";
import { ErrorToast } from "../components/error_toast";
import { Provider, Router } from "../lib";
import { File } from "../services/file_system";
import { convert } from "../services/pandoc";
import { EXPORT_FORMATS } from "../components/export_menu";

export function EditorPage(file: File) {
      async function exportAs(format: string, value: string) {
            const promise = convert('markdown', format, value);
            let extension = '.txt';
            for (const form of EXPORT_FORMATS) {
                  if (form.id === format) {
                        extension = form.ext;
                  }
            }
            const copy = file.export(extension);
            const res = await promise;

            if (res.stderr) {
                  ErrorToast(res.stderr);
                  return;
            }
            copy.save(res.stdout);
      }
      async function save(text: string) {
            try {
                  await file.save(text)
            } catch (e) {
                  ErrorToast('failed to save the file');
            }
      }
      function leave(cleanup: () => void) {
            Provider.of(Router).onLeave.consume(event => {
                  if (event.route == '/editor') {
                        cleanup();
                        return false;
                  }
                  return true;
            })
      }
      return Editor({ value: file.text, save, leave, exportAs })
}