import type {
  CheckboxChangedRecords,
  Config,
  Dictionary,
  ColumnFormatterParam,
  Column,
} from "@/config";
import type { Ref, Slot, VNode } from "vue";
import { defineComponent, inject } from "vue";
import { Fixed } from "@/config";
import { Table as VxeTable, Column as VxeColumn } from "vxe-table";
import { Operations } from "./Operations";

export const TableViewBody = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableViewBody",
    setup() {
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");
      const dataList = inject<Ref<Row[]>>("dataList");

      function specialColumnRender(): Array<VNode | undefined> {
        return [
          currentConfig?.value.needCheckbox ? (
            <vxe-column
              type="checkbox"
              width="40"
              fixed="left"
              align="center"
            />
          ) : undefined,
          currentConfig?.value.needRadio ? (
            <vxe-column type="radio" width="40" fixed="left" align="center" />
          ) : undefined,
          currentConfig?.value.needSeq ? (
            <vxe-column type="seq" title="编号" width="80" fixed="left" />
          ) : undefined,
        ];
      }

      function columnRender(): VNode[] {
        return (currentConfig?.value.columns || []).map((column, index) => {
          if (index === 0) {
            return (
              <VxeColumn
                field={column.field}
                title={column.title}
                fixed={column.fixed === true ? Fixed.Left : column.fixed}
                type={column.type}
                width={column.width}
                min-width={column.minWidth}
                align={column.align}
                header-align={column.titleAlign}
                resizable={column.resizable}
                show-overflow={column.showOverflow}
                show-header-overflow={column.showHeaderOverflow}
                class-name={column.className}
                header-class-name={column.headerClassName}
                formatter={(params: ColumnFormatterParam) =>
                  columnFormatter(params, column)
                }
                {...{
                  scopedSlots: columnScopedSlots(column),
                }}
              />
            );
          } else {
            return (
              <VxeColumn
                field={column.field}
                title={column.title}
                width={column.width}
                min-width={column.minWidth}
                align={column.align}
                header-align={column.titleAlign}
                resizable={column.resizable}
                show-overflow={column.showOverflow}
                show-header-overflow={column.showHeaderOverflow}
                class-name={column.className}
                header-class-name={column.headerClassName}
                formatter={(params: ColumnFormatterParam) =>
                  columnFormatter(params, column)
                }
                {...{
                  scopedSlots: columnScopedSlots(column),
                }}
              />
            );
          }
        });
      }

      function columnFormatter(
        { cellValue, row }: ColumnFormatterParam,
        column: Column<Row>
      ): string {
        if (typeof column.format === "function") {
          return column.format(cellValue, row);
        } else {
          return cellValue as string;
        }
      }

      function columnScopedSlots(column: Column<Row>): Record<string, Slot> {
        const scopedSlots: Record<string, Slot> = {};

        if (typeof column.render === "function") {
          scopedSlots.default = (scope) => [
            column.render!(scope.row[column.field], scope.row),
          ];
        }

        return scopedSlots;
      }

      function onRadioChange(row: Row): void {
        if (typeof currentConfig?.value?.onRadioChange === "function") {
          currentConfig?.value?.onRadioChange(row);
        }
      }

      function onCheckboxChange(records: CheckboxChangedRecords<Row>): void {
        if (typeof currentConfig?.value?.onCheckboxChange === "function") {
          currentConfig?.value?.onCheckboxChange(records);
        }
      }

      const OperationsTag = Operations<Row, Search>();

      return () => (
        <div class="table-view__body">
          <VxeTable
            height="100%"
            data={dataList?.value}
            size={currentConfig?.value.size}
            stripe={currentConfig?.value.stripe}
            border={currentConfig?.value.border}
            round={currentConfig?.value.round}
            empty-text={currentConfig?.value.emptyText}
            on-checkbox-all={onCheckboxChange}
            on-radio-change={onRadioChange}
            on-checkbox-change={onCheckboxChange}
          >
            {...specialColumnRender()}
            {columnRender()}
            <OperationsTag />
          </VxeTable>
        </div>
      );
    },
  });
