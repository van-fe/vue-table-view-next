import FormMixin from "./FormMixin";
import { BaseFormType } from "../../../../config";
import { defineComponent } from "vue";
import { ElDatePicker } from "element-plus";

export default defineComponent({
  name: "DateForm",
  mixins: [FormMixin<BaseFormType.DatePicker | BaseFormType.DateTimePicker>()],
  computed: {
    type() {
      return this.info.type === BaseFormType.DateTimePicker
        ? "datetime"
        : "date";
    },
    format() {
      return this.info.extraConfig?.format ?? "YYYY-MM-DD HH:mm";
    },
    currentPlaceholder() {
      return this.placeholder ?? "选择日期时间";
    },
  },
  render() {
    return (
      <ElDatePicker
        v-model={this.currentValue}
        class="full-width"
        type={this.type}
        allow-clear={true}
        placeholder={this.currentPlaceholder}
        value-format={this.format}
        format={this.format}
        picker-options={this.info.extraConfig?.pickerOptions || {}}
      />
    );
  },
});
