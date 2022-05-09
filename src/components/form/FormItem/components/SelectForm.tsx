import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Ref, WatchStopHandle } from "vue";
import { defineComponent, ref, watch } from "vue";
import type {
  SelectData,
  BaseFormType,
  AdvancedSearchSelectExtra,
  Dictionary,
  EditForm,
} from "@/config";
import { ElOption, ElSelect, ElTooltip } from "element-plus";

export default defineComponent({
  name: "SelectForm",
  props: FormMixinsProps,
  emits: FormMixinsEmits,
  setup(props, ctx) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
      setCurrentValue,
      setCurrentValueToDefault,
      instanceValue,
    } = FormMixin(props, ctx);
    init();

    const info = currInfo as Ref<EditForm<Dictionary, BaseFormType.Select>>;
    const selectData = ref<SelectData[]>([]);
    const loading = ref(false);
    const enableSearch = ref(
      !info.value.extraConfig?.relyFieldsToSearch?.length
    );

    async function loadSelectData(search = ""): Promise<void> {
      if (typeof info.value.extraConfig?.asyncFunc === "function") {
        loading.value = true;
        if (enableSearch.value) {
          selectData.value = await info.value.extraConfig?.asyncFunc(
            search,
            instanceValue?.value
          );
        }
        loading.value = false;
      }
    }

    watch(
      () => info.value.extraConfig,
      async (val: AdvancedSearchSelectExtra<Dictionary> | undefined) => {
        if (val && val.selectData) {
          selectData.value = val.selectData;
        }
        if (val?.async) {
          await loadSelectData();
        }
      },
      {
        immediate: true,
      }
    );

    const watchFieldsCallback: WatchStopHandle[] = [];
    watch(
      () => info.value.extraConfig?.listenFieldsToSearch,
      (fields: string[] | undefined) => {
        if (fields) {
          let cb;
          while ((cb = watchFieldsCallback.shift())) {
            cb();
          }

          fields.forEach((field) => {
            instanceValue?.value &&
              field in instanceValue.value &&
              watchFieldsCallback.push(
                watch(
                  () => instanceValue!.value![field],
                  () => {
                    loadSelectData();
                  },
                  {
                    immediate: true,
                  }
                )
              );
          });
        }
      },
      {
        immediate: true,
      }
    );

    const relyFieldsCallback: WatchStopHandle[] = [];
    watch(
      () => info.value.extraConfig?.relyFieldsToSearch,
      (fields: string[] | undefined) => {
        if (fields) {
          let cb;
          while ((cb = relyFieldsCallback.shift())) {
            cb();
          }

          relyFieldsCallback.push(
            watch(
              () => instanceValue?.value,
              (curr, old) => {
                if (curr) {
                  let diff: Partial<typeof curr> = {};

                  if (old && curr) {
                    Object.entries(curr).forEach(([key, value]) => {
                      if (value !== old[key]) {
                        diff![key] = value;
                      }
                    });
                  } else {
                    diff = curr;
                  }

                  if (fields.filter((field) => curr?.[field]).length === 0) {
                    selectData.value = [];
                    setCurrentValueToDefault();
                  }

                  if (
                    Object.keys(diff!).length === 1 &&
                    info.value.field in diff!
                  ) {
                    return;
                  }

                  if (
                    fields.filter((field) => curr?.[field]).length ===
                    fields.length
                  ) {
                    enableSearch.value = true;
                    loadSelectData();
                  }
                }
              },
              {
                immediate: true,
                deep: true,
              }
            )
          );
        }
      },
      {
        immediate: true,
      }
    );

    return () => (
      <ElSelect
        model-value={currentValue.value}
        multiple={info.value.extraConfig?.multiple || false}
        collapse-tags={true}
        placeholder={placeholder.value}
        class="full-width"
        filterable={info.value.extraConfig?.filterable || false}
        loading={loading.value}
        clearable={info.value?.clearable ?? true}
        onUpdate:model-value={setCurrentValue}
      >
        {selectData.value.map((item) => (
          <ElOption key={item.label} value={item.value} label={item.label}>
            <ElTooltip
              disabled={!item.tooltip}
              content={item.tooltip}
              placement={
                info.value.extraConfig?.optionTooltipPlacement || "left"
              }
            >
              {item.label}
            </ElTooltip>
          </ElOption>
        ))}
      </ElSelect>
    );
  },
});
