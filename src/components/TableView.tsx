import type { PropType } from "vue";
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
} from "vue";
import { ElConfigProvider } from "element-plus";
import { TableViewHeader } from "./header";
import { TableViewBody } from "./body";
import { TableViewFooter } from "./TableViewFooter";
import type { Config, Dictionary, PaginationData } from "@/config";
import { AvailableLanguage } from "@/config";
import { merge } from "lodash-es";
import GlobalConfig from "@/utils/globalConfig";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const TableView = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableView",
    props: {
      config: {
        type: Object as PropType<Config<Row, Search>>,
        required: true,
      },
    },
    setup(props, { slots, expose }) {
      const currTableSymbol = Symbol();

      const Header = TableViewHeader<Row, Search>();
      const Body = TableViewBody<Row, Search>();
      const Footer = TableViewFooter<Row, Search>();
      const headerRef = ref<typeof Header | null>(null);
      const bodyRef = ref<ReturnType<typeof TableViewBody> | null>(null);
      const footerRef = ref(null);

      const loading = ref(false);
      const searchValue = ref<Search | {}>({});
      const currentConfig = ref<Config<Row, Search>>(
        merge({}, GlobalConfig.globalConfig, props.config)
      );
      const dataList = ref<Row[]>();
      const paginationInfo = ref<PaginationData>({
        currentPage: 1,
        perPage: currentConfig.value.requestPageConfig?.pageSizes?.[0] || 10,
        currentPageSize: 10,
        total: 0,
        pageAmount: 0,
      });
      const langFile = ref(
        GlobalConfig.globalConfig.language === AvailableLanguage.ZhCn
          ? zhCn
          : en
      );

      provide("currTableSymbol", currTableSymbol);
      provide("loading", loading);
      provide("currentConfig", currentConfig);
      provide("dataList", dataList);
      provide("paginationInfo", paginationInfo);
      provide("searchValueBuildFunc", buildSearchValue);

      function buildSearchValue() {
        const search: Search = {
          ...searchValue.value,
          ...(currentConfig.value.appendParams || {}),
        };

        // @ts-ignore
        search[currentConfig!.value.requestPageConfig!.perPage!] =
          paginationInfo?.value.perPage;
        // @ts-ignore
        search[currentConfig!.value.requestPageConfig!.currentPage!] =
          paginationInfo?.value.currentPage;

        return search;
      }

      async function getList(param?: Dictionary): Promise<void> {
        if (param && Object.keys(param).length > 0) {
          searchValue.value = { ...searchValue.value, ...param };
        }

        if (typeof currentConfig.value.getListFunc !== "function") {
          throw new SyntaxError("The config => getListFunc is not a function");
        } else {
          loading.value = true;
          const res = await currentConfig.value.getListFunc(buildSearchValue());
          loading.value = false;

          dataList.value = res[
            currentConfig.value.receivePageConfig!.list!
          ] as Row[];

          currentConfig.value.receivePageConfig?.currentPage &&
            (paginationInfo.value.currentPage = res[
              currentConfig.value.receivePageConfig.currentPage
            ] as number);

          currentConfig.value.receivePageConfig?.perPage &&
            (paginationInfo.value.perPage = res[
              currentConfig.value.receivePageConfig.perPage
            ] as number);

          currentConfig.value.receivePageConfig?.currentPageSize &&
            (paginationInfo.value.currentPageSize = res[
              currentConfig.value.receivePageConfig.currentPageSize
            ] as number);

          currentConfig.value.receivePageConfig?.total &&
            (paginationInfo.value.total = res[
              currentConfig.value.receivePageConfig.total
            ] as number);

          currentConfig.value.receivePageConfig?.pages &&
            (paginationInfo.value.pageAmount = res[
              currentConfig.value.receivePageConfig.pages
            ] as number);

          nextTick(() => {
            currentConfig.value.onLoadData && currentConfig.value.onLoadData();
          });
        }
      }

      function searchChange(val: Search) {
        searchValue.value = val;
      }

      function onCurrentPageChange(
        evt: CustomEvent<{ page: number; id: symbol }>
      ): void {
        if (currTableSymbol === evt.detail.id) {
          paginationInfo.value.currentPage = evt.detail.page;
          getList().then(() => {
            // ... do sth
          });
        }
      }

      function onPageSizeChange(
        evt: CustomEvent<{ size: number; id: symbol }>
      ): void {
        if (currTableSymbol === evt.detail.id) {
          paginationInfo.value.perPage = evt.detail.size;
          getList().then(() => {
            // ... do sth
          });
        }
      }

      function setEventListener(): void {
        window.addEventListener(
          "vue-table-view-current-page-change",
          onCurrentPageChange
        );
        window.addEventListener(
          "vue-table-view-page-size-change",
          onPageSizeChange
        );
      }

      function removeEventListener(): void {
        window.removeEventListener(
          "vue-table-view-current-page-change",
          onCurrentPageChange
        );
        window.removeEventListener(
          "vue-table-view-page-size-change",
          onPageSizeChange
        );
      }

      function exportData() {
        bodyRef.value?.exportData();
      }

      onMounted(async () => {
        if (currentConfig.value.getListAtCreated) {
          await getList();
        }

        setEventListener();
      });

      onBeforeUnmount(() => {
        removeEventListener();
      });

      const headerSlots = {
        buttons: () => slots.buttons?.(),
      };

      async function setAdvancedSearch(
        search: Record<string, unknown>,
        refreshList = true
      ) {
        await headerRef.value?.setAdvancedSearch(search);
        if (refreshList) {
          await getList();
        }
      }

      function updateCurrEditForm(form: Record<string, unknown>) {
        headerRef.value?.updateCurrEditForm(form);
      }

      function setListData(rows: Row[], total: number) {
        dataList.value = rows;
        paginationInfo.value.total = total;
      }

      expose({
        refreshList: getList,
        setListData,
        editRow: (row: Row) => headerRef.value?.editRow(row),
        switchLoading: (status: boolean) => (loading.value = status),
        toggleTree: (expand: boolean) => bodyRef.value?.toggleAllTree(expand),
        setAdvancedSearch,
        updateCurrEditForm,
      });

      return () => (
        <div
          class="table-view"
          style={{ height: currentConfig?.value.height ?? "100%" }}
        >
          <ElConfigProvider locale={langFile.value}>
            <Header
              ref={headerRef}
              onDoSearch={getList}
              onSearchChange={searchChange}
              onExportData={exportData}
              v-slots={headerSlots}
            />
            <Body ref={bodyRef} />
            {currentConfig.value.usePagination && <Footer ref={footerRef} />}
          </ElConfigProvider>
        </div>
      );
    },
  });

export default TableView();
