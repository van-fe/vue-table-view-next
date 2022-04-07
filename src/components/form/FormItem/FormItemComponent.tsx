import type { PropType } from "vue";
import { defineComponent, ref, watch } from "vue";
import type { Dictionary } from "../../../config";
import { BaseFormType } from "../../../config";
import FormItems from "./components";
import type EditForm from "../../../config/create";
import { ElTooltip, ElFormItem } from "element-plus";
import type AdvancedSearch from "../../../config/advancedSearch";

export const FormItemComponent = <
  Row extends Dictionary = Dictionary,
  Search extends Dictionary = Dictionary
>() =>
  defineComponent({
    name: "FormItemComponent",
    components: {
      ...FormItems,
    },
    props: {
      info: {
        type: Object as PropType<
          | EditForm<Row, BaseFormType>
          | AdvancedSearch<Search, Row, BaseFormType>
        >,
        required: true,
      },
      instanceValue: {
        type: Object as PropType<Dictionary>,
        default: () => ({}),
      },
      modelValue: {
        type: [String, Number, Array, Object],
        default: "",
      },
      isQuickView: {
        type: Boolean,
        default: false,
      },
      required: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["update:model-value"],
    setup(props, { emit }) {
      const currentValue = ref<unknown | unknown[]>(null);
      const componentName = ref();

      switch (props.info.type) {
        case BaseFormType.String:
        case BaseFormType.Textarea:
        default:
          componentName.value = FormItems.StringForm;
          break;
        case BaseFormType.Number:
          componentName.value = FormItems.NumberForm;
          break;
        case BaseFormType.Select:
          componentName.value = FormItems.SelectForm;
          break;
        case BaseFormType.DatePicker:
        case BaseFormType.DateTimePicker:
          componentName.value = FormItems.DateForm;
          break;
        case BaseFormType.TimePicker:
          componentName.value = FormItems.TimeForm;
          break;
        case BaseFormType.Cascader:
          componentName.value = FormItems.CascaderForm;
          break;
        case BaseFormType.DateRangePicker:
        case BaseFormType.DateTimeRangePicker:
          componentName.value = FormItems.DateRangeForm;
          break;
        case BaseFormType.TimeRangePicker:
          componentName.value = FormItems.TimeRangeForm;
          break;
        case BaseFormType.RemoteSearch:
          componentName.value = FormItems.RemoteSelectForm;
          break;
      }

      watch(
        () => props.modelValue,
        (val) => {
          currentValue.value = val;
        },
        {
          immediate: true,
        }
      );

      watch(currentValue, (val) => {
        emit("update:model-value", val);
      });

      return () => (
        <ElFormItem
          label={props.info.title}
          required={props.required}
          prop={props.info.field}
        >
          <ElTooltip
            placement="top-start"
            content={props.info?.tooltipText}
            raw-content
          >
            {props.isQuickView ? (
              <template>
                {[
                  BaseFormType.String,
                  BaseFormType.Textarea,
                  BaseFormType.Number,
                ].includes(props.info.type) ? (
                  <span v-html={currentValue} />
                ) : undefined}
              </template>
            ) : (
              <componentName.value
                ref="component"
                model-value={currentValue.value}
                is={componentName.value}
                info={props.info}
                instance-value={props.instanceValue}
                onUpdate:model-value={(val: unknown) =>
                  (currentValue.value = val)
                }
              />
            )}
          </ElTooltip>
        </ElFormItem>
      );
    },
  });
