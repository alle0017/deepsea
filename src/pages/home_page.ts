import { DragDropEvent, getCurrentWebview, } from "@tauri-apps/api/webview";
import { Event } from "@tauri-apps/api/event";
import { Actions } from "../components/actions";
import { ErrorToast } from "../components/error_toast";
import { History } from "../components/history";
import { Provider, Router, Component } from "../lib";
import * as fs from "../services/file_system";
import { row } from "../theme";

const { div } = Component

async function select() {
      try {
            const file = await fs.select()
            Provider.of(Router).goto('/editor', file);
      } catch (e) {
            ErrorToast('failed to open the file');
            console.error(e)
      }
}
async function open(text: string) {
      try {
            const file = await fs.open(text)
            Provider.of(Router).goto('/editor', file);
      } catch (e) {
            ErrorToast('failed to open the file');
            console.error(e)
      }
}
async function create() {
      try {
            const file = await fs.create()
            Provider.of(Router).goto('/editor', file);
      } catch (e) {
            ErrorToast('failed to create the file');
            console.error(e)
      }
}

async function drop(e: Event<DragDropEvent>) {
      if (e.payload.type !== 'drop') {
            return;
      }
      for (const path of e.payload.paths) {
            if (path.endsWith('.md')) {
                  try {
                        await open(path);
                  } catch (e) {
                        ErrorToast((e as Error).message);
                  }
                  return;
            }
      }
      ErrorToast('No file can be opened');
}
function stopListening(clean: () => void) {
      Provider.of(Router).onLeave.consume(({ route }) => {
            if (route == '/') {
                  clean();
                  return false;
            }
            return true;
      })
}
export function HomePage() {
      getCurrentWebview()
      .onDragDropEvent(drop)
      .then(stopListening)
      .catch(ErrorToast);

      return div({ style: `align-items: start; justify-content: center; width: 100vw; height: 50vh; padding-top: 25vh; ${row('20px')}` },
            Actions({ open: select, create }),
            History({ open })
      )
}