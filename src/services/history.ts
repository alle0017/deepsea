export namespace history {
      const key = 'history';

      export function get() {
            return JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
      }

      export function add(item: string) {
            const s = get().slice(0, 10);
            localStorage.setItem(key, JSON.stringify([item, ...s]));
      }
}