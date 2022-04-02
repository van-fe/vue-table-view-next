import type { PropType } from "vue";
import { computed, defineComponent, ref, watch } from "vue";
import { BaseFormType } from "../../../config";
import FormItems from "./components";
import type EditForm from "../../../config/create";
import { ElTooltip, ElFormItem } from "element-plus";

export const FormItemComponent = <Row,>() =>
  defineComponent({
    name: "FormItemComponent",
    props: {
      info: {
        type: Object as PropType<EditForm<Row, BaseFormType>>,
        required: true,
      },
      data: {
        type: Object as PropType<Record<string, unknown>>,
        default: () => ({}),
      },
      value: {
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
    setup(props) {
      const currentValue = ref<unknown | unknown[]>(null);
      const componentName = computed(() => {
        switch (props.info.type) {
          case BaseFormType.String:
          case BaseFormType.Textarea:
          default:
            return FormItems.StringForm;
          case BaseFormType.Number:
            return FormItems.NumberForm;
          case BaseFormType.Select:
            return FormItems.SelectForm;
          case BaseFormType.DatePicker:
          case BaseFormType.DateTimePicker:
            return FormItems.DateForm;
          case BaseFormType.TimePicker:
            return FormItems.TimeForm;
          case BaseFormType.Cascader:
            return FormItems.CascaderForm;
          case BaseFormType.DateRangePicker:
          case BaseFormType.DateTimeRangePicker:
            return FormItems.DateRangeForm;
          case BaseFormType.TimeRangePicker:
            return FormItems.TimeRangeForm;
          case BaseFormType.RemoteSearch:
            return FormItems.RemoteSelectForm;
        }
      });

      const emits = defineEmits(["input"]);

      watch(
        // @ts-ignore
        props.value,
        (val) => {
          currentValue.value = val;
        },
        {
          immediate: true,
        }
      );

      watch(currentValue, (val) => {
        emits("input", val);
      });

      return () => (
        <ElFormItem
          label={props.info.title}
          required={props.required}
          prop={props.info.field}
        >
          <ElTooltip placement="top-start">
            {props.info.tooltipText ? (
              // @ts-ignore
              <template slot="content">
                <span v-html={props.info.tooltipText} />
              </template>
            ) : undefined}
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
                v-model={currentValue.value}
                // @ts-ignore
                info={props.info}
                data={props.data}
              />
            )}
          </ElTooltip>
        </ElFormItem>
      );
    },
  });
