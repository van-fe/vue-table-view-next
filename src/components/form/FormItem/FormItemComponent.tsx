import type { Component, PropType } from "vue";
import { defineComponent, ref, shallowRef, watch } from "vue";
import type { Dictionary, EditForm, AdvancedSearchType } from "@/config";
import { BaseFormType } from "@/config";
import FormItems from "./components";
import { ElTooltip, ElFormItem } from "element-plus";

export default <
  Row extends Dictionary,
  Search extends Dictionary = Dictionary
>(): Component =>
  defineComponent({
    name: "FormItemComponent",
    props: {
      info: {
        type: Object as PropType<
          EditForm<Row> | AdvancedSearchType<Search, Row>
        >,
        required: true,
      },
      row: {
        type: Object as PropType<Row>,
        default: () => ({}),
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
    emits: ["update:modelValue"],
    setup(props, { emit }) {
      const currentValue = ref<unknown | unknown[]>(props.modelValue);
      const componentName = shallowRef();

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
        case BaseFormType.TreeSelect:
          componentName.value = FormItems.TreeSelectForm;
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

      watch(
        () => currentValue.value,
        (val) => {
          emit("update:modelValue", val);
        }
      );

      return () => (
        <ElFormItem
          label={props.info.title}
          required={props.required}
          prop={props.info.field}
        >
          <ElTooltip
            placement="top-start"
            content={props.info?.tooltipText}
            disabled={!props.info?.tooltipText}
            raw-content
          >
            {props.isQuickView ? (
              <template>
                {[
                  BaseFormType.String,
                  BaseFormType.Textarea,
                  BaseFormType.Number,
                ].includes(props.info.type) ? (
                  <span v-html={currentValue.value} />
                ) : undefined}
              </template>
            ) : (
              <componentName.value
                ref="component"
                model-value={currentValue.value}
                is={componentName.value}
                info={props.info}
                row={props.row}
                instance-value={props.instanceValue}
                onUpdate:modelValue={(val: unknown) =>
                  (currentValue.value = val)
                }
              />
            )}
          </ElTooltip>
        </ElFormItem>
      );
    },
  });
