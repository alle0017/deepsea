import { history } from "../services/history";
import { Component } from "../lib";
import { column } from "../theme";
import { File } from "../services/file_system";

const { div, b, hr } = Component

type Args = {
      open?: (path: string) => void
}
export function History({ open }: Args) {
      return div({ style: `width: 300px; ${column()}` },
            b({}, 'Recent'),
            hr({ style: 'width: 100%' }),
            ...history.get().map(path => 
                  div({ style: column(), title: `open ${path}`, click: () => open?.(path) },
                        File.asName(path),
                        div({ style: 'font-size: 9px;' },
                              path
                        )
                  )
            )
      );
}