import { Component } from "./components.js";
import { Reactive } from "./reactive.js";
type Args = {
      mount?: (e: HTMLElement) => void
}
export function hook({ mount }: Args, el: HTMLElement) {
      mount?.(el);
      return el;
}
export function react(signals: Reactive<unknown>[], component: () => HTMLElement) {
      let el = component();
      Reactive.from(...signals).subscribe(() => {
            const replace = component();
            el.replaceWith(replace);
            el = replace;
      })
      return el;
}

export function style(css: string) {
      document.head.append(Component.style({}, css))
}
export function bind() {
      const obj =  {
            value: '',
            binding: {
                  change: (e: Event) => obj.value = (e.target as HTMLInputElement).value,
            }
      }
      return obj;
}