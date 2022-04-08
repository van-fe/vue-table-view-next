import FormMixin, { FormMixinsProps } from "./FormMixin";
import type { Dictionary, EditForm } from "@/config";
import { BaseFormType } from "@/config";
import { computed, defineComponent } from "vue";
import { ElDatePicker } from "element-plus";

export default defineComponent({
  name: "DateForm",
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

    const info = currInfo as EditForm<
      Dictionary,
      BaseFormType.DatePicker | BaseFormType.DateTimePicker
    >;
    const type = computed(() =>
      info.type === BaseFormType.DateTimePicker ? "datetime" : "date"
    );
    const currentPlaceholder = computed(
      () => placeholder.value || "Please Choose Datetime"
    );
    const format = computed(
      () => info.extraConfig?.format ?? "yyyy-MM-dd HH:mm"
    );

    return (
      <ElDatePicker
        model-value={currentValue.value}
        class="full-width"
        type={type.value}
        allow-clear={true}
        placeholder={currentPlaceholder.value}
        value-format={format.value}
        format={format.value}
        picker-options={info.extraConfig?.pickerOptions || {}}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
