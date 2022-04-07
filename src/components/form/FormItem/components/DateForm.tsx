import FormMixin, { FormMixinsProps } from "./FormMixin";
import type { Dictionary } from "../../../../config";
import { BaseFormType } from "../../../../config";
import { computed, defineComponent } from "vue";
import { ElDatePicker } from "element-plus";
import type EditForm from "../../../../config/create";

export default defineComponent({
  name: "DateForm",
  props: FormMixinsProps,
  setup(props) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
    } = new FormMixin(props);
    init();

    const info = currInfo as EditForm<
      Dictionary,
      BaseFormType.DatePicker | BaseFormType.DateTimePicker
    >;
    const type = computed(() =>
      info.type === BaseFormType.DateTimePicker ? "datetime" : "date"
    );
    const currentPlaceholder = computed(
      () => placeholder ?? "Please Choose Datetime"
    );
    const format = computed(
      () => info.extraConfig?.format ?? "yyyy-MM-dd HH:mm"
    );

    return (
      <ElDatePicker
        v-model={currentValue}
        class="full-width"
        type={type.value}
        allow-clear={true}
        placeholder={currentPlaceholder.value}
        value-format={format.value}
        format={format.value}
        picker-options={info.extraConfig?.pickerOptions || {}}
      />
    );
  },
});

// defineComponent({
//   name: "DateForm",
//   mixins: [FormMixin<BaseFormType.DatePicker | BaseFormType.DateTimePicker>()],
//   computed: {
//     type() {
//       return this.info.type === BaseFormType.DateTimePicker
//         ? "datetime"
//         : "date";
//     },
//     format() {
//       return this.info.extraConfig?.format ?? "YYYY-MM-DD HH:mm";
//     },
//     currentPlaceholder() {
//       return this.placeholder ?? "选择日期时间";
//     },
//   },
//   render() {
//     return (
//       <ElDatePicker
//         v-model={this.currentValue}
//         class="full-width"
//         type={this.type}
//         allow-clear={true}
//         placeholder={this.currentPlaceholder}
//         value-format={this.format}
//         format={this.format}
//         picker-options={this.info.extraConfig?.pickerOptions || {}}
//       />
//     );
//   },
// });
