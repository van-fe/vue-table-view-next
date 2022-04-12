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
    searchButtonText: "搜索",
    resetSearchButtonText: "清空",
    expandButtonText: "展开",
    emptyText: "暂无数据",
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
    getListAtCreated: true,
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
      headerTitle: "操作",
    },
    paginationPosition: "center",
  };

  public get globalConfig(): InsideGlobalConfig {
    return this.defaultConfig;
  }

  public setConfig(option: GlobalConfigType): void {
    this.defaultConfig = merge({}, this.defaultConfig, option);
  }
}

export default new GlobalConfig();
