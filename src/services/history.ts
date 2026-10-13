export namespace history {
      const key = 'history';

      export function get() {
            return JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
      }

      export function add(item: string) {
            const s = get().slice(0, 10);
            for (const path of s) {
                  if (path == item) {
                        return;
                  }
            }
            localStorage.setItem(key, JSON.stringify([item, ...s]));
      }
}