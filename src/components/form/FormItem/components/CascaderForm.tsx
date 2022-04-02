import FormMixin from "./FormMixin";
import { defineComponent } from "vue";
import type { BaseFormType, CascaderData } from "../../../../config";
import { ElCascader, ElMessage } from "element-plus";

export default defineComponent({
  name: "CascaderForm",
  mixins: [FormMixin<BaseFormType.Cascader>()],
  data() {
    return {
      cascaderOption: [] as CascaderData[],
      hasInitOption: false,
    };
  },
  watch: {
    async currentValue(val: string[]) {
      if (val.length && val[val.length - 1] === "empty") {
        val = [];
      }
      await this.checkDynamicLastChildExists(val);
      this.$emit("input", val);
    },
    cascaderOption: {
      deep: true,
      async handler() {
        if (!this.hasInitOption) {
          await this.checkDynamicLastChildExists(this.currentValue as string[]);
        }
      },
    },
  },
  async created(): Promise<void> {
    await this.setCascaderOptions();
  },
  methods: {
    async setCascaderOptions(): Promise<void> {
      if (this.info.extraConfig?.async === true) {
        this.cascaderOption = await this.info.extraConfig.asyncFunc!();
      } else if (this.info.extraConfig?.cascaderData) {
        this.cascaderOption = this.info.extraConfig.cascaderData;
      }
    },
    async loadData(selectedOptions: CascaderData[]): Promise<void> {
      if (this.info.extraConfig?.async === true) {
        if (typeof this.info.extraConfig.asyncFunc! !== "function") {
          ElMessage.error(
            "The asynchronously loaded data passed in is not a function"
          );
        } else {
          const targetOption = selectedOptions[selectedOptions.length - 1];
          targetOption.loading = true;
          const data = await this.info.extraConfig.asyncFunc(
            selectedOptions.map((option) => option.value)
          );
          targetOption.loading = false;
          targetOption.children = data.length
            ? data
            : [
                {
                  value: "empty",
                  label: "EMPTY",
                },
              ];
          this.cascaderOption = [...this.cascaderOption];
        }
      }
    },
    async checkDynamicLastChildExists(val: string[]): Promise<void> {
      if (this.info.extraConfig?.async === true && this.cascaderOption.length) {
        const firstLevel = this.cascaderOption.find(
          (item) => item.value === val[0]
        );
        if (firstLevel) {
          const secondLevel = firstLevel.children!.find(
            (item) => item.value === val[1]
          );
          if (secondLevel) {
            const thirdLevel = secondLevel.children!.find(
              (item) => item.value === val[2]
            );
            if (thirdLevel && !thirdLevel.children?.length) {
              thirdLevel.children = await this.info.extraConfig.asyncFunc!(
                val.slice(0, -1)
              );
              this.hasInitOption = true;
            }
          }
        }
      } else {
        return Promise.resolve();
      }
    },
  },
  render() {
    return (
      <ElCascader
        v-model={this.currentValue}
        options={this.cascaderOption}
        expand-trigger="hover"
        change-on-select={false}
        placeholder={this.placeholder}
        load-data={this.loadData}
      />
    );
  },
});
