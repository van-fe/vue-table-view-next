import type { Config, Dictionary, PaginationData } from "@/config";
import type { Ref, VNode } from "vue";
import { defineComponent, inject, reactive, ref, withModifiers } from "vue";
import { cloneDeep } from "lodash-es";
import { ElCol, ElButton, ElForm, ElIcon } from "element-plus";
import { FormItemComponent } from "@/components/form";
import { ArrowDown } from "@element-plus/icons-vue";

export const AdvancedSearch = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "AdvancedSearch",
    emits: ["do-search"],
    setup(props, { emit }) {
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");
      const paginationInfo = inject<Ref<PaginationData>>("paginationInfo");
      const defaultRequestParams = reactive<Dictionary>({});
      const search = ref<Dictionary>({});
      const isExpand = ref(false);

      isExpand.value = !(currentConfig?.value.advancedSearchNeedExpand ?? true);
      createDefaultRequestParams();
      search.value = mergeRequestParams(false);

      function createSearchFormItems(chunkIn = 2): VNode[] {
        const Tag = FormItemComponent<Row, Search>();
        const chunks: VNode[][] = [];
        let tempChunks: VNode[] = [];
        const defaultSpan = 24 / chunkIn;
        let currSpan = 0;

        (currentConfig?.value.advancedSearch || []).map((item) => {
          if (
            currSpan + (item.colSpan || defaultSpan) + (item.colOffset || 0) >
            24
          ) {
            chunks.push(tempChunks);
            tempChunks = [];
            currSpan = 0;
          } else {
            currSpan += (item.colSpan || defaultSpan) + (item.colOffset || 0);

            tempChunks.push(
              <ElCol
                span={item.colSpan || defaultSpan}
                offset={item.colOffset || 0}
              >
                <Tag
                  model-value={search!.value[item.field]}
                  info={item}
                  instance-value={search!.value}
                  label-col={item.labelWidth ?? "auto"}
                  onUpdate:model-value={(val) =>
                    (search!.value[item.field] = val)
                  }
                />
              </ElCol>
            );
          }
        });

        tempChunks.length && chunks.push(tempChunks);

        return chunks.map((nodes: VNode[]) => (
          <el-row gutter={10}>{...nodes}</el-row>
        ));
      }

      function createDefaultRequestParams(): void {
        if (Object.keys(defaultRequestParams).length === 0) {
          currentConfig?.value.advancedSearch?.forEach((item) => {
            defaultRequestParams[item.field] = item.default || null;
          });
        }
      }

      function mergeRequestParams(withPageInfo = true): Dictionary {
        const search: Dictionary = cloneDeep(defaultRequestParams);

        if (withPageInfo) {
          search[currentConfig!.value.requestPageConfig!.perPage!] =
            paginationInfo?.value.perPage;
          search[currentConfig!.value.requestPageConfig!.currentPage!] =
            paginationInfo?.value.currentPage;
        }

        return { ...search, ...search };
      }
      function doExpand(): void {
        isExpand.value = !isExpand.value;
      }

      function doSearch(e: Event): Dictionary {
        e.stopPropagation();
        return search;
      }

      function doReset(): boolean {
        search.value = cloneDeep(defaultRequestParams);
        if (currentConfig?.value.getListAfterReset) {
          emit("do-search", search);
        }
        return true;
      }

      return () => (
        <div class="table-view__header-advanced-search">
          <ElForm
            class={isExpand.value ? "expanded" : "collapsed"}
            label-width="120px"
            label-suffix=":"
            size="small"
            on-submit={withModifiers(doSearch, ["prevent"])}
          >
            <ElCol span={16} class={["search-form__wrapper"]}>
              {...createSearchFormItems(3)}
            </ElCol>
            <ElCol span={6} offset={2} class="search-button__wrapper">
              {currentConfig!.value.advancedSearchNeedExpand ? (
                <ElButton type="text" on-click={doExpand}>
                  {currentConfig!.value.expandButtonText}
                  <ElIcon class="el-icon--right">
                    <ArrowDown />
                  </ElIcon>
                </ElButton>
              ) : (
                ""
              )}
              <ElButton type="primary" native-type="submit" size="small">
                {currentConfig!.value.searchButtonText}
              </ElButton>
              <ElButton size="small" on-click={doReset}>
                {currentConfig!.value.resetSearchButtonText}
              </ElButton>
            </ElCol>
          </ElForm>
        </div>
      );
    },
  });
