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
    slots: ["buttons"],
    setup(props, { emit, slots, expose }) {
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");
      const Tag = AdvancedSearch<Row, Search>();
      const editFormInstance = ref();
      const editFormDestroy = ref<() => void>();
      const advancedSearch = ref<ReturnType<typeof AdvancedSearch>>();
      const searchValueBuildFunc = inject<() => Search>(
        "searchValueBuildFunc"
      )!;
      const currTableSymbol = inject<symbol>("currTableSymbol");

      function create() {
        const target = mountComponent(TableViewEdit(), {
          currentConfig,
          row: {},
          currentTableSymbol: currTableSymbol,
        });

        editFormDestroy.value = target.destroy;
        editFormInstance.value = target.instance;
      }

      function destroyEditForm(evt: CustomEvent<{ id: symbol }>) {
        evt.detail.id === currTableSymbol && editFormDestroy.value?.();
      }

      function editFormSubmitFinished(evt: CustomEvent<{ id: symbol }>) {
        evt.detail.id === currTableSymbol && emit("doSearch");
      }

      function editRow(row: Dictionary) {
        const target = mountComponent(TableViewEdit(), {
          currentConfig,
          row,
          currentTableSymbol: currTableSymbol,
        });

        editFormDestroy.value = target.destroy;
        editFormInstance.value = target.instance;
      }

      async function setAdvancedSearch(search: Record<string, unknown>) {
        await advancedSearch.value?.setAdvancedSearch(search);
      }

      function updateCurrEditForm(form: Record<string, unknown>) {
        editFormInstance.value.updateCurrEditForm(form);
      }

      const exportButtonRef = ref<typeof ElButton & HTMLElement>();
      async function exportData() {
        if (currentConfig?.value.exportUseBuildInMethod === false) {
          if (typeof currentConfig?.value.onClickExport === "function") {
            const exportButtonLoadingInstance = ElLoading.service({
              target: exportButtonRef.value,
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
        create,
        editRow,
        setAdvancedSearch,
        updateCurrEditForm,
        exportData,
      });

      return () => (
        <div class="table-view__header">
          {((currentConfig?.value.useAdvancedSearch ?? true) ||
            slots.formControlsButtons) && (
            <Tag
              ref={advancedSearch}
              style={{
                minHeight: currentConfig?.value.advancedSearchDefaultHeight,
                width: "100%",
              }}
              onDoSearch={() => emit("doSearch")}
              onSearchChange={(val: Search) => emit("searchChange", val)}
              onCreate={create}
              onExportData={exportData}
            >
              {{ formControlsButtons: slots.formControlsButtons }}
            </Tag>
          )}
          <div class="table-view__header-toolbar">
            {currentConfig?.value.useBuildInCreate &&
            currentConfig?.value.useAdvancedSearch === false ? (
              <ElButton type="primary" onClick={create}>
                {currentConfig?.value.buildInCreateButtonText || "Create"}
              </ElButton>
            ) : undefined}

            {currentConfig?.value.useExport &&
              currentConfig?.value.useAdvancedSearch === false && (
                <ElButton
                  ref={exportButtonRef}
                  type="primary"
                  onClick={exportData}
                  {...(currentConfig?.value?.exportButtonProps ?? {})}
                >
                  {currentConfig?.value.exportButtonText || "Export"}
                </ElButton>
              )}
            {slots.buttons?.()}
          </div>
        </div>
      );
    },
  });
