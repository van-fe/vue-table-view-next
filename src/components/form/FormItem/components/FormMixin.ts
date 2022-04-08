import type { ExtractPropTypes, PropType } from "vue";
import { computed, reactive, ref, watch, defineEmits } from "vue";
import type { Dictionary, EditForm, AdvancedSearchType } from "@/config";
import { cloneDeep } from "lodash-es";

export const FormMixinsProps = {
  info: {
    type: Object as PropType<EditForm | AdvancedSearchType>,
    required: true,
  },
  instanceValue: {
    type: Object,
    required: true,
  },
  value: {
    type: [Object, Array, String, Number],
    required: true,
    default: "",
  },
};

export default function FormMixin(
  props: ExtractPropTypes<typeof FormMixinsProps>
) {
  const currentValue = ref<null | unknown>(null);
  let comparedDataInstance = reactive<Dictionary>({});
  const hasFormatValue = ref(false);
  const emit = defineEmits(["update:modelValue"]);

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

  const comparedData = computed<Dictionary>({
    get() {
      return comparedDataInstance;
    },
    set(val: Dictionary) {
      if (JSON.stringify(val) !== JSON.stringify(comparedDataInstance)) {
        comparedDataInstance = cloneDeep(val);
      }
    },
  });

  const callbackFunc = reactive({
    noticeInit: () => {},
    noticeHide: () => {},
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
    instanceValue: (val: Dictionary) => {
      comparedData.value = val;
    },
  });

  function setValue(val: unknown | null = null): void {
    if (
      !hasFormatValue.value &&
      props.info &&
      typeof props.info?.beforeLoad === "function"
    ) {
      currentValue.value = props.info.beforeLoad(props.value);
      hasFormatValue.value = true;
    } else {
      currentValue.value = val ?? props.value;
    }
  }

  function setCurrentValue(val: unknown): void {
    currentValue.value = val;
  }

  const init = () => {
    watch(currentValue, watchFunc.currentValue);

    watch(() => props.value, watchFunc.value);

    watch(() => props.instanceValue, watchFunc.instanceValue);

    setValue();
  };

  return {
    ...props,
    currentValue,
    comparedDataInstance,
    hasFormatValue,
    placeholder,
    disabled,
    comparedData,
    callbackFunc,
    watchFunc,
    setCurrentValue,
    setValue,
    init,
  };
}

// defineComponent({
//   name: "FormMixin",
//   props: FormMixinsProps,
//   emits: ["update:modelValue"],
//   setup(props, { emit }) {
//     const currentValue = ref<null | unknown>(null);
//     let comparedDataInstance = reactive<Dictionary>({});
//     const hasFormatValue = ref(false);
//
//     const placeholder = computed(() => {
//       if (props.info && typeof props.info.placeholder !== "undefined") {
//         if (typeof props.info.placeholder === "function") {
//           return props.info.placeholder(props.instanceValue as Dictionary);
//         } else {
//           return props.info.placeholder === true
//             ? props.info.title
//             : (props.info.placeholder as string);
//         }
//       } else {
//         return "";
//       }
//     });
//
//     const disabled = computed(() => {
//       return props.info?.disabled === undefined
//         ? false
//         : typeof props.info.disabled === "function"
//         ? props.info.disabled(currentValue.value, props.instanceValue as any)
//         : props.info.disabled;
//     });
//
//     const comparedData = computed<Dictionary>({
//       get() {
//         return comparedDataInstance;
//       },
//       set(val: Dictionary) {
//         if (JSON.stringify(val) !== JSON.stringify(comparedDataInstance)) {
//           comparedDataInstance = cloneDeep(val);
//         }
//       },
//     });
//
//     const callbackFunc = reactive({
//       noticeInit: () => {},
//       noticeHide: () => {},
//       afterValueChanged: () => {},
//       afterCurrentValueChanged: () => {},
//     });
//
//     const watchFunc = reactive({
//       value: (val: any | null) => {
//         callbackFunc.afterValueChanged();
//         setValue(val);
//       },
//       currentValue: (val: any) => {
//         callbackFunc.afterCurrentValueChanged();
//         emit("update:modelValue", val);
//       },
//       instanceValue: (val: Dictionary) => {
//         comparedData.value = val;
//       },
//     });
//
//     function setValue(val: unknown | null = null): void {
//       if (
//         !hasFormatValue.value &&
//         props.info &&
//         typeof props.info?.beforeLoad === "function"
//       ) {
//         currentValue.value = props.info.beforeLoad(props.value);
//         hasFormatValue.value = true;
//       } else {
//         currentValue.value = val ?? props.value;
//       }
//     }
//
//     function setCurrentValue(val: unknown): void {
//       currentValue.value = val;
//     }
//
//     const init = () => {
//       watch(currentValue, watchFunc.currentValue);
//
//       watch(() => props.value, watchFunc.value);
//
//       watch(() => props.instanceValue, watchFunc.instanceValue);
//
//       setValue();
//     };
//
//     return {
//       currentValue,
//       comparedDataInstance,
//       hasFormatValue,
//       placeholder,
//       disabled,
//       comparedData,
//       callbackFunc,
//       watchFunc,
//       setCurrentValue,
//       setValue,
//       init,
//     };
//   },
// });
