import type { ExtractPropTypes, PropType, SetupContext } from "vue";
import { computed, reactive, ref, toRefs, watch } from "vue";
import type { Dictionary, EditForm, AdvancedSearchType } from "@/config";

export const FormMixinsProps = {
  info: {
    type: Object as PropType<EditForm | AdvancedSearchType>,
    required: true,
  },
  row: {
    type: Object as PropType<Dictionary>,
    required: true,
  },
  instanceValue: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [Object, Array, String, Number],
    required: true,
    default: "",
  },
};

export const FormMixinsEmits = ["update:modelValue"];

export default function FormMixin(
  props: ExtractPropTypes<typeof FormMixinsProps>,
  { emit }: SetupContext<typeof FormMixinsEmits>
) {
  const currentValue = ref<null | unknown>(null);

  const placeholder = computed(() => {
    if (props.info && typeof props.info.placeholder !== "undefined") {
      if (typeof props.info.placeholder === "function") {
        return props.info.placeholder(props.instanceValue as Dictionary);
      } else {
        return props.info.placeholder === true
          ? props.info.title
          : (props.info.placeholder as string);
      }
    } else {
      return "";
    }
  });

  const disabled = computed(() => {
    return props.info?.disabled === undefined
      ? false
      : typeof props.info.disabled === "function"
      ? props.info.disabled(currentValue.value, props.instanceValue as any)
      : props.info.disabled;
  });

  const callbackFunc = reactive({
    afterValueChanged: () => {},
    afterCurrentValueChanged: () => {},
  });

  const watchFunc = reactive({
    value: (val: any | null) => {
      callbackFunc.afterValueChanged();
      setValue(val);
    },
    currentValue: (val: any) => {
      callbackFunc.afterCurrentValueChanged();
      emit("update:modelValue", val);
    },
  });

  function setValue(val: unknown | null = null): void {
    currentValue.value = val ?? props.modelValue;
  }

  function setCurrentValue(val: unknown): void {
    currentValue.value = val;
  }

  function setCurrentValueToDefault(): void {
    if (typeof props.info!.default === "function") {
      currentValue.value = props.info!.default();
    } else {
      currentValue.value = props.info!.default;
    }
  }

  const init = () => {
    watch(currentValue, watchFunc.currentValue);

    watch(() => props.modelValue, watchFunc.value);

    setValue();
  };

  return {
    ...toRefs(props),
    currentValue,
    placeholder,
    disabled,
    callbackFunc,
    watchFunc,
    setCurrentValue,
    setCurrentValueToDefault,
    setValue,
    init,
  };
}
