export type ColumnCallbackParams<Row = any, Column = any> = {
  row: Row;
  rowIndex: number;
  $rowIndex: number;
  column: Column;
  columnIndex: number;
  $columnIndex: number;
};

export type ColumnFormatterParam<Row = any, Column = any> = {
  cellValue: unknown;
  row: Row;
  column: Column;
};

export type ColumnFormatter<Row = any, Column = any> = (
  params: ColumnFormatterParam<Row, Column>
) => string;
