import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Ref } from "vue";
import { defineComponent, ref, watch } from "vue";
import type {
  SelectData,
  BaseFormType,
  AdvancedSearchSelectExtra,
  Dictionary,
  EditForm,
  AdvancedSearchType,
  TreeSelectData,
} from "@/config";
import { ElTreeSelect } from "element-plus";

export default defineComponent({
  name: "TreeSelectForm",
  props: FormMixinsProps,
  emits: FormMixinsEmits,
  setup(props, ctx) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
      setCurrentValue,
    } = FormMixin(props, ctx);
    init();

    const info = currInfo as Ref<
      | EditForm<Dictionary, BaseFormType.TreeSelect>
      | AdvancedSearchType<Dictionary, Dictionary, BaseFormType.TreeSelect>
    >;
    const selectData = ref<TreeSelectData[]>([]);
    const loading = ref(false);

    async function loadSelectData(search = ""): Promise<void> {
      if (typeof info.value.extraConfig?.asyncFunc === "function") {
        loading.value = true;
        selectData.value = await info.value.extraConfig?.asyncFunc(search);
        loading.value = false;
      }
    }

    watch(
      () => info.value.extraConfig,
      async (val: AdvancedSearchSelectExtra | undefined) => {
        if (val && val.selectData) {
          selectData.value = val.selectData;
        }
        if (val?.async) {
          await loadSelectData();
        }
      },
      {
        immediate: true,
      }
    );

    return () => (
      <ElTreeSelect
        model-value={currentValue.value}
        multiple={info.value.extraConfig?.multiple || false}
        collapse-tags={true}
        placeholder={placeholder.value}
        class="full-width"
        filterable={info.value.extraConfig?.filterable || false}
        loading={loading.value}
        clearable={info.value?.clearable ?? true}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
