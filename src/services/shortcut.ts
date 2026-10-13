type Shortcut = {
      key: string;
      ctrl?: boolean;
      shift?: boolean;
      alt?: boolean;
      meta?: boolean;
};

type ShortcutCallback = (event: KeyboardEvent) => void;

export class Shortcuts {
      private readonly isMac =
            /Mac|iPhone|iPad|iPod/.test(navigator.platform);

      private shortcuts = new Map<string, ShortcutCallback>();

      private normalize(shortcut: Shortcut): string {
            return [
                  shortcut.key.toLowerCase(),
                  shortcut.ctrl ? "ctrl" : "",
                  shortcut.shift ? "shift" : "",
                  shortcut.alt ? "alt" : "",
                  shortcut.meta ? "meta" : ""
            ].join("+");
      }

      register(
            shortcut: Shortcut,
            callback: ShortcutCallback
      ): void {
            this.shortcuts.set(this.normalize(shortcut), callback);
      }

      unregister(shortcut: Shortcut): void {
            this.shortcuts.delete(this.normalize(shortcut));
      }

      listen(): void {
            window.addEventListener("keydown", event => {
                  const key = event.key.toLowerCase();

                  const shortcut = this.normalize({
                        key,
                        ctrl: event.ctrlKey,
                        shift: event.shiftKey,
                        alt: event.altKey,
                        meta: event.metaKey
                  });

                  const callback = this.shortcuts.get(shortcut);

                  if (callback) {
                        event.preventDefault();
                        callback(event);
                  }
            });
      }
      unregisterCrossPlatform(
            key: string,
            options: {
                  shift?: boolean;
                  alt?: boolean;
            } = {}
      ): void {
            this.unregister({
                  key,
                  ctrl: !this.isMac,
                  meta: this.isMac,
                  shift: options.shift,
                  alt: options.alt
            });
      }

      registerCrossPlatform(
            key: string,
            callback: ShortcutCallback,
            options: {
                  shift?: boolean;
                  alt?: boolean;
            } = {}
      ): void {
            this.register({
                  key,
                  ctrl: !this.isMac,
                  meta: this.isMac,
                  shift: options.shift,
                  alt: options.alt
            }, callback);
      }
}