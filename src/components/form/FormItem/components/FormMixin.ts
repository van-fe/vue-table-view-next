import type { PropType } from "vue";
import { defineComponent } from "vue";
import type {
  BaseFormType,
  Dictionary,
  EditFormExtraMap,
} from "../../../../config";
import type EditForm from "../../../../config/create";

export default <
  Type extends keyof EditFormExtraMap<unknown> = BaseFormType
>() =>
  defineComponent({
    name: "FormBase",
    props: {
      info: {
        type: Object as PropType<EditForm<unknown, Type>>,
        required: true,
      },
      data: {
        type: Object as PropType<Dictionary>,
        required: true,
      },
      value: {
        type: [Object, Array, String, Number],
        required: true,
        default: "",
      },
    },
    data() {
      return {
        currentValue: "" as unknown,
        comparedDataInstance: {},
        hasFormatValue: false,
      };
    },
    computed: {
      placeholder() {
        if (this.info && typeof this.info.placeholder !== "undefined") {
          if (typeof this.info.placeholder === "function") {
            return this.info.placeholder(this.info);
          } else {
            return this.info.placeholder === true
              ? this.info.title
              : (this.info.placeholder as string);
          }
        } else {
          return "";
        }
      },
      disabled() {
        return this.info.disabled === undefined
          ? false
          : typeof this.info.disabled === "function"
          ? this.info.disabled(this.currentValue, this.data)
          : this.info.disabled;
      },
      comparedData: {
        get() {
          return this.comparedDataInstance;
        },
        set(val: Dictionary) {
          if (
            JSON.stringify(val) !== JSON.stringify(this.comparedDataInstance)
          ) {
            this.comparedDataInstance = Object.assign({}, val);
          }
        },
      },
    },
    watch: {
      currentValue(val: unknown) {
        this.afterCurrentValueChanged();
        this.$emit("input", val);
      },
      value(val: unknown | null) {
        this.afterValueChanged();
        this.setValue(val);
      },
      data: {
        handler(val: Dictionary) {
          this.comparedData = val;
        },
      },
    },
    created() {
      this.setValue();
    },
    methods: {
      noticeInit() {},
      noticeHide() {},
      afterValueChanged() {},
      afterCurrentValueChanged() {},
      setValue(val: unknown | null = null): void {
        if (
          !this.hasFormatValue &&
          this.info &&
          this.info.beforeLoad &&
          typeof this.info.beforeLoad === "function"
        ) {
          this.currentValue = this.info.beforeLoad(this.value);
          this.hasFormatValue = true;
        } else {
          this.currentValue = val ?? this.value;
        }
      },
    },
  });
