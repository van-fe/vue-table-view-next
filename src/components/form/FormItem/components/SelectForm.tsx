import FormMixin, { FormMixinsProps } from "./FormMixin";
import { defineComponent, ref, watch } from "vue";
import type {
  SelectData,
  BaseFormType,
  AdvancedSearchSelectExtra,
  Dictionary,
} from "../../../../config";
import { ElOption, ElSelectV2 } from "element-plus";
import type EditForm from "../../../../config/create";

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
    } = new FormMixin(props);
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
        model-value={currentValue}
        multiple={info.extraConfig?.multiple || false}
        placeholder={placeholder}
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
