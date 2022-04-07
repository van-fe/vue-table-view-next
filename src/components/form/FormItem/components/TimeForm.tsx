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
    } = new FormMixin(props);
    init();

    const info = currInfo as EditForm<Dictionary, BaseFormType.TimePicker>;
    const format = computed(() => info.extraConfig?.format ?? "HH:mm");
    const currentPlaceholder = computed(() =>
      placeholder ? (placeholder as string) : "Please Choose"
    );

    return (
      <ElTimePicker
        v-model={currentValue}
        class="full-width"
        placeholder={currentPlaceholder.value}
        value-format={format.value}
        format={format.value}
      />
    );
  },
});

// defineComponent({
//   name: "TimeForm",
//   mixins: [FormMixin<BaseFormType.TimePicker>()],
//   computed: {
//     format() {
//       return this.info.extraConfig?.format ?? "HH:mm";
//     },
//     currentPlaceholder() {
//       return this.placeholder ? (this.placeholder as string) : "Please Choose";
//     },
//   },
//   render() {
//     return (
//       <ElTimePicker
//         v-model={this.currentValue}
//         class="full-width"
//         placeholder={this.currentPlaceholder}
//         value-format={this.format}
//         format={this.format}
//       />
//     );
//   },
// });
