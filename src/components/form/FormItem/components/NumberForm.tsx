import FormMixin, { FormMixinsProps } from "./FormMixin";
import { defineComponent } from "vue";
import type { BaseFormType, Dictionary, EditForm } from "@/config";
import { ElInput } from "element-plus";

export default defineComponent({
  name: "NumberForm",
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

    const info = currInfo as EditForm<Dictionary, BaseFormType.Number>;

    return (
      <ElInput
        model-value={currentValue.value}
        type="number"
        placeholder={placeholder.value}
        allow-clear={true}
        class="full-width"
        // @ts-ignore
        max={info.extraConfig?.max}
        min={info.extraConfig?.min}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
