import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Ref } from "vue";
import { defineComponent, ref, watch } from "vue";
import type {
  SelectData,
  BaseFormType,
  AdvancedSearchSelectExtra,
  Dictionary,
  EditForm,
} from "@/config";
import { ElOption, ElSelect } from "element-plus";

export default defineComponent({
  name: "SelectForm",
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

    const info = currInfo as Ref<EditForm<Dictionary, BaseFormType.Select>>;
    const selectData = ref<SelectData[]>([]);
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
      <ElSelect
        model-value={currentValue.value}
        multiple={info.value.extraConfig?.multiple || false}
        collapse-tags={true}
        placeholder={placeholder.value}
        allow-clear={true}
        class="full-width"
        filterable={info.value.extraConfig?.filterable || false}
        loading={loading.value}
        clearable={true}
        onUpdate:model-value={setCurrentValue}
      >
        {selectData.value.map((item) => (
          <ElOption key={item.label} value={item.value} label={item.label}>
            {item.label}
          </ElOption>
        ))}
      </ElSelect>
    );
  },
});
