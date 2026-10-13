import { Router, Provider } from "./lib";
import { Shortcuts } from "./services/shortcut";
import { Theme } from "./theme";

export function App() {
      Provider.set(Router, new Router({
            '/': () => document.createElement('div'),
            '/editor': () => document.createElement('div'),
      }, '/'))
      Provider.set(Theme, new Theme)
      Provider.set(Shortcuts, new Shortcuts);
      Provider.of(Shortcuts).listen();

      Provider.of(Router).mount();
}