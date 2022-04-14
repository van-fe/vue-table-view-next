import type { Align, Fixed } from "./common";
import type { VNode } from "vue";
import type { ColumnCallbackParams } from "./vxe-table";
import type { VxeColumnPropTypes } from "vxe-table";

export type ColumnFormat<Row> = (curr: any, row: Row) => string;

export type ColumnRender<Row> = (curr: any, row: Row) => VNode;

export type ColumnClassNameCallback = (params: ColumnCallbackParams) => string;

export interface Column<Row> {
  type?: VxeColumnPropTypes.Type; // default
  field: keyof Row & string;
  title: string;
  titleAlign?: Align;
  align?: Align;
  tooltipText?: string;
  width?: number | string;
  minWidth?: number | string;
  treeNode?: boolean;
  fixed?: true | Fixed;
  sortable?: boolean;
  resizable?: boolean;
  showOverflow?: boolean;
  showHeaderOverflow?: boolean;
  className?: string | ColumnClassNameCallback;
  headerClassName?: string | ColumnClassNameCallback;
  /**
   * only for use custom display column
   */
  alwaysShow?: boolean;

  /**
   * custom format
   */
  format?: ColumnFormat<Row>;

  /**
   * custom render
   */
  render?: ColumnRender<Row>;
}
