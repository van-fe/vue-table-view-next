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
        v-model={currentValue}
        class="full-width"
        type={type.value}
        allow-clear={true}
        show-time={showTime.value}
        start-placeholder={currentPlaceholder.value[0]}
        end-placeholder={currentPlaceholder.value[1]}
        range-separator={info.extraConfig?.rangeSeparator || "~"}
        value-format={format.value}
        format={format.value}
      />
    );
  },
});

// export default defineComponent({
//   name: "DateRangeForm",
//   mixins: [
//     FormMixin<
//       BaseFormType.DateRangePicker | BaseFormType.DateTimeRangePicker
//     >(),
//   ],
//   computed: {
//     showTime() {
//       return this.info.type === BaseFormType.DateTimeRangePicker;
//     },
//     format() {
//       return this.info.extraConfig?.format ?? "YYYY-MM-DD HH:mm";
//     },
//     pickerType() {
//       return this.info.type === BaseFormType.DateRangePicker
//         ? "daterange"
//         : "datetimerange";
//     },
//     currentPlaceholder() {
//       return this.placeholder
//         ? (this.placeholder as unknown as string[])
//         : ["Start", "End"];
//     },
//   },
//   render() {
//     return (
//       <ElDatePicker
//         v-model={this.currentValue}
//         class="full-width"
//         type={this.pickerType}
//         allow-clear={true}
//         show-time={this.showTime}
//         start-placeholder={this.currentPlaceholder[0]}
//         end-placeholder={this.currentPlaceholder[1]}
//         range-separator={this.info.extraConfig?.rangeSeparator || "~"}
//         value-format={this.format}
//         format={this.format}
//       />
//     );
//   },
// });
