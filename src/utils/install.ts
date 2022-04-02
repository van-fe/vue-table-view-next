import TableView from "../components/TableView";
import type { GlobalConfigType } from "../config";
import GlobalConfig from "../utils/globalConfig";
import VxeTable from "../plugin/vxeTable";
import type { App } from "vue";

TableView.install = (app: App, option: GlobalConfigType): void => {
  GlobalConfig.setConfig(option);
  app.use(VxeTable);
};

export default TableView;
