import { Component } from "../lib/index.js";

const { div, span, button } = Component;

export function ErrorToast(error: string, timeout = 4000) {
      const el = div({ style: `position: fixed; top: 24px; right: 24px; z-index: 10000; display: flex; align-items: flex-start; gap: 12px; width: max-content; max-width: min(420px, calc(100vw - 48px)); padding: 16px 18px; box-sizing: border-box; color: #ffe4e6; background: #27151b; border: 1px solid #7f2939; border-left: 4px solid #f43f5e; border-radius: 10px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35); font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.5; opacity: 0; transform: translateY(-8px); transition: opacity 180ms ease, transform 180ms ease;` },
            span({ style: `color: #fb7185; font-size: 18px; font-weight: 700; line-height: 1.4; flex-shrink: 0;` },
                  "!"
            ),
            div({ style: `flex: 1; min-width: 0; overflow-wrap: anywhere;` },
                  div({ style: `color: #fff1f2; font-weight: 650; margin-bottom: 3px;` },
                        "Something went wrong"
                  ),
                  div(
                        {
                              style: `color: #fda4af;`
                        },
                        error
                  )
            ),
            button({ click: () => remove(), type: "button", "aria-label": "Dismiss notification", style: `flex-shrink: 0; padding: 0 2px; border: none; background: transparent; color: #fda4af; font-size: 20px; line-height: 1; cursor: pointer;`, },
                  "x"
            )
      );

      let removed = false;
      let timer: ReturnType<typeof setTimeout>;

      const remove = () => {
            if (removed) return;
            removed = true;
            clearTimeout(timer);

            el.style.opacity = "0";
            el.style.transform = "translateY(-8px)";

            setTimeout(() => el.remove(), 180);
      };

      document.body.append(el);

      requestAnimationFrame(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
      });

      timer = setTimeout(remove, timeout);

      return el;
}