import { Header, Column, Table } from "vxe-table";
import "xe-utils";
import type { App } from "vue";

export default {
  install(app: App) {
    app.use(Header).use(Column).use(Table);
  },
};
