import FormMixin from "./FormMixin";
import { defineComponent } from "vue";
import type { BaseFormType } from "../../../../config";
import { ElTimePicker } from "element-plus";

export default defineComponent({
  name: "TimeRangeForm",
  mixins: [FormMixin<BaseFormType.TimeRangePicker>()],
  computed: {
    format() {
      return this.info.extraConfig?.format ?? "HH:mm";
    },
    currentPlaceholder() {
      return this.placeholder
        ? (this.placeholder as unknown as [string, string])
        : ["Start", "End"];
    },
  },
  render() {
    return (
      <ElTimePicker
        v-model={this.currentValue}
        class="full-width"
        is-range={true}
        value-format={this.format}
        format={this.format}
        start-placeholder={this.currentPlaceholder[0]}
        end-placeholder={this.currentPlaceholder[1]}
      />
    );
  },
});
