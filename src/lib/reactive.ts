export class Reactive<T> {
      public static from(...signals: Reactive<unknown>[]) {
            const consumer = new Reactive(undefined);
            const sub = () => consumer.dispatch()

            for (const signal of signals) {
                  signal.subscribe(sub);
            }
            return consumer;
      }
      private readonly subscribers: Set<() => void> = new Set;
      constructor(private _value: T) {}

      public get value(): T {
            return this._value;
      }
      public set value(v: T) {
            if (this._value != v) {
                  this._value = v;
                  this.dispatch();
            }
      }

      public dispatch() {
            for (const sub of this.subscribers) {
                  sub();
            }
      }

      public subscribe(fn: () => void) {
            this.subscribers.add(fn);
      }
}