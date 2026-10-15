import mermaid from "mermaid";
import { Router, Provider, style } from "./lib";
import { EditorPage } from "./pages/editor_page";
import { HomePage } from "./pages/home_page";
import { File } from "./services/file_system";
import { Shortcuts } from "./services/shortcut";
import { Theme } from "./theme";
import { ErrorToast } from "./components/error_toast";
export function App() {
      Provider.set(Router, new Router({
            '/': HomePage,
            '/editor': file => EditorPage(file as File),
      }, '/'))
      Provider.set(Theme, new Theme)
      Provider.set(Shortcuts, new Shortcuts);
      Provider.of(Shortcuts).listen();
      style(/*css*/`
            * {
                  color: ${Provider.of(Theme).text};
                  font-family: system-ui;
            }
            body {
                  background-color: ${Provider.of(Theme).surface};
                  overflow: hidden;
            }
            .milkdown .ProseMirror .ProseMirror-search-match {
                  background: #ebcb8b !important;
                  color: #2e3440 !important;
                  border-radius: 2px;
            }
            .milkdown .ProseMirror .ProseMirror-active-search-match {
                  background: #d08770 !important;
                  color: #2e3440 !important;
            }
      `)
      mermaid.initialize({
            startOnLoad: true,
            theme: "dark",
            look: "handDrawn",
            layout: "elk",
            suppressErrorRendering: true,
      });
      mermaid.setParseErrorHandler((err: string) => ErrorToast(err))
      Provider.of(Router).mount();
}

App()