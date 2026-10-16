import { Icons } from "./icons.js";
import type { ExportMenu } from "./export_menu.js";
import { Provider } from "../lib/provider.js";
import { Router } from "../lib/router.js";

type TopBarArgs = {
      save: () => void;
      exportMenu: ReturnType<typeof ExportMenu>;
};
interface ItemBuilder {
      addItem(key: string, item: { icon: string, active: () => boolean, onRun: () => void }): ItemBuilder
}
export interface GroupBuilder {
      build(): unknown[];
      addGroup(key: string, value: string): ItemBuilder
}
export function TopBar({ save, exportMenu }: TopBarArgs) {
      return (builder: GroupBuilder) => {
            builder
                  .addGroup("file", "File")
                  .addItem("home", { icon: Icons.Home, active: () => false, onRun: () => Provider.of(Router).goto('/') })
                  .addItem("save", { icon: Icons.Save, active: () => false, onRun: save })
                  .addItem("export", {
                        icon: Icons.Export, // add this icon to icons.js
                        active: () => false,
                        onRun: () => exportMenu.toggle(),
                  });
            const groups = builder.build();
            groups.unshift(groups.pop());
      };
}