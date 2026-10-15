import { Editor } from "../components/editor";
import { ErrorToast } from "../components/error_toast";
import { Provider, Router } from "../lib";
import { File } from "../services/file_system";
import { convert } from "../services/pandoc";
import { EXPORT_FORMATS } from "../components/export_menu";

function leave(cleanup: () => void) {
      Provider.of(Router).onLeave.consume(event => {
            if (event.route == '/editor') {
                  cleanup();
                  return false;
            }
            return true;
      })
}
export function EditorPage(file: File) {
      async function exportAs(format: string, value: string) {
            try {
                  const promise = convert('markdown', format, value);
                  let extension = '.txt';
                  for (const form of EXPORT_FORMATS) {
                        if (form.id === format) {
                              extension = form.ext;
                        }
                  }
                  const copy = file.export(extension);
                  const res = await promise;
                  copy.saveFileFromBlob(res).catch(ErrorToast);
            } catch (e) {
                  ErrorToast((e as Error).message)
                  throw e
            }
      }
      async function save(text: string) {
            try {
                  await file.save(text)
            } catch (e) {
                  ErrorToast('failed to save the file');
            }
      }
      
      return Editor({ value: file.text, save, leave, exportAs })
}