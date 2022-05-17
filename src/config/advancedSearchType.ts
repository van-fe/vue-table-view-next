import type { SelectData } from "./select";
import type { BaseFormType, Dictionary } from "./common";
import type { CascaderData } from "./cascader";
import type { Component, Ref } from "vue";
import type Node from "element-plus/lib/components/tree/src/model/node";
import type { TreeData } from "element-plus/es/components/tree/src/tree.type";
import type { CascaderProps, Placement } from "element-plus";

export type AdvancedSearchDisabled<Search> =
  | boolean
  | ((curr: unknown, allSearch: Search) => boolean);

export type AdvancedSearchVisible<Search> =
  | boolean
  | ((allSearch: Search) => boolean);

export interface AdvancedSearchExtraMap<Row, Search> {
  string: AdvancedSearchStringExtra;
  textarea: AdvancedSearchStringExtra;
  number: AdvancedSearchNumberExtra;
  select: AdvancedSearchSelectExtra<Search>;
  cascader: AdvancedSearchCascaderExtra;
  "remote-search": AdvancedSearchRemoteSearchExtra<Row>;
  "tree-select": AdvancedSearchTreeSelectExtra<Row>;
  "date-picker": AdvancedSearchDateTimePickerExtra;
  "time-picker": AdvancedSearchDateTimePickerExtra;
  "date-time-picker": AdvancedSearchDateTimePickerExtra;
  "date-range-picker": AdvancedSearchDateTimeRangePickerExtra;
  "time-range-picker": AdvancedSearchDateTimeRangePickerExtra;
  "date-time-range-picker": AdvancedSearchDateTimeRangePickerExtra;
}

export interface AdvancedSearchType<
  Search extends Dictionary = Dictionary,
  Row extends Dictionary = Dictionary,
  Type extends keyof AdvancedSearchExtraMap<Row, Search> = BaseFormType
> {
  field: keyof Search & string;
  title: string;
  type: Type;
  tooltipText?: string;
  default: unknown;
  placeholder?: boolean | string | [string, string]; // if true, same as title
  clearable?: boolean; // true
  disabled?: AdvancedSearchDisabled<Search>;
  visible?: AdvancedSearchVisible<Search>;
  colSpan?: number;
  colOffset?: number;
  labelWidth?: string;
  extraConfig?: AdvancedSearchExtraMap<Row, Search>[Type];
  beforeLoad?: never;
  listenFieldsChangeToReset?: never;
  defaultValueSearchFunc?: never;
}

/**
 * for string
 */
export interface AdvancedSearchStringExtra {
  maxLength?: number;
  suffixIcon?: string;
  prefixIcon?: string;
}

/**
 * for select
 */
export type AdvancedSearchSelectAsyncFunc<Search> = (
  search?: string,
  fullSearchData?: Search
) => Promise<SelectData[]>;

export interface AdvancedSearchSelectExtra<Search> {
  selectData?: SelectData[] | Ref<SelectData[]>;
  max?: number;
  min?: number;
  multiple?: boolean;
  async?: boolean;
  asyncFunc?: AdvancedSearchSelectAsyncFunc<Search>;
  filterable?: boolean;
  optionTooltipPlacement?: Placement;
  listenFieldsToSearch?: string[];
  relyFieldsToSearch?: string[];
}

/**
 * for tree-select
 */
export type AdvancedSearchTreeSelectAsyncFunc<T> = (
  search: string,
  row?: T
) => Promise<SelectData[]>;

export interface AdvancedSearchTreeSelectExtra<T> {
  showCheckbox?: boolean;
  checkStrictly?: boolean;
  filterNodeMethod?: (value: unknown, data: TreeData, node: Node) => boolean;
  indent?: number;
  icon?: string | Component;
  props?: {
    label?: string;
    children?: string;
    disabled?: string | ((data: TreeData, node: Node) => boolean);
    isLeaf?: string | ((data: TreeData, node: Node) => boolean);
    class?: string | ((data: TreeData, node: Node) => boolean);
  };
  defaultExpandAll?: boolean;
  expandOnClickNode?: boolean;
  checkOnClickNode?: boolean;
  draggable?: boolean;
  allowDrag?: (node: Node) => boolean;
  allowDrop?: (
    draggingNode: Node,
    dropNode: Node,
    type: "prev" | "inner" | "next"
  ) => boolean;
  selectData?: SelectData[];
  asyncFunc: AdvancedSearchTreeSelectAsyncFunc<T>;
  max?: number;
  min?: number;
  multiple?: boolean;
  async?: boolean;
  filterable?: boolean;
  optionTooltipPlacement?: Placement;
}

/**
 * for cascader
 */
export interface AdvancedSearchCascaderExtra {
  cascaderData?: CascaderData[] | Ref<CascaderData[]>;
  max?: number;
  min?: number;
  multiple?: boolean;
  async?: boolean;
  asyncFunc?: (selectedOptions?: unknown) => Promise<CascaderData[]>;
  props?: CascaderProps;
}

/**
 * for number
 */
export interface AdvancedSearchNumberExtra {
  min?: number;
  max?: number;
}

/**
 * for date-picker/time-picker/date-time-picker
 */
export interface AdvancedSearchDateTimePickerExtra {
  min?: string;
  max?: string;
  format?: string;
  pickerOptions?: Dictionary;
}

/**
 * for date-range-picker/time-range-picker/date-time-range-picker
 */
export interface AdvancedSearchDateTimeRangePickerExtra {
  min?: [string, string];
  max?: [string, string];
  format?: string;
  rangeSeparator?: string;
}

/**
 * for remote-search
 */
export interface AdvancedSearchRemoteSearchExtra<Row> {
  searchFunc?: (searchVal: string, row: Row) => Promise<SelectData[]>;
  debounce?: number; // millisecond
}
