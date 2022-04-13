import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Ref } from "vue";
import { computed, defineComponent } from "vue";
import type { Dictionary, EditForm } from "@/config";
import { BaseFormType } from "@/config";
import { ElDatePicker } from "element-plus";

export default defineComponent({
  name: "DateRangeForm",
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
      EditForm<
        Dictionary,
        BaseFormType.DateRangePicker | BaseFormType.DateTimeRangePicker
      >
    >;
    const showTime = computed(
      () => info.value.type === BaseFormType.DateTimeRangePicker
    );
    const type = computed(() =>
      info.value.type === BaseFormType.DateRangePicker
        ? "daterange"
        : "datetimerange"
    );
    const currentPlaceholder = computed(() =>
      placeholder ? (placeholder as unknown as string[]) : ["Start", "End"]
    );
    const format = computed(
      () => info.value.extraConfig?.format ?? "yyyy-MM-dd HH:mm"
    );

    return () => (
      <ElDatePicker
        model-value={currentValue.value}
        class="full-width"
        type={type.value}
        clearable={info.value?.clearable ?? true}
        show-time={showTime.value}
        start-placeholder={currentPlaceholder.value[0]}
        end-placeholder={currentPlaceholder.value[1]}
        range-separator={info.value.extraConfig?.rangeSeparator || "~"}
        value-format={format.value}
        format={format.value}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
