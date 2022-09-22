import { Header, Column, Table, Tooltip, Icon, Export } from "vxe-table";
import "xe-utils";
import type { App } from "vue";

export default {
  install(app: App) {
    app.use(Header).use(Column).use(Table).use(Tooltip).use(Icon).use(Export);
  },
};
