import type { PropType } from "vue";
import { computed, defineComponent, reactive, ref, watch } from "vue";
import type { Dictionary } from "../../../../config";
import type EditForm from "../../../../config/create";
import type AdvancedSearch from "../../../../config/advancedSearch";
import "@vue/shared";
import { cloneDeep } from "lodash-es";

export const FormMixinsProps = {
  info: {
    type: Object as PropType<EditForm | AdvancedSearch>,
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

// const FormMixins = <
//   Type extends BaseFormType = BaseFormType,
//   Row extends Dictionary = Dictionary,
//   Search extends Dictionary = Dictionary
// >() =>
//   defineComponent({
//     name: "FormBase",
//     props: {
//       info: {
//         type: Object as PropType<
//           EditForm<Row, Type> | AdvancedSearch<Search, Row, Type>
//         >,
//         required: true,
//       },
//       instanceValue: {
//         type: Object as PropType<Row | Search>,
//         required: true,
//       },
//       value: {
//         type: [Object, Array, String, Number],
//         required: true,
//         default: "",
//       },
//     },
//     data() {
//       return {
//         currentValue: "" as unknown,
//         comparedDataInstance: {},
//         hasFormatValue: false,
//       };
//     },
//     computed: {
//       placeholder() {
//         if (this.info && typeof this.info.placeholder !== "undefined") {
//           if (typeof this.info.placeholder === "function") {
//             return this.info.placeholder(this.instanceValue as Row);
//           } else {
//             return this.info.placeholder === true
//               ? this.info.title
//               : (this.info.placeholder as string);
//           }
//         } else {
//           return "";
//         }
//       },
//       disabled() {
//         return this.info.disabled === undefined
//           ? false
//           : typeof this.info.disabled === "function"
//           ? this.info.disabled(this.currentValue, this.instanceValue as any)
//           : this.info.disabled;
//       },
//       comparedData: {
//         get() {
//           return this.comparedDataInstance;
//         },
//         set(val: Dictionary) {
//           if (
//             JSON.stringify(val) !== JSON.stringify(this.comparedDataInstance)
//           ) {
//             this.comparedDataInstance = Object.assign({}, val);
//           }
//         },
//       },
//     },
//     watch: {
//       currentValue(val: unknown) {
//         this.afterCurrentValueChanged();
//         this.$emit("input", val);
//       },
//       value(val: unknown | null) {
//         this.afterValueChanged();
//         this.setValue(val);
//       },
//       instanceValue: {
//         handler(val: Dictionary) {
//           this.comparedData = val;
//         },
//       },
//     },
//     created() {
//       this.setValue();
//     },
//     methods: {
//       noticeInit() {},
//       noticeHide() {},
//       afterValueChanged() {},
//       afterCurrentValueChanged() {},
//       setValue(val: unknown | null = null): void {
//         if (
//           !this.hasFormatValue &&
//           this.info &&
//           typeof this.info?.beforeLoad === "function"
//         ) {
//           this.currentValue = this.info.beforeLoad(this.value);
//           this.hasFormatValue = true;
//         } else {
//           this.currentValue = val ?? this.value;
//         }
//       },
//     },
//   });

export default defineComponent({
  name: "FormMixin",
  props: FormMixinsProps,
  setup(props) {
    const currentValue = ref<null | unknown>(null);
    let comparedDataInstance = reactive<Dictionary>({});
    const hasFormatValue = ref(false);
    const emits = defineEmits(["input"]);

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
        emits("input", val);
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
  },
});
