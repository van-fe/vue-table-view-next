import FormMixin from "./FormMixin";
import type { VNode } from "vue";
import { defineComponent } from "vue";
import type {
  SelectData,
  BaseFormType,
  AdvancedSearchSelectExtra,
} from "../../../../config";
import { ElOption, ElSelectV2 } from "element-plus";

export default defineComponent({
  name: "SelectForm",
  mixins: [FormMixin<BaseFormType.Select>()],
  data() {
    return {
      selectData: [] as SelectData[],
      loading: false,
    };
  },
  watch: {
    "info.extraConfig": {
      immediate: true,
      async handler(val: AdvancedSearchSelectExtra) {
        if (val.selectData) {
          this.selectData = val.selectData;
        }
      },
    },
  },
  render(): VNode {
    return (
      <ElSelectV2
        v-model={this.currentValue}
        multiple={this.info.extraConfig?.multiple || false}
        placeholder={this.placeholder}
        allow-clear={true}
        class="full-width"
        filterable={this.info.extraConfig?.filterable || false}
        loading={this.loading}
      >
        {this.selectData.map((item) => (
          <ElOption key={item.label} value={item.value} label={item.label}>
            {item.label}
          </ElOption>
        ))}
      </ElSelectV2>
    );
  },
});
