import type { Align, Fixed } from "./common";
import type { ColumnCallbackParams } from "./vxe-table";
import type { VxeColumnPropTypes } from "vxe-table";

export type ColumnFormat<Row> = (curr: any, row: Row) => string;

export type ColumnRender<Row> = (curr: any, row: Row) => JSX.Element;

export type ColumnClassNameCallback = (params: ColumnCallbackParams) => string;

export interface Column<Row, Field extends keyof Row = keyof Row> {
  type?: VxeColumnPropTypes.Type; // default
  field: Field;
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

  /**s
   * custom render-content
   */
  renderContent?: ColumnRender<Row>;
}
