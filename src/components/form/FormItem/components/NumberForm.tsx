import FormMixin, { FormMixinsProps } from "./FormMixin";
import { defineComponent } from "vue";
import type { BaseFormType, Dictionary } from "../../../../config";
import { ElInput } from "element-plus";
import type EditForm from "../../../../config/create";

export default defineComponent({
  name: "NumberForm",
  props: FormMixinsProps,
  setup(props) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
    } = new FormMixin(props);
    init();

    const info = currInfo as EditForm<Dictionary, BaseFormType.Number>;

    return (
      <ElInput
        v-model={currentValue}
        type="number"
        placeholder={placeholder}
        allow-clear={true}
        class="full-width"
        // @ts-ignore
        max={info.extraConfig?.max}
        min={info.extraConfig?.min}
      />
    );
  },
});
