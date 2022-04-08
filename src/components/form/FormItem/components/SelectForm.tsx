import FormMixin, { FormMixinsProps } from "./FormMixin";
import { defineComponent, ref, watch } from "vue";
import type {
  SelectData,
  BaseFormType,
  AdvancedSearchSelectExtra,
  Dictionary,
  EditForm,
} from "@/config";
import { ElOption, ElSelectV2 } from "element-plus";

export default defineComponent({
  name: "SelectForm",
  props: FormMixinsProps,
  setup(props) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
      setCurrentValue,
    } = FormMixin(props);
    init();

    const info = currInfo as EditForm<Dictionary, BaseFormType.Select>;
    const selectData = ref<SelectData[]>([]);
    const loading = ref(false);

    watch(
      () => info.extraConfig,
      (val: AdvancedSearchSelectExtra | undefined) => {
        if (val && val.selectData) {
          selectData.value = val.selectData;
        }
      },
      {
        immediate: true,
      }
    );

    return (
      <ElSelectV2
        model-value={currentValue.value}
        multiple={info.extraConfig?.multiple || false}
        placeholder={placeholder.value}
        allow-clear={true}
        class="full-width"
        filterable={info.extraConfig?.filterable || false}
        loading={loading.value}
        onUpdate:model-value={setCurrentValue}
      >
        {selectData.value.map((item) => (
          <ElOption key={item.label} value={item.value} label={item.label}>
            {item.label}
          </ElOption>
        ))}
      </ElSelectV2>
    );
  },
});
