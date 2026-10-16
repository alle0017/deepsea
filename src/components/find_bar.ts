import { bind, Component, Provider, react, Reactive } from "../lib/index.js";
import type { EditorView } from "prosemirror-view";
import {
      SearchQuery,
      setSearchState,
      findNext,
      findPrev,
      replaceNext,
      replaceAll,
} from "prosemirror-search";
import { Theme } from "../theme.js";

const { div, span, button, input } = Component;

const MAX_COUNT = 1000;

export interface FindBarOptions {
      getView: () => EditorView;
}


export interface FindBarElement {
    el: HTMLElement;
    open(): void;
    close(): void;
    isOpen: () => boolean;
}

const NO_MATCH = 'No results';
const ofNMatches = (n: number, current: number) => `${current || "-"} of ${n}${n >= MAX_COUNT ? "+" : ""}`;

export function FindBar({ getView }: FindBarOptions): FindBarElement {
      const opts = { caseSensitive: false, wholeWord: false, regexp: false };
      const matches = new Reactive('No results');
      const replace = bind();
      const inputStyle = `flex: 1; min-width: 0; padding: 6px 8px; color: #e5e7eb; background: ${Provider.of(Theme).background}; border: none; border-radius: 6px; outline: none; font: inherit;`;
      const btnStyle = `padding: 4px 8px; color: #e5e7eb; background: ${Provider.of(Theme).surface}; border: none; border-radius: 6px; font: inherit; font-size: 13px; cursor: pointer;`;
      const toggleOff = `${btnStyle} min-width: 30px; font-family: ui-monospace, monospace;`;
      const toggleOn = `${toggleOff} background: ${Provider.of(Theme).orange}; border-color: ${Provider.of(Theme).orange};`;

      const buildQuery = () =>
            new SearchQuery({
                  search: findInput.value,
                  replace: replace.value,
                  ...opts,
            });

      const updateCount = (query: SearchQuery) => {
            if (!findInput.value) {
                  matches.value = NO_MATCH;
                  return;
            }
            if (!query.valid) {
                  matches.value = NO_MATCH;
                  return;
            }
            const view = getView();
            let n = 0, current = 0, pos = 0;
            let m;
            while (n < MAX_COUNT && (m = query.findNext(view.state, pos))) {
                  n++;
                  if (m.from === view.state.selection.from) current = n;
                  pos = m.to > m.from ? m.to : m.to + 1;
            }
            matches.value = n === 0 ? NO_MATCH: ofNMatches(n, current);
      };

      const updateQuery = () => {
            const view = getView();
            const query = buildQuery();
            view.dispatch(setSearchState(view.state.tr, query));
            updateCount(query);
      };

      const run = (cmd: typeof findNext) => {
            const view = getView();
            cmd(view.state, view.dispatch, view);
            updateCount(buildQuery());
      };

      const toggle = (key: keyof typeof opts, label: string, title: string) => {
            const b = button(
                  {
                        type: "button",
                        title,
                        "aria-pressed": "false",
                        style: toggleOff,
                        click: () => {
                              opts[key] = !opts[key];
                              b.style.cssText = opts[key] ? toggleOn : toggleOff;
                              b.setAttribute("aria-pressed", String(opts[key]));
                              updateQuery();
                        },
                  },
                  label
            );
            return b;
      };

      const findInput = input({
            type: "text",
            placeholder: "Find",
            style: inputStyle,
            input: () => {
                  updateQuery();
                  run(findNext); // jump to first match while typing
                  findInput.focus(); // keep focus in the bar
            },
            keydown: (event: Event) => {
                  const e = event as KeyboardEvent;
                  if (e.key === "Enter") {
                        e.preventDefault();
                        run(e.shiftKey ? findPrev : findNext);
                  }
            }
      }) as HTMLInputElement;


      const el = div({ role: "search", style: `position: fixed; top: 51px; right: 24px; z-index: 9000; display: none; flex-direction: column; gap: 8px; width: 380px; max-width: calc(100vw - 48px); padding: 12px; box-sizing: border-box; color: ${Provider.of(Theme).text}; background: ${Provider.of(Theme).surface}; border: 2px solid ${Provider.of(Theme).background}; border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,.35); font-family: system-ui, sans-serif; font-size: 14px;`, },
            div({ style: `display: flex; align-items: center; gap: 6px;` },
                  findInput,
                  react([matches], () => 
                        span({ style: `min-width: 64px; color: ${Provider.of(Theme).text}; font-size: 12px; text-align: right; white-space: nowrap;`}, 
                              `${matches.value}`
                        )
                  ),
                  button({ type: "button", title: "Previous", style: btnStyle, click: () => run(findPrev) }, "↑"),
                  button({ type: "button", title: "Next", style: btnStyle, click: () => run(findNext) }, "↓"),
                  button({ type: "button", title: "Close", "aria-label": "Close find bar", style: btnStyle, click: () => api.close() }, "✕")
            ),
            div({ style: `display: flex; align-items: center; gap: 6px;` },
                  input({
                        type: "text",
                        placeholder: "Replace",
                        style: inputStyle,
                        input: updateQuery,
                        keydown: (event: Event) => {
                              const e = event as KeyboardEvent;
                              if (e.key === "Enter") {
                                    e.preventDefault();
                                    run(replaceNext);
                              }
                        },
                        ...replace.binding
                  }),
                  button({ type: "button", style: btnStyle, click: () => run(replaceNext) }, "Replace"),
                  button({ type: "button", style: btnStyle, click: () => run(replaceAll) }, "All")
            ),
            div({ style: `display: flex; gap: 6px;` },
                  toggle("caseSensitive", "Aa", "Match case"),
                  toggle("wholeWord", "ab", "Whole word"),
                  toggle("regexp", ".*", "Regular expression")
            )
      );

      const api = {
            el,
            open() {
                  el.style.display = "flex";
                  const sel = getView().state.selection;
                  if (!sel.empty) {
                        // prefill with the selected text
                        findInput.value = getView().state.doc.textBetween(sel.from, sel.to, " ");
                        updateQuery();
                  }
                  findInput.focus();
                  findInput.select();
            },
            close() {
                  el.style.display = "none";
                  findInput.value = "";
                  updateQuery(); // empty query clears highlights
                  getView().focus();
            },
            isOpen: () => el.style.display !== "none",
      };

      document.body.append(el);
      return api;
}