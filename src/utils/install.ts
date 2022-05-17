import TableView from "@/components/TableView";
import type { GlobalConfigType } from "@/config";
import GlobalConfig from "@/utils/globalConfig";
import VxeTable from "@/plugin/vxeTable";
import type { App, Plugin } from "vue";
import ElementPlus from "@/plugin/elementPlus";

type SFCWithInstall<T> = T & Plugin;

TableView.install = (app: App, option: GlobalConfigType): void => {
  GlobalConfig.setConfig(option);
  app.use(VxeTable);
  app.use(ElementPlus);
};

export default TableView as SFCWithInstall<typeof TableView>;
