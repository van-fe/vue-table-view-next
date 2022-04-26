import type { Config, Dictionary } from "@/config";
import type { Ref } from "vue";
import { defineComponent, inject, onBeforeUnmount, onMounted, ref } from "vue";
import { AdvancedSearch } from "@/components";
import { ElButton, ElLoading } from "element-plus";
import { TableViewEdit } from "@/components/header/TableViewEdit";
import mountComponent from "@/utils/mountComponent";

export const TableViewHeader = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableViewHeader",
    emits: ["doSearch", "searchChange", "exportData"],
    setup(props, { emit, slots, expose }) {
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");
      const Tag = AdvancedSearch<Row, Search>();
      const editFormDestroy = ref<ReturnType<typeof mountComponent>>();
      const searchValueBuildFunc = inject<() => Search>(
        "searchValueBuildFunc"
      )!;

      function create() {
        editFormDestroy.value = mountComponent(TableViewEdit(), {
          currentConfig,
        });
      }

      function destroyEditForm() {
        editFormDestroy.value?.();
      }

      function editFormSubmitFinished() {
        emit("doSearch");
      }

      function editRow(row: Dictionary) {
        editFormDestroy.value = mountComponent(TableViewEdit(), {
          currentConfig,
          row,
        });
      }

      const exportButtonRef = ref<typeof ElButton>();
      async function exportData() {
        if (currentConfig?.value.exportUseBuildInMethod === false) {
          if (typeof currentConfig?.value.onClickExport === "function") {
            const exportButtonLoadingInstance = ElLoading.service({
              target: exportButtonRef.value!.ref as unknown as HTMLElement,
            });
            await currentConfig?.value.onClickExport(searchValueBuildFunc());
            exportButtonLoadingInstance.close();
          }
        } else {
          // default
          emit("exportData");
        }
      }

      onMounted(() => {
        window.addEventListener(
          "vue-table-view-destroy-edit-form",
          destroyEditForm
        );
        window.addEventListener(
          "vue-table-view-edit-form-submit-finished",
          editFormSubmitFinished
        );
      });

      onBeforeUnmount(() => {
        window.removeEventListener(
          "vue-table-view-destroy-edit-form",
          destroyEditForm
        );
        window.removeEventListener(
          "vue-table-view-edit-form-submit-finished",
          editFormSubmitFinished
        );
      });

      expose({
        editRow,
      });

      return () => (
        <div class="table-view__header">
          {currentConfig?.value.useAdvancedSearch === false ? undefined : (
            <Tag
              ref="advancedSearch"
              style={{
                minHeight: currentConfig?.value.advancedSearchDefaultHeight,
                width: "100%",
              }}
              onDoSearch={() => emit("doSearch")}
              onSearchChange={(val: Search) => emit("searchChange", val)}
            />
          )}
          <div class="table-view__header-toolbar">
            {currentConfig?.value.useBuildInCreate ? (
              <ElButton type="primary" onClick={create}>
                {currentConfig?.value.buildInCreateButtonText || "Create"}
              </ElButton>
            ) : undefined}

            {currentConfig?.value.useExport ? (
              <ElButton
                ref={exportButtonRef}
                type="primary"
                onClick={exportData}
                {...(currentConfig?.value?.exportButtonProps ?? {})}
              >
                {currentConfig?.value.exportButtonText || "Export"}
              </ElButton>
            ) : undefined}

            {slots.buttons?.()}
          </div>
        </div>
      );
    },
  });
