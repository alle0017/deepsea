import { Icons } from "./icons.js";
import type { ExportMenu } from "./export_menu.js";

type TopBarArgs = {
      save: () => void;
      exportMenu: ReturnType<typeof ExportMenu>;
};
interface ItemBuilder {
      addItem(key: string, item: { icon: string, active: () => boolean, onRun: () => void }): ItemBuilder
}
interface GroupBuilder {
      addGroup(key: string, value: string): ItemBuilder
}
export function TopBar({ save, exportMenu }: TopBarArgs) {
      return (builder: GroupBuilder) => {
            builder
                  .addGroup("file", "File")
                  .addItem("save", { icon: Icons.Save, active: () => false, onRun: save })
                  .addItem("export", {
                        icon: Icons.Export, // add this icon to icons.js
                        active: () => false,
                        onRun: () => exportMenu.toggle(),
                  });
      };
}