import { Reactive } from "./reactive.js";
import { react } from "./utility.js";

class EventQueue<T> {
      private readonly listeners: Set<(v: T) => boolean> = new Set;

      public produce(event: T) {
            for (const l of this.listeners) {
                  if (!l(event)) {
                        this.listeners.delete(l);
                  }
            }
      }

      public consume(f: (v: T) => boolean) {
            this.listeners.add(f);
      }
}
export class Router<T extends Record<string, (params: {}) => HTMLElement>> {
      private readonly signal: Reactive<keyof T>;
      public readonly onLeave: EventQueue<{ route: keyof T, params: {} }> = new EventQueue;
      private params: {} = {}
      constructor(private readonly routes: T, home: keyof T) {
            this.signal = new Reactive(home);
      }
      public goto(route: keyof T, params: {} = this.params) {
            this.onLeave.produce({ route: this.signal.value, params: {} });
            this.params = params;
            this.signal.value = route;
      }

      public mount(root = document.body) {
            root.append(react([this.signal], () => this.routes[this.signal.value](this.params)))
      }     
}