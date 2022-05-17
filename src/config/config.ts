import type { Column } from "./column";
import type { AdvancedSearchType } from "./advancedSearchType";
import type { EditForm } from "./create";
import type { ReceivePageFieldConfig, RequestPageFieldConfig } from "./page";
import type {
  AvailableLanguage,
  CheckboxChangedEvent,
  Dictionary,
  RadioChangedEvent,
  CheckAllEvent,
  BaseFormType,
} from "./common";
import type { OperationConfig } from "./operation";
import type { EditConfig } from "@/config/edit";
import type { ButtonProps } from "element-plus";

// eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/no-unused-vars
export interface CustomListDataWrapper<Row> {}

export interface ListDataWrapper<Row> extends CustomListDataWrapper<Row> {
  [index: string]: Row[] | number;
}

export type GetListFunc<Search extends Dictionary, Row> = (
  search: Search
) => Promise<ListDataWrapper<Row>>;

export type TreeConfig<Row> = {
  rowField: string;
  parentField: string;
  children: string;
  hasChild: string;
  indent: number;
  showIcon: boolean;
  expandAll: boolean;
  expandRowKeys: string[];
  transform: boolean;
  lazy: boolean;
  loadMethod: (param: { row: Row }) => Promise<Row[]>;
};

export interface InsideGlobalConfig {
  language: AvailableLanguage;
  stripe: boolean;
  border: boolean | "default" | "full" | "outer" | "inner" | "none";
  round: boolean;
  size: "medium" | "small" | "large";
  searchButtonText: string;
  resetSearchButtonText: string;
  expandButtonText: string;
  getListAfterReset: boolean;
  needCustomColumnDisplay: boolean;
  customColumnDisplayStored: boolean;
  loadingDebounceTime: number;
  advancedSearchNeedExpand: boolean;
  advancedSearchFormSize: "default" | "small" | "large";
  advancedSearchLabelWidth: string | number; // 120px
  advancedSearchLabelSuffix: string; // :
  advancedSearchLabelPosition: "left" | "right" | "top"; // left
  advancedSearchDefaultHeight: string;
  advancedSearchButtonsPosition: "first-line" | "last-line"; // first-line
  advancedSearchFormColumnSpan: number; // 4
  advancedSearchFormColumnOffset: number; // 2
  getListAtCreated: boolean;
  emptyText: string;
  emptyRender?: () => JSX.Element;
  requestPageConfig: RequestPageFieldConfig;
  receivePageConfig: ReceivePageFieldConfig;
  appendParams?: Record<string, unknown>;
  operationConfig: OperationConfig<unknown>;
  paginationPosition: "left" | "right" | "center";
  paginationComponentProps?: Record<string, unknown>;
  usePagination: boolean; // true
  exportButtonText: string;
  exportButtonProps: Partial<ButtonProps>;
}

export type GlobalConfigType = Partial<InsideGlobalConfig>;

export interface InsideConfig<
  Row,
  Search extends Dictionary,
  Edit extends Dictionary = Dictionary
> {
  /**
   * appearance
   */
  height: string; // default 100%. You can set percentage / has unit number
  stripe: boolean;
  border: boolean | "default" | "full" | "outer" | "inner" | "none";
  round: boolean;
  size: "default" | "small" | "large";
  needPagination: boolean; // true
  searchButtonText: string; // "Search"
  resetSearchButtonText: string; // "Clear"
  expandButtonText: string; // "Expand"
  needCustomColumnDisplay: boolean; // false
  customColumnDisplayStored: boolean; // true
  loadingDebounceTime: number; // 0.5s
  emptyText: string; // "No Data"
  emptyRender: () => JSX.Element;
  needCheckbox: boolean;
  needRadio: boolean;
  needSeq: boolean;
  paginationPosition: "left" | "right" | "center";
  paginationComponentProps: Record<string, unknown>;

  /**
   * export
   */
  useExport: boolean; // false
  exportButtonText: string; // Export
  exportUseBuildInMethod: boolean; // true
  exportButtonProps: Partial<ButtonProps>;
  onClickExport: (search: Search) => Promise<void>;

  /**
   * events
   */
  onRadioChange: (evt: RadioChangedEvent<Row>) => void;
  onCheckboxChange: (evt: CheckboxChangedEvent<Row>) => void;
  onCheckAll: (evt: CheckAllEvent<Row>) => void;
  onLoadData: () => void;

  /**
   * get-list
   */
  getListAtCreated: boolean; // true
  getListFunc: GetListFunc<Search, Row>;
  requestPageConfig: Partial<RequestPageFieldConfig>;
  receivePageConfig: Partial<ReceivePageFieldConfig>;
  appendParams?: Record<string, unknown>;
  getListAfterReset: boolean; // true
  usePagination: boolean; // true
  treeConfig: Partial<TreeConfig<Row>>;

  /**
   * operations
   */
  useOperations: boolean; // true
  operationConfig: OperationConfig<Row>;

  /**
   * create/edit
   */
  useBuildInCreate: boolean; // true
  buildInCreateButtonText: string; // Create
  buildInEditConfig: EditConfig<Row, Edit>;
  editForm: EditForm<Row, BaseFormType, Edit>[];

  /**
   * column
   */
  columns: Column<Row>[];

  /**
   * advanced-search
   */
  useAdvancedSearch: boolean; // true. If you need reuse search page in dialog, this option will help you.
  advancedSearchNeedExpand: boolean; // false
  advancedSearchFormSize: "default" | "small" | "large"; // default
  advancedSearchLabelWidth: string | number; // 120px
  advancedSearchLabelSuffix: string; // :
  advancedSearchLabelPosition: "left" | "right" | "top"; // right
  advancedSearchButtonsPosition: "first-line" | "last-line"; // first-line
  advancedSearchFormColumnSpan: number; // 4
  advancedSearchFormColumnOffset: number; // 2
  advancedSearch: AdvancedSearchType<Search, Row>[];
  advancedSearchDefaultHeight: string;
}

export type Config<
  Row extends Dictionary = Dictionary,
  Search extends Dictionary = Dictionary,
  Edit extends Dictionary = Dictionary
> = Partial<InsideConfig<Row, Search, Edit>>;
