import type { Config, Dictionary } from "../../config";
import { defineComponent, inject, ref } from "vue";
import { AdvancedSearch } from "./AdvancedSearch";

export const TableViewHeader = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableViewHeader",
    emits: ["do-search", "do-reset"],
    setup(props, { emit }) {
      const advancedSearchRef = ref<typeof AdvancedSearch | null>(null);
      const currentConfig = inject<Config<Row, Search>>("currentConfig");
      const Tag = AdvancedSearch<Row, Search>();

      return () => (
        <div class="table-view__header">
          {currentConfig?.useAdvancedSearch === false ? undefined : (
            <Tag
              ref={advancedSearchRef}
              on-do-search={() => emit("do-search")}
              on-do-reset={() => emit("do-reset")}
            />
          )}
          <div class="table-view__header-toolbar" />
        </div>
      );
    },
  });
