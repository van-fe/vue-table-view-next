import FormMixin, { FormMixinsProps } from "./FormMixin";
import { computed, defineComponent } from "vue";
import type { BaseFormType, Dictionary } from "../../../../config";
import { ElTimePicker } from "element-plus";
import type EditForm from "../../../../config/create";

export default defineComponent({
  name: "TimeForm",
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

    const info = currInfo as EditForm<Dictionary, BaseFormType.TimePicker>;
    const format = computed(() => info.extraConfig?.format ?? "HH:mm");
    const currentPlaceholder = computed(() =>
      placeholder ? (placeholder as string) : "Please Choose"
    );

    return (
      <ElTimePicker
        model-value={currentValue}
        class="full-width"
        placeholder={currentPlaceholder.value}
        value-format={format.value}
        format={format.value}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
