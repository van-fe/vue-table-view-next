import FormMixin, { FormMixinsProps } from "./FormMixin";
import { defineComponent, ref, watch } from "vue";
import type {
  BaseFormType,
  CascaderData,
  Dictionary,
} from "../../../../config";
import { ElCascader, ElMessage } from "element-plus";
import type EditForm from "../../../../config/create";

export default defineComponent({
  name: "CascaderForm",
  props: FormMixinsProps,
  async setup(props) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
      watchFunc,
      setCurrentValue,
    } = new FormMixin(props);
    init();

    const emits = defineEmits(["update:modelValue"]);

    const cascaderOption = ref<CascaderData[]>([]);
    const hasInitOption = ref(false);

    watchFunc.currentValue = async (val: string[]) => {
      if (val.length && val[val.length - 1] === "empty") {
        val = [];
      }
      await checkDynamicLastChildExists(val);
      emits("update:modelValue", val);
    };

    watch(
      cascaderOption,
      async () => {
        if (!hasInitOption.value) {
          await checkDynamicLastChildExists(currentValue as string[]);
        }
      },
      {
        deep: true,
      }
    );

    const info = currInfo as EditForm<Dictionary, BaseFormType.Cascader>;

    async function setCascaderOptions(): Promise<void> {
      if (info.extraConfig?.async === true) {
        cascaderOption.value = await info.extraConfig.asyncFunc!();
      } else if (info.extraConfig?.cascaderData) {
        cascaderOption.value = info.extraConfig.cascaderData;
      }
    }

    async function loadData(selectedOptions: CascaderData[]): Promise<void> {
      if (info.extraConfig?.async === true) {
        if (typeof info.extraConfig.asyncFunc! !== "function") {
          ElMessage.error(
            "The asynchronously loaded data passed in is not a function"
          );
        } else {
          const targetOption = selectedOptions[selectedOptions.length - 1];
          targetOption.loading = true;
          const data = await info.extraConfig.asyncFunc(
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
          cascaderOption.value = [...cascaderOption.value];
        }
      }
    }

    async function checkDynamicLastChildExists(val: string[]): Promise<void> {
      if (info.extraConfig?.async === true && cascaderOption.value.length) {
        const firstLevel = cascaderOption.value.find(
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
              thirdLevel.children = await info.extraConfig.asyncFunc!(
                val.slice(0, -1)
              );
              hasInitOption.value = true;
            }
          }
        }
      } else {
        return Promise.resolve();
      }
    }

    await setCascaderOptions();

    return (
      <ElCascader
        model-value={currentValue}
        options={cascaderOption.value}
        expand-trigger="hover"
        change-on-select={false}
        placeholder={placeholder}
        load-data={loadData}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
