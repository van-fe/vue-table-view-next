import FormMixin, { FormMixinsEmits, FormMixinsProps } from "./FormMixin";
import type { Ref } from "vue";
import { defineComponent, ref, watch } from "vue";
import { debounce } from "lodash-es";
import type { SelectData, BaseFormType, Dictionary, EditForm } from "@/config";
import { ElOption, ElSelectV2 } from "element-plus";

export default defineComponent({
  name: "RemoteSelectForm",
  props: FormMixinsProps,
  emits: FormMixinsEmits,
  setup(props, ctx) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
      disabled,
      instanceValue,
      comparedData,
      callbackFunc,
      setCurrentValue,
    } = FormMixin(props, ctx);
    init();

    const info = currInfo as Ref<
      EditForm<Dictionary, BaseFormType.RemoteSearch>
    >;
    const selectData = ref<SelectData[]>([]);
    const currentSearchValue = ref("");
    const hasInit = ref(false);

    watch(
      comparedData,
      (val: Dictionary, old: Dictionary | undefined) => {
        if (
          info.value.listenFieldsToSearch &&
          info.value.listenFieldsToSearch.length
        ) {
          if (old === undefined) {
            handleSearch(currentSearchValue.value);
          } else {
            let isDiff = false;
            info.value.listenFieldsToSearch.forEach((field) => {
              if (val[field] !== old[field]) {
                isDiff = true;
              }
            });

            if (isDiff) {
              handleSearch(currentSearchValue.value);
            }
          }
        }

        if (
          info.value.listenFieldsChangeToReset &&
          info.value.listenFieldsChangeToReset.length
        ) {
          if (old === undefined) {
            handleSearch(currentSearchValue.value);
          } else if (hasInit.value) {
            let isDiff = false;
            info.value.listenFieldsChangeToReset.forEach((field) => {
              if (val[field] !== old[field]) {
                isDiff = true;
              }
            });

            if (isDiff) {
              setCurrentValue("");
            }
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    callbackFunc.noticeInit = () => (hasInit.value = true);
    callbackFunc.noticeHide = () => (hasInit.value = false);

    function handleSearch(val = "") {
      currentSearchValue.value = val;
      debounce((val = ""): void => {
        instanceValue &&
          info.value.extraConfig?.searchFunc!(val, instanceValue).then(
            (data) => {
              selectData.value = data;
            }
          );
      }, info.value.extraConfig?.debounce ?? 500)(val);
    }

    callbackFunc.afterCurrentValueChanged = () => {
      if (typeof info.value.defaultValueSearchFunc === "function") {
        info.value
          .defaultValueSearchFunc(currentValue)
          .then((data: SelectData | undefined) => {
            if (
              data !== undefined &&
              !selectData.value.some((item) => item.value === data.value)
            ) {
              selectData.value.unshift(data);
            }
          });
      }
    };

    return () => (
      <ElSelectV2
        model-value={currentValue.value}
        placeholder={placeholder.value}
        allow-clear={true}
        filterable={true}
        remote={true}
        default-first-option={false}
        remote-method={handleSearch}
        disabled={disabled.value}
        onUpdate:model-value={setCurrentValue}
      >
        {...selectData.value.map((item) => {
          return (
            <ElOption key={item.value} value={item.value} label={item.label}>
              {item.label}
            </ElOption>
          );
        })}
      </ElSelectV2>
    );
  },
});
