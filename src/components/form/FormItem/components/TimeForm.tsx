import FormMixin from "./FormMixin";
import { defineComponent } from "vue";
import type { BaseFormType } from "../../../../config";
import { ElTimePicker } from "element-plus";

export default defineComponent({
  name: "TimeForm",
  mixins: [FormMixin<BaseFormType.TimePicker>()],
  computed: {
    format() {
      return this.info.extraConfig?.format ?? "HH:mm";
    },
    currentPlaceholder() {
      return this.placeholder ? (this.placeholder as string) : "Please Choose";
    },
  },
  render() {
    return (
      <ElTimePicker
        v-model={this.currentValue}
        class="full-width"
        placeholder={this.currentPlaceholder}
        value-format={this.format}
        format={this.format}
      />
    );
  },
});
