import { Actions } from "../components/actions";
import { ErrorToast } from "../components/error_toast";
import { History } from "../components/history";
import { Provider, Router } from "../lib";
import { Component } from "../lib";
import * as fs from "../services/file_system";
import { row } from "../theme";

const { div } = Component

async function select() {
      try {
            const file = await fs.select()
            Provider.of(Router).goto('/editor', file);
      } catch (e) {
            ErrorToast('failed to open the file');
      }
}
async function open(text: string) {
      try {
            const file = await fs.open(text)
            Provider.of(Router).goto('/editor', file);
      } catch (e) {
            ErrorToast('failed to open the file');
      }
}
async function create() {
      try {
            const file = await fs.create()
            Provider.of(Router).goto('/editor', file);
      } catch (e) {
            ErrorToast('failed to create the file');
      }
}

export function HomePage() {
      return div({ style: `align-items: start; justify-content: center; width: 100vw; height: 50vh; padding-top: 25vh; ${row('20px')}`},
            Actions({ open: select, create }),
            History({ open })
      )
}