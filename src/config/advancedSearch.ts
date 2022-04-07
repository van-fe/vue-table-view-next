import type { SelectData } from "./select";
import type { BaseFormType, Dictionary } from "./common";
import type { CascaderData } from "./cascader";

export type AdvancedSearchDisabled<Search> =
  | boolean
  | ((curr: unknown, allSearch: Search) => boolean);

export interface AdvancedSearchExtraMap<Row> {
  string: AdvancedSearchStringExtra;
  textarea: AdvancedSearchStringExtra;
  number: AdvancedSearchNumberExtra;
  select: AdvancedSearchSelectExtra;
  cascader: AdvancedSearchCascaderExtra;
  "remote-search": AdvancedSearchRemoteSearchExtra<Row>;
  "date-picker": AdvancedSearchDateTimePickerExtra;
  "time-picker": AdvancedSearchDateTimePickerExtra;
  "date-time-picker": AdvancedSearchDateTimePickerExtra;
  "date-range-picker": AdvancedSearchDateTimeRangePickerExtra;
  "time-range-picker": AdvancedSearchDateTimeRangePickerExtra;
  "date-time-range-picker": AdvancedSearchDateTimeRangePickerExtra;
}

export default interface AdvancedSearch<
  Search extends Dictionary = Dictionary,
  Row extends Dictionary = Dictionary,
  Type extends keyof AdvancedSearchExtraMap<Row> = BaseFormType
> {
  field: keyof Search & string;
  title: string;
  type: Type;
  tooltipText?: string;
  default: unknown;
  placeholder?: boolean | string | [string, string]; // if true, same as title
  clearable?: boolean; // true
  disabled?: AdvancedSearchDisabled<Search>;
  colSpan?: number;
  colOffset?: number;
  labelWidth?: string;
  extraConfig?: AdvancedSearchExtraMap<Row>[Type];
  beforeLoad: never;
  listenFieldsToSearch: never;
  listenFieldsChangeToReset: never;
  defaultValueSearchFunc: never;
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
export type AdvancedSearchSelectAsyncFunc = (
  search?: string
) => Promise<SelectData[]>;

export interface AdvancedSearchSelectExtra {
  selectData?: SelectData[];
  max?: number;
  min?: number;
  multiple?: boolean;
  filterable?: boolean;
}

/**
 * for cascader
 */
export interface AdvancedSearchCascaderExtra {
  cascaderData?: CascaderData[];
  max?: number;
  min?: number;
  multiple?: boolean;
  async?: boolean;
  asyncFunc?: (selectedOptions?: unknown) => Promise<CascaderData[]>;
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
