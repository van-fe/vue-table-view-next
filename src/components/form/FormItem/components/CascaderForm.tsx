import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Ref } from "vue";
import { defineComponent, ref, watch } from "vue";
import type {
  AdvancedSearchType,
  BaseFormType,
  CascaderData,
  Dictionary,
  EditForm,
} from "@/config";
import { ElCascader, ElMessage } from "element-plus";

export default defineComponent({
  name: "CascaderForm",
  props: FormMixinsProps,
  emits: FormMixinsEmits,
  async setup(props, ctx) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
      watchFunc,
      setCurrentValue,
    } = FormMixin(props, ctx);
    init();

    const cascaderOption = ref<CascaderData[]>([]);
    const hasInitOption = ref(false);

    watchFunc.currentValue = async (val: string[]) => {
      if (val.length && val[val.length - 1] === "empty") {
        val = [];
      }
      await checkDynamicLastChildExists(val);
      ctx.emit("update:modelValue", val);
    };

    watch(
      cascaderOption,
      async () => {
        if (!hasInitOption.value) {
          await checkDynamicLastChildExists(currentValue.value as string[]);
        }
      },
      {
        deep: true,
      }
    );

    const info = currInfo as Ref<
      | EditForm<Dictionary, BaseFormType.Cascader>
      | AdvancedSearchType<Dictionary, Dictionary, BaseFormType.Cascader>
    >;

    async function setCascaderOptions(): Promise<void> {
      if (info.value.extraConfig?.async === true) {
        cascaderOption.value = await info.value.extraConfig.asyncFunc!();
      } else if (info.value.extraConfig?.cascaderData) {
        cascaderOption.value = info.value.extraConfig.cascaderData;
      }
    }

    async function loadData(selectedOptions: CascaderData[]): Promise<void> {
      if (info.value.extraConfig?.async === true) {
        if (typeof info.value.extraConfig.asyncFunc! !== "function") {
          ElMessage.error(
            "The asynchronously loaded data passed in is not a function"
          );
        } else {
          const targetOption = selectedOptions[selectedOptions.length - 1];
          targetOption.loading = true;
          const data = await info.value.extraConfig.asyncFunc(
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
      if (
        info.value.extraConfig?.async === true &&
        cascaderOption.value.length
      ) {
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
              thirdLevel.children = await info.value.extraConfig.asyncFunc!(
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

    return () => (
      <ElCascader
        model-value={currentValue.value}
        options={cascaderOption.value}
        expand-trigger="hover"
        change-on-select={false}
        placeholder={placeholder.value}
        load-data={loadData}
        clearable={info.value?.clearable ?? true}
        onUpdate:model-value={setCurrentValue}
      />
    );
  },
});
