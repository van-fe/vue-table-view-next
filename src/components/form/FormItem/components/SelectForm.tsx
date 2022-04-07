import FormMixin, { FormMixinsProps } from "./FormMixin";
import { defineComponent, ref, watch } from "vue";
import type {
  SelectData,
  BaseFormType,
  AdvancedSearchSelectExtra,
  Dictionary,
} from "../../../../config";
import { ElOption, ElSelectV2 } from "element-plus";
import type EditForm from "../../../../config/create";

export default defineComponent({
  name: "SelectForm",
  props: FormMixinsProps,
  setup(props) {
    const {
      init,
      currentValue,
      info: currInfo,
      placeholder,
    } = new FormMixin(props);
    init();

    const info = currInfo as EditForm<Dictionary, BaseFormType.Select>;
    const selectData = ref<SelectData[]>([]);
    const loading = ref(false);

    watch(
      () => info.extraConfig,
      (val: AdvancedSearchSelectExtra | undefined) => {
        if (val && val.selectData) {
          selectData.value = val.selectData;
        }
      },
      {
        immediate: true,
      }
    );

    return (
      <ElSelectV2
        v-model={currentValue}
        multiple={info.extraConfig?.multiple || false}
        placeholder={placeholder}
        allow-clear={true}
        class="full-width"
        filterable={info.extraConfig?.filterable || false}
        loading={loading.value}
      >
        {selectData.value.map((item) => (
          <ElOption key={item.label} value={item.value} label={item.label}>
            {item.label}
          </ElOption>
        ))}
      </ElSelectV2>
    );
  },
});

// defineComponent({
//   name: "SelectForm",
//   mixins: [FormMixin<BaseFormType.Select>()],
//   data() {
//     return {
//       selectData: [] as SelectData[],
//       loading: false,
//     };
//   },
//   watch: {
//     "info.extraConfig": {
//       immediate: true,
//       async handler(val: AdvancedSearchSelectExtra) {
//         if (val.selectData) {
//           this.selectData = val.selectData;
//         }
//       },
//     },
//   },
//   render(): VNode {
//     return (
//       <ElSelectV2
//         v-model={this.currentValue}
//         multiple={this.info.extraConfig?.multiple || false}
//         placeholder={this.placeholder}
//         allow-clear={true}
//         class="full-width"
//         filterable={this.info.extraConfig?.filterable || false}
//         loading={this.loading}
//       >
//         {this.selectData.map((item) => (
//           <ElOption key={item.label} value={item.value} label={item.label}>
//             {item.label}
//           </ElOption>
//         ))}
//       </ElSelectV2>
//     );
//   },
// });
