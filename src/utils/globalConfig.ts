import { AvailableLanguage } from "@/config";
import type { GlobalConfigType, InsideGlobalConfig } from "@/config";
import { merge } from "lodash-es";

class GlobalConfig {
  protected defaultConfig: InsideGlobalConfig = {
    language: AvailableLanguage.ZhCn,
    stripe: true,
    border: false,
    round: false,
    size: "medium",
    searchButtonText: "Search",
    resetSearchButtonText: "Clear",
    expandButtonText: "Expand",
    emptyText: "No Data",
    getListAfterReset: true,
    needCustomColumnDisplay: false,
    customColumnDisplayStored: true,
    loadingDebounceTime: 0.5,
    advancedSearchNeedExpand: true,
    advancedSearchFormSize: "default",
    advancedSearchDefaultHeight: "50px",
    advancedSearchLabelPosition: "right",
    advancedSearchLabelSuffix: ":",
    advancedSearchLabelWidth: "120px",
    advancedSearchButtonsPosition: "first-line",
    advancedSearchFormColumnSpan: 6,
    advancedSearchFormColumnOffset: 0,
    advancedSearchControlFormColumnSpan: 0,
    getListAtCreated: true,
    exportButtonText: "Export",
    usePagination: true,
    requestPageConfig: {
      currentPage: "pageNum",
      perPage: "pageSize",
    },
    receivePageConfig: {
      currentPage: "pageNum",
      perPage: "pageSize",
      currentPageSize: "size",
      total: "total",
      pages: "pages",
      list: "list",
    },
    operationConfig: {
      headerTitle: "Operate",
    },
    paginationPosition: "center",
    exportButtonProps: {},
  };

  public get globalConfig(): InsideGlobalConfig {
    return this.defaultConfig;
  }

  public setConfig(option: GlobalConfigType): void {
    this.defaultConfig = merge({}, this.defaultConfig, option);
  }
}

export default new GlobalConfig();
