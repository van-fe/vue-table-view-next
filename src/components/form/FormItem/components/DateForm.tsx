import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Dictionary, EditForm } from "@/config";
import { BaseFormType } from "@/config";
import type { Ref } from "vue";
import { computed, defineComponent } from "vue";
import { ElDatePicker } from "element-plus";

export default defineComponent({
  name: "DateForm",
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
        BaseFormType.DatePicker | BaseFormType.DateTimePicker
      >
    >;
    const type = computed(() =>
      info.value.type === BaseFormType.DateTimePicker ? "datetime" : "date"
    );
    const currentPlaceholder = computed(
      () => placeholder.value || "Please Choose Datetime"
    );
    const format = computed(
      () => info.value.extraConfig?.format ?? "YYYY-MM-DD HH:mm"
    );

    return () => (
      <ElDatePicker
        model-value={currentValue.value}
        class="full-width"
        type={type.value}
        clearable={info.value?.clearable ?? true}
        placeholder={currentPlaceholder.value}
        value-format={format.value}
        format={format.value}
        picker-options={info.value.extraConfig?.pickerOptions || {}}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
