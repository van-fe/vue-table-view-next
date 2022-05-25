import type { Config, PaginationData, Dictionary } from "@/config";
import type { Ref } from "vue";
import { ElPagination } from "element-plus";
import { defineComponent, inject } from "vue";

export const TableViewFooter = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableViewFooter",
    setup() {
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");
      const paginationInfo = inject<Ref<PaginationData>>("paginationInfo");
      const currTableSymbol = inject<symbol>("currTableSymbol");

      function onCurrentChange(page: number): void {
        window.dispatchEvent(
          new CustomEvent("vue-table-view-current-page-change", {
            detail: {
              page,
              id: currTableSymbol,
            },
          })
        );
      }

      function onSizeChange(size: number): void {
        window.dispatchEvent(
          new CustomEvent("vue-table-view-page-size-change", {
            detail: {
              size,
              id: currTableSymbol,
            },
          })
        );
      }

      return () => (
        <div
          class={[
            "table-view__footer",
            currentConfig?.value.paginationPosition,
          ]}
        >
          {currentConfig?.value.needPagination === false ? (
            ""
          ) : (
            <div class="page__wrapper">
              <ElPagination
                current-page={paginationInfo?.value.currentPage}
                page-size={paginationInfo?.value.perPage}
                total={paginationInfo?.value.total}
                page-count={paginationInfo?.value.pageAmount}
                page-sizes={currentConfig?.value.requestPageConfig?.pageSizes}
                layout="total, prev, pager, next, sizes, jumper"
                {...currentConfig?.value.paginationComponentProps}
                onUpdate:current-page={onCurrentChange}
                onUpdate:page-size={onSizeChange}
              />
            </div>
          )}
        </div>
      );
    },
  });
