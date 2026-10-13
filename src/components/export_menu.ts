import { Component, Provider } from "../lib/index.js";
import { column, Theme } from "../theme";

const { div, b } = Component;

export const EXPORT_FORMATS = [
      { id: "html", label: "HTML", ext: ".html" },
      { id: "docx", label: "Word", ext: ".docx" },
      { id: "pdf", label: "PDF", ext: ".pdf" },
      { id: "epub", label: "EPUB", ext: ".epub" },
      { id: "latex", label: "LaTeX", ext: ".tex" },
] as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[number]["id"];

type Args = {
      onSelect?: (format: ExportFormat) => void;
};

export function ExportMenu({ onSelect }: Args) {
      function click(id: ExportFormat) {
            close();
            onSelect?.(id);
      }
      const menu = div({ style: `display: none; position: fixed; top: 56px; right: 16px; z-index: 1000; min-width: 180px; padding: 6px; border-radius: 8px; background: var(--crepe-color-surface, ${Provider.of(Theme).background}); box-shadow: 0 4px 16px rgba(0,0,0,.4); ${column()}`, },
            b({ style: "font-size: 11px; opacity: .7; padding: 4px 8px" }, "Export as"),
            ...EXPORT_FORMATS.map((f) =>
                  div({ title: `export as ${f.label}`, style: "display: flex; justify-content: space-between; gap: 16px; padding: 6px 8px; border-radius: 4px; cursor: pointer", click: () => click(f.id), },
                        f.label,
                        div({ style: "opacity: .5" }, f.ext)
                  )
            )
      );

      document.body.append(menu);

      const onOutside = (e: Event) => {
            if (!menu.contains(e.target as Node)) close();
      };
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();

      function open() {
            menu.style.display = "flex";
            // deferred so the click that opened the menu doesn't immediately close it
            setTimeout(() => {
                  document.addEventListener("mousedown", onOutside);
                  document.addEventListener("keydown", onKey);
            });
      }
      function close() {
            menu.style.display = "none";
            document.removeEventListener("mousedown", onOutside);
            document.removeEventListener("keydown", onKey);
      }
      function toggle() {
            menu.style.display === "none" ? open() : close();
      }
      function destroy() {
            close();
            menu.remove();
      }

      close();
      return { open, close, toggle, destroy };
}