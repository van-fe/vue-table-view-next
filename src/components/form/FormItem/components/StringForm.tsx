import FormMixin from "./FormMixin";
import { ElInput } from "element-plus";
import { defineComponent } from "vue";
import type { BaseFormType } from "../../../../config";

export default defineComponent({
  name: "StringForm",
  mixins: [FormMixin<BaseFormType.String>()],
  render() {
    return (
      <div class="string__wrapper">
        <ElInput
          v-model={this.currentValue}
          type={this.info.type}
          placeholder={this.placeholder}
          allow-clear={true}
          suffix-icon={this.info.extraConfig?.suffixIcon}
          prefix-icon={this.info.extraConfig?.prefixIcon}
        />
      </div>
    );
  },
});
