import FormMixin, { FormMixinsProps } from "./FormMixin";
import { computed, defineComponent } from "vue";
import type { Dictionary } from "../../../../config";
import { BaseFormType } from "../../../../config";
import { ElDatePicker } from "element-plus";
import type EditForm from "../../../../config/create";

export default defineComponent({
  name: "DateRangeForm",
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

    const info = currInfo as EditForm<
      Dictionary,
      BaseFormType.DateRangePicker | BaseFormType.DateTimeRangePicker
    >;
    const showTime = computed(
      () => info.type === BaseFormType.DateTimeRangePicker
    );
    const type = computed(() =>
      info.type === BaseFormType.DateRangePicker ? "daterange" : "datetimerange"
    );
    const currentPlaceholder = computed(() =>
      placeholder ? (placeholder as unknown as string[]) : ["Start", "End"]
    );
    const format = computed(
      () => info.extraConfig?.format ?? "yyyy-MM-dd HH:mm"
    );

    return (
      <ElDatePicker
        model-value={currentValue}
        class="full-width"
        type={type.value}
        allow-clear={true}
        show-time={showTime.value}
        start-placeholder={currentPlaceholder.value[0]}
        end-placeholder={currentPlaceholder.value[1]}
        range-separator={info.extraConfig?.rangeSeparator || "~"}
        value-format={format.value}
        format={format.value}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
