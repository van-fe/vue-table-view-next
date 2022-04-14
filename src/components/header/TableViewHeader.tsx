import type { Config, Dictionary } from "@/config";
import type { Ref } from "vue";
import { defineComponent, inject, onBeforeUnmount, onMounted, ref } from "vue";
import { AdvancedSearch } from "@/components";
import { ElButton } from "element-plus";
import { TableViewEdit } from "@/components/header/TableViewEdit";
import mountComponent from "@/utils/mountComponent";

export const TableViewHeader = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableViewHeader",
    emits: ["doSearch", "searchChange", "doCreate"],
    setup(props, { emit, slots }) {
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");
      const Tag = AdvancedSearch<Row, Search>();
      const editFormDestroy = ref<ReturnType<typeof mountComponent>>();

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

      function editRow(e: CustomEvent<{ row: Dictionary }>) {
        editFormDestroy.value = mountComponent(TableViewEdit(), {
          currentConfig,
          row: e.detail.row,
        });
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
        window.addEventListener("vue-table-view-edit-row", editRow);
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
        window.removeEventListener("vue-table-view-edit-row", editRow);
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
            <ElButton
              v-show={currentConfig?.value.useBuildInCreate}
              type="primary"
              onClick={create}
            >
              {currentConfig?.value.buildInCreateButtonText || "Create"}
            </ElButton>
            {slots.buttons?.()}
          </div>
        </div>
      );
    },
  });
