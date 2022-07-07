import type {
  CheckboxChangedEvent,
  Config,
  Dictionary,
  ColumnFormatterParam,
  Column,
  ColumnCallbackParams,
  RadioChangedEvent,
  CheckAllEvent,
} from "@/config";
import type { Ref, VNode } from "vue";
import { defineComponent, inject, ref } from "vue";
import { Fixed } from "@/config";
import { Table as VxeTable, Column as VxeColumn } from "vxe-table";
import { Operations } from "./Operations";

export const TableViewBody = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableViewBody",
    setup(props, { expose }) {
      const tableRef = ref();
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");
      const dataList = inject<Ref<Row[]>>("dataList");
      const loading = inject<Ref<boolean>>("loading");

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
        return (currentConfig?.value.columns || []).map((column) => {
          return (
            <VxeColumn
              v-slots={columnScopedSlots(column)}
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
              tree-node={column.treeNode}
              formatter={(params: ColumnFormatterParam) =>
                columnFormatter(params, column)
              }
            />
          );
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

      function columnScopedSlots(column: Column<Row>) {
        const scopedSlots = {
          default: (scope: ColumnCallbackParams) => (
            <span>{scope.row[column.field]}</span>
          ),
        };

        if (typeof column.renderContent === "function") {
          scopedSlots.default = (scope) =>
            column.renderContent!(scope.row[column.field], scope.row);
        } else if (typeof column.format === "function") {
          scopedSlots.default = (scope) => (
            <span>{column.format!(scope.row[column.field], scope.row)}</span>
          );
        }

        return scopedSlots;
      }

      function onRadioChange(value: RadioChangedEvent<Row>): void {
        if (typeof currentConfig?.value?.onRadioChange === "function") {
          currentConfig?.value?.onRadioChange(value);
        }
      }

      function onCheckboxChange(records: CheckboxChangedEvent<Row>): void {
        if (typeof currentConfig?.value?.onCheckboxChange === "function") {
          currentConfig?.value?.onCheckboxChange(records);
        }
      }

      function onCheckAll(records: CheckAllEvent<Row>): void {
        if (typeof currentConfig?.value?.onCheckAll === "function") {
          currentConfig?.value?.onCheckAll(records);
        }
      }

      const tableSize = ref();
      switch (currentConfig?.value.size) {
        case "default":
        default:
          tableSize.value = "small";
          break;
        case "large":
          tableSize.value = "medium";
          break;
        case "small":
          tableSize.value = "mini";
          break;
      }

      function toggleTree(expand: boolean) {
        tableRef.value?.setAllTreeExpand(expand);
      }

      expose({
        toggleAllTree: toggleTree,
        exportData: () => tableRef.value.exportData({ type: "csv" }),
        tableRef,
      });

      const slots = {
        empty() {
          return (
            currentConfig?.value.emptyRender?.() ?? (
              <span>{currentConfig?.value.emptyText}</span>
            )
          );
        },
      };

      return () => (
        <div v-loading={loading?.value} class="table-view__body">
          <VxeTable
            v-slots={slots}
            ref={tableRef}
            height="100%"
            data={dataList?.value}
            size={tableSize.value}
            stripe={currentConfig?.value.stripe}
            border={currentConfig?.value.border}
            round={currentConfig?.value.round}
            empty-text={currentConfig?.value.emptyText}
            tree-config={currentConfig?.value.treeConfig}
            onCheckboxAll={onCheckAll}
            onRadioChange={onRadioChange}
            onCheckboxChange={onCheckboxChange}
          >
            {...specialColumnRender()}
            {columnRender()}
            {currentConfig?.value.useOperations !== false
              ? Operations<Row, Search>()
              : undefined}
          </VxeTable>
        </div>
      );
    },
  });
