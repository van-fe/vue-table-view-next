import FormMixin from "./FormMixin";
import { defineComponent } from "vue";
import { BaseFormType } from "../../../../config";
import { ElDatePicker } from "element-plus";

export default defineComponent({
  name: "DateRangeForm",
  mixins: [
    FormMixin<
      BaseFormType.DateRangePicker | BaseFormType.DateTimeRangePicker
    >(),
  ],
  computed: {
    showTime() {
      return this.info.type === BaseFormType.DateTimeRangePicker;
    },
    format() {
      return this.info.extraConfig?.format ?? "YYYY-MM-DD HH:mm";
    },
    pickerType() {
      return this.info.type === BaseFormType.DateRangePicker
        ? "daterange"
        : "datetimerange";
    },
    currentPlaceholder() {
      return this.placeholder
        ? (this.placeholder as unknown as string[])
        : ["Start", "End"];
    },
  },
  render() {
    return (
      <ElDatePicker
        v-model={this.currentValue}
        class="full-width"
        type={this.pickerType}
        allow-clear={true}
        show-time={this.showTime}
        start-placeholder={this.currentPlaceholder[0]}
        end-placeholder={this.currentPlaceholder[1]}
        range-separator={this.info.extraConfig?.rangeSeparator || "~"}
        value-format={this.format}
        format={this.format}
      />
    );
  },
});
