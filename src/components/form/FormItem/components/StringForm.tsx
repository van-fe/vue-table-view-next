import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import { ElInput } from "element-plus";
import type { Ref } from "vue";
import { defineComponent } from "vue";
import type { AdvancedSearchType, Dictionary, EditForm } from "@/config";
import { BaseFormType } from "@/config";

export default defineComponent({
  name: "StringForm",
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
      | EditForm<Dictionary, BaseFormType.String | BaseFormType.Textarea>
      | AdvancedSearchType<
          Dictionary,
          Dictionary,
          BaseFormType.String | BaseFormType.Textarea
        >
    >;

    const type = props.info?.type === BaseFormType.String ? "text" : "textarea";

    return () => (
      <ElInput
        type={type}
        model-value={currentValue.value}
        placeholder={placeholder.value}
        clearable={info.value?.clearable ?? true}
        suffix-icon={info.value.extraConfig?.suffixIcon}
        prefix-icon={info.value.extraConfig?.prefixIcon}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
