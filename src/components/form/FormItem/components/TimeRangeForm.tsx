import FormMixin, { FormMixinsProps } from "./FormMixin";
import { computed, defineComponent } from "vue";
import type { BaseFormType, Dictionary, EditForm } from "@/config";
import { ElTimePicker } from "element-plus";

export default defineComponent({
  name: "TimeRangeForm",
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

    const info = currInfo as EditForm<Dictionary, BaseFormType.TimeRangePicker>;
    const format = computed(() => info.extraConfig?.format ?? "HH:mm");
    const currentPlaceholder = computed(() =>
      placeholder
        ? (placeholder as unknown as [string, string])
        : ["Start", "End"]
    );

    return (
      <ElTimePicker
        model-value={currentValue.value}
        class="full-width"
        is-range={true}
        value-format={format.value}
        format={format.value}
        start-placeholder={currentPlaceholder.value[0]}
        end-placeholder={currentPlaceholder.value[1]}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
