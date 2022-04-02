import FormMixin from "./FormMixin";
import { defineComponent } from "vue";
import type { BaseFormType } from "../../../../config";
import { ElInput } from "element-plus";

export default defineComponent({
  name: "NumberForm",
  mixins: [FormMixin<BaseFormType.Number>()],
  render() {
    return (
      <ElInput
        v-model={this.currentValue}
        type="number"
        placeholder={this.placeholder}
        allow-clear={true}
        class="full-width"
        // @ts-ignore
        max={this.info.extraConfig?.max}
        min={this.info.extraConfig?.min}
      />
    );
  },
});
