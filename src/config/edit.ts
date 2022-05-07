export interface EditConfig<Row, Edit> {
  titlePrefix?: string;
  titleSuffix?: string;
  dialogWidth?: string | number;
  dialogFooterCancelButtonText?: string;
  dialogFooterSubmitButtonText?: string;

  keyField: keyof Edit;
  rowFieldPassToKeyField?: keyof Row;
  titleCreateText?: string; // Create
  titleEditText?: string; // Edit
  formLabelWidth?: string | number;
  formLabelSuffix?: string;
  formLabelPosition?: "left" | "right" | "top"; // left
  formSize?: "default" | "small" | "large"; // default

  createFunc: (params: Edit) => Promise<object>;
  editFunc?: (params: Edit) => Promise<object>; // if not set, it will be same as createFunc
  createSuccessTips?: string | ((callback: object) => string);
  createFailTips?: string | ((callback: object) => string);
  editSuccessTips?: string | ((callback: object) => string);
  editFailTips?: string | ((callback: object) => string);

  onCreateSuccess?: Function;
  onCreateFail?: Function;
  onEditSuccess?: Function;
  onEditFail?: Function;
}
