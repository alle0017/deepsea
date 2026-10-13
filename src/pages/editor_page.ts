import { Editor } from "../components/editor";
import { ErrorToast } from "../components/error_toast";
import { Provider, Router } from "../lib";
import { File } from "../services/file_system";

export function EditorPage(file: File) {
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
      return Editor({ value: file.text, save, leave })
}