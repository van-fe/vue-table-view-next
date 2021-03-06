export enum Align {
  Left = "left",
  Center = "center",
  Right = "right",
}

export enum Fixed {
  Left = "left",
  Right = "right",
}

export enum BaseFormType {
  String = "string",
  Textarea = "textarea",
  Number = "number",
  Select = "select",
  RemoteSearch = "remote-search",
  TreeSelect = "tree-select",
  Cascader = "cascader",
  DatePicker = "date-picker",
  TimePicker = "time-picker",
  DateTimePicker = "date-time-picker",
  DateRangePicker = "date-range-picker",
  TimeRangePicker = "time-range-picker",
  DateTimeRangePicker = "date-time-range-picker",
}

export enum AvailableLanguage {
  ZhCn,
  En,
}

export type Dictionary<T = any> = {
  [key: string]: T;
};

export interface CheckAllEvent<T> {
  checked: boolean;
  records: T[];
}

export interface CheckboxChangedEvent<T> {
  records: T[];
  row: T;
}

export interface RadioChangedEvent<T> {
  newValue: T;
  oldValue: T | undefined;
  row: T;
  rowIndex: number;
}
