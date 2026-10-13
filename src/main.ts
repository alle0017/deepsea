import { Router, Provider } from "./lib";
import { Theme } from "./theme";

export function App() {
      Provider.set(Router, new Router({
            '/': () => document.createElement('div'),
            '/editor': () => document.createElement('div'),
      }, '/'))
      Provider.set(Theme, new Theme)

      Provider.of(Router).mount();
}