import { Component } from "../lib";
import { column, row } from "../theme";
import { icon, Icons } from "./icons";

const { div, } = Component

type Args = {
      open?: () => void
      create?: () => void
}

export function Actions({ open, create }: Args) {
      return div({ style: column() },
            div({ style: `align-items: center; width: 300px; ${row('20px')}`, click: open },
                  icon({ width: 64, height: 64 },
                        Icons.File
                  ),
                  'Open file'
            ),
            div({ style: `align-items: center; width: 300px; ${row('20px')}`, click: create },
                  icon({ width: 64, height: 64 },
                        Icons.NewFile
                  ),
                  'Create file'
            )
      );
}