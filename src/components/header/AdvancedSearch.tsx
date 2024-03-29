import type { Config, Dictionary } from "@/config";
import type { Component, Ref, VNode } from "vue";
import { defineComponent, inject, nextTick, reactive, ref, watch } from "vue";
import { cloneDeep } from "lodash-es";
import {
  ElRow,
  ElCol,
  ElButton,
  ElForm,
  ElFormItem,
  ElIcon,
} from "element-plus";
import { FormItemComponent } from "@/components/form";
import { ArrowDown } from "@element-plus/icons-vue";
import Export from "@/assets/icon/export.svg";

export const AdvancedSearch = <
  Row extends Dictionary,
  Search extends Dictionary
>() =>
  defineComponent({
    name: "AdvancedSearch",
    emits: ["doSearch", "searchChange", "exportData", "create"],
    setup(props, { emit, expose, slots }) {
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");
      const defaultRequestParams = reactive<Dictionary>({});
      const search = ref<Dictionary>({});
      const isExpand = ref(false);

      isExpand.value = !(currentConfig?.value.advancedSearchNeedExpand ?? true);
      createDefaultRequestParams();
      search.value = cloneDeep(defaultRequestParams);
      emit("searchChange", search.value);

      const exportButtonRef = ref<typeof ElButton>();
      async function exportData() {
        emit("exportData");
      }

      function createControllerFormItem(restCol = 24): VNode {
        return (
          <ElCol
            class="search-button__wrapper"
            span={
              currentConfig?.value.advancedSearchControlFormColumnSpan ||
              restCol - currentConfig!.value.advancedSearchFormColumnOffset!
            }
            offset={currentConfig!.value.advancedSearchFormColumnOffset!}
          >
            <ElFormItem labelWidth={0}>
              {{
                label: () => <span />,
                default: () => (
                  <>
                    {currentConfig?.value.useExport ? (
                      <ElButton
                        ref={exportButtonRef}
                        text
                        onClick={exportData}
                        {...(currentConfig?.value?.exportButtonProps ?? {})}
                      >
                        <img
                          src={Export}
                          alt="export icon"
                          style={{ marginRight: "10px" }}
                        />
                        {currentConfig?.value.exportButtonText || "Export"}
                      </ElButton>
                    ) : undefined}
                    {slots.formControlsButtons?.()}
                    {currentConfig?.value.useBuildInCreate ? (
                      <ElButton type="primary" onClick={() => emit("create")}>
                        {currentConfig?.value.buildInCreateButtonText ||
                          "Create"}
                      </ElButton>
                    ) : undefined}
                    {currentConfig!.value.advancedSearchNeedExpand &&
                      (currentConfig?.value.useAdvancedSearch ?? true) && (
                        <ElButton type="text" onClick={doExpand}>
                          {currentConfig!.value.expandButtonText}
                          <ElIcon class="el-icon--right">
                            <ArrowDown />
                          </ElIcon>
                        </ElButton>
                      )}
                    {(currentConfig?.value.useAdvancedSearch ?? true) && (
                      <>
                        <ElButton type="primary" plain onClick={doReset}>
                          {currentConfig!.value.resetSearchButtonText}
                        </ElButton>
                        <ElButton type="primary" native-type="submit">
                          {currentConfig!.value.searchButtonText}
                        </ElButton>
                      </>
                    )}
                  </>
                ),
              }}
            </ElFormItem>
          </ElCol>
        );
      }

      function createSearchFormItems(): VNode[] {
        const Tag = FormItemComponent<Row, Search>() as Component;
        const chunks: VNode[] = [];

        (currentConfig?.value.advancedSearch || []).map((item) => {
          chunks.push(
            <ElCol
              v-show={
                typeof item.visible === "function"
                  ? item.visible(search.value as Search)
                  : item.visible ?? true
              }
              span={
                item.colSpan ||
                currentConfig?.value.advancedSearchFormColumnSpan
              }
              offset={
                item.colOffset ||
                currentConfig?.value.advancedSearchFormColumnOffset
              }
            >
              {
                // @ts-ignore
                <Tag
                  model-value={search!.value[item.field]}
                  info={item}
                  instance-value={search!.value}
                  label-col={item.labelWidth ?? "auto"}
                  onUpdate:model-value={(val: unknown) =>
                    (search!.value[item.field] = val)
                  }
                />
              }
            </ElCol>
          );
        });

        return chunks;
      }

      function chunkFormItems(): VNode[] {
        const results = createSearchFormItems();
        if (
          currentConfig?.value.advancedSearchButtonsPosition === "first-line"
        ) {
          let count = 0;
          let hasInserted = false;

          for (
            let i = 0;
            i < (currentConfig.value.advancedSearch || []).length;
            i++
          ) {
            const item = (currentConfig.value.advancedSearch || [])[i];
            const subtract =
              count +
              (currentConfig.value.advancedSearchFormColumnSpan! +
                currentConfig.value.advancedSearchFormColumnOffset!);

            if (subtract >= 24) {
              hasInserted = true;
              results.splice(i, 0, createControllerFormItem());
              count = 0;
            } else {
              count +=
                (item.colSpan ||
                  currentConfig.value.advancedSearchFormColumnSpan ||
                  0) +
                (item.colOffset ||
                  currentConfig.value.advancedSearchFormColumnOffset ||
                  0);
            }
          }

          if (!hasInserted) {
            results.push(createControllerFormItem(24 - count));
          }
        } else {
          let count = 0;
          for (
            let i = 0;
            i < (currentConfig!.value.advancedSearch || []).length;
            i++
          ) {
            const item = currentConfig!.value.advancedSearch![i];
            count +=
              (item.colSpan ||
                currentConfig!.value.advancedSearchFormColumnSpan ||
                0) +
              (item.colOffset ||
                currentConfig!.value.advancedSearchFormColumnOffset ||
                0);
          }

          count %= 24;
          const restSpan = 24 - count;

          results.push(
            createControllerFormItem(
              restSpan +
                (currentConfig?.value.advancedSearchControlFormColumnSpan ||
                  currentConfig!.value.advancedSearchFormColumnSpan!) >
                24
                ? 24
                : restSpan
            )
          );
        }

        return results;
      }

      function createDefaultRequestParams(): void {
        if (Object.keys(defaultRequestParams).length === 0) {
          currentConfig?.value.advancedSearch?.forEach((item) => {
            defaultRequestParams[item.field] =
              typeof item.default === "function"
                ? item.default()
                : item.default ?? "";
          });
        }
      }

      function doExpand(): void {
        isExpand.value = !isExpand.value;
      }

      function doSearch(e: Event): void {
        e.preventDefault();
        emit("doSearch");
      }

      function doReset(): void {
        search.value = cloneDeep(defaultRequestParams);
        if (currentConfig?.value.getListAfterReset) {
          emit("searchChange", search.value);
          emit("doSearch");
        }
      }

      watch(
        search,
        (val) => {
          emit("searchChange", val);
        },
        {
          deep: true,
        }
      );

      async function setAdvancedSearch(s: Record<string, unknown>) {
        search.value = { ...search.value, ...s };
        await nextTick(() => {});
      }

      expose({
        setAdvancedSearch,
      });

      return () => (
        <div class="table-view__header-advanced-search">
          <ElForm
            class={isExpand.value ? "expanded" : "collapsed"}
            label-width={currentConfig?.value.advancedSearchLabelWidth}
            label-suffix={currentConfig?.value.advancedSearchLabelSuffix}
            label-position={currentConfig?.value.advancedSearchLabelPosition}
            size={currentConfig?.value.advancedSearchFormSize}
            // @ts-ignore
            onSubmit={doSearch}
          >
            <ElRow gutter={currentConfig?.value.advancedSearchFormRowGutter}>
              {...chunkFormItems()}
            </ElRow>
          </ElForm>
        </div>
      );
    },
  });
