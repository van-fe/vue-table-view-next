import type { Config, Dictionary } from "../../config";
import type { Ref } from "vue";
import { defineComponent, defineEmits, inject, ref } from "vue";
import { AdvancedSearch } from "./AdvancedSearch";

export const TableViewHeader = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "TableViewHeader",
    setup() {
      const advancedSearchRef = ref<typeof AdvancedSearch | null>(null);
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");

      const emits = defineEmits(["do-search", "do-reset"]);

      const Tag = AdvancedSearch<Row, Search>();

      return () => (
        <div class="table-view__header">
          {currentConfig?.value.useAdvancedSearch === false ? undefined : (
            <Tag
              ref={advancedSearchRef}
              on-do-search={() => emits("do-search")}
              on-do-reset={() => emits("do-reset")}
            />
          )}
          <div class="table-view__header-toolbar" />
        </div>
      );
    },
  });
