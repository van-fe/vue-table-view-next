import type { PropType } from "vue";
import { defineComponent, onBeforeUnmount, onMounted, provide, ref } from "vue";
import { TableViewHeader } from "./header";
import { TableViewBody } from "./body";
import { TableViewFooter } from "./TableViewFooter";
import type { Config, Dictionary, PaginationData } from "@/config";
import { merge } from "lodash-es";
import GlobalConfig from "@/utils/globalConfig";

const TableView = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableView",
    props: {
      config: {
        type: Object as PropType<Config<Row, Search>>,
        required: true,
      },
    },
    setup(props) {
      const Header = TableViewHeader<Row, Search>();
      const Body = TableViewBody<Row, Search>();
      const Footer = TableViewFooter<Row, Search>();
      const headerRef = ref<typeof Header | null>(null);
      const bodyRef = ref(null);
      const footerRef = ref(null);

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

      provide("currentConfig", currentConfig);
      provide("dataList", dataList);
      provide("paginationInfo", paginationInfo);

      async function getList(): Promise<void> {
        if (typeof currentConfig.value.getListFunc !== "function") {
          throw new SyntaxError("The config => getListFunc is not a function");
        } else {
          const res = await currentConfig.value.getListFunc(
            headerRef.value?.$refs.advancedSearch.mergeRequestParams() as Search
          );

          dataList.value = res[
            currentConfig.value.receivePageConfig!.list
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
        }
      }

      function onCurrentPageChange(evt: CustomEvent<{ page: number }>): void {
        paginationInfo.value.currentPage = evt.detail.page;
        getList().then(() => {
          // ... do sth
        });
      }

      function onPageSizeChange(evt: CustomEvent<{ size: number }>): void {
        paginationInfo.value.perPage = evt.detail.size;
        getList().then(() => {
          // ... do sth
        });
      }

      function setEventListener(): void {
        window.addEventListener("current-page-change", onCurrentPageChange);
        window.addEventListener("page-size-change", onPageSizeChange);
      }

      function removeEventListener(): void {
        window.removeEventListener("current-page-change", onCurrentPageChange);
        window.removeEventListener("page-size-change", onPageSizeChange);
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

      return () => (
        <div
          class="table-view"
          style={{ height: currentConfig?.value.height ?? "100%" }}
        >
          <Header ref={headerRef} on-do-search={getList} />
          <Body ref={bodyRef} />
          <Footer ref={footerRef} />
        </div>
      );
    },
  });

export default TableView();
