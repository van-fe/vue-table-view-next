export type SelectData<Value = string | number> = {
  label: string;
  value: Value;
};

export type TreeSelectData = {
  label: string;
  value: string | number;
  children?: TreeSelectData[];
};
