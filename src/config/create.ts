import type { SelectData } from "./select";
import type { CascaderData } from "./cascader";
import type { BaseFormType, Dictionary } from "./common";
import type {
  AdvancedSearchDateTimePickerExtra,
  AdvancedSearchDateTimeRangePickerExtra,
  AdvancedSearchDisabled,
  AdvancedSearchSelectExtra,
  AdvancedSearchStringExtra,
  AdvancedSearchTreeSelectExtra,
} from "./advancedSearchType";
import type { FormItemRule } from "element-plus/es/tokens/form";
import type { CascaderProps } from "element-plus";
import type { Ref } from "vue";

export interface EditFormExtraMap<Row> {
  string: EditFormStringExtra;
  textarea: EditFormStringExtra;
  number: EditFormNumberExtra;
  select: EditFormSelectExtra<Row>;
  cascader: EditFormCascaderExtra;
  "tree-select": EditFormTreeSelectExtra<Row>;
  "remote-search": EditFormRemoteSearchExtra<Row>;
  "date-picker": EditFormDateTimePickerExtra;
  "time-picker": EditFormDateTimePickerExtra;
  "date-time-picker": EditFormDateTimePickerExtra;
  "date-range-picker": EditFormDateTimeRangePickerExtra;
  "time-range-picker": EditFormDateTimeRangePickerExtra;
  "date-time-range-picker": EditFormDateTimeRangePickerExtra;
}

export type EditFormDisabled<Row> = AdvancedSearchDisabled<Row>;
export type EditFormVisible<Row, Edit> =
  | boolean
  | ((row: Row | null, form: Edit) => boolean);

export interface EditForm<
  Row extends Dictionary = Dictionary,
  Type extends keyof EditFormExtraMap<Row> = BaseFormType,
  Edit extends Dictionary = Dictionary
> {
  field: keyof Edit & string;
  title: string;
  type: Type;
  tooltipText?: string;
  placeholder?: boolean | string | string[] | ((value: Row) => string); // if true, same as title
  clearable?: boolean; // true
  default: unknown | Function;
  rule?: FormItemRule | FormItemRule[];
  disabled?: EditFormDisabled<Row>;
  visible?: EditFormVisible<Row, Edit>;
  colSpan?: number;
  colOffset?: number;
  listenFieldsToSearch?: string[];
  listenFieldsChangeToReset?: string[];
  defaultValueSearchFunc?: (val: unknown) => Promise<SelectData | undefined>;
  beforeLoad?: (value: unknown, row: Row | null) => unknown;
  beforeSubmit?: (value: unknown, row: Row | null) => unknown;
  renderContent?: (
    value: Row,
    callback: (result: unknown) => void
  ) => JSX.Element;
  extraConfig?: EditFormExtraMap<Row>[Type];
}

/**
 * for string
 */
export type EditFormStringExtra = AdvancedSearchStringExtra;

/**
 * for select
 */
export type EditFormSelectExtra<Row> = AdvancedSearchSelectExtra<Row>;

/**
 * for tree-select
 */
export interface EditFormTreeSelectExtra<T>
  extends AdvancedSearchTreeSelectExtra<T> {
  showCheckbox?: boolean;
}

/**
 * for cascader
 */
export interface EditFormCascaderExtra {
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
export interface EditFormNumberExtra {
  min?: number;
  max?: number;
}

/**
 * for date-picker/time-picker/date-time-picker
 */
export type EditFormDateTimePickerExtra = AdvancedSearchDateTimePickerExtra;

/**
 * for date-range-picker/time-range-picker/date-time-range-picker
 */
export type EditFormDateTimeRangePickerExtra =
  AdvancedSearchDateTimeRangePickerExtra;

/**
 * for remote-search
 */
export interface EditFormRemoteSearchExtra<Row> {
  searchFunc?: (searchVal: string, row: Row) => Promise<SelectData[]>;
  debounce?: number; // millisecond
}
