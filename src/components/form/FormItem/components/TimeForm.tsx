import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Ref } from "vue";
import { computed, defineComponent } from "vue";
import type { BaseFormType, Dictionary, EditForm } from "@/config";
import { ElTimePicker } from "element-plus";

export default defineComponent({
  name: "TimeForm",
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

    const info = currInfo as Ref<EditForm<Dictionary, BaseFormType.TimePicker>>;
    const format = computed(() => info.value.extraConfig?.format ?? "HH:mm");
    const currentPlaceholder = computed(
      () => placeholder.value || "Please Choose"
    );

    return () => (
      <ElTimePicker
        model-value={currentValue.value}
        class="full-width"
        placeholder={currentPlaceholder.value}
        value-format={format.value}
        format={format.value}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
