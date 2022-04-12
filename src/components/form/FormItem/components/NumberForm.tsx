import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Ref } from "vue";
import { defineComponent } from "vue";
import type { BaseFormType, Dictionary, EditForm } from "@/config";
import { ElInput } from "element-plus";

export default defineComponent({
  name: "NumberForm",
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

    const info = currInfo as Ref<EditForm<Dictionary, BaseFormType.Number>>;

    return () => (
      <ElInput
        model-value={currentValue.value}
        type="number"
        placeholder={placeholder.value}
        allow-clear={true}
        class="full-width"
        // @ts-ignore
        max={info.value.extraConfig?.max}
        min={info.value.extraConfig?.min}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
