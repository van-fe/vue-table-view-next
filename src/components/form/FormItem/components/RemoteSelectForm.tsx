import FormMixin, { FormMixinsProps } from "./FormMixin";
import { defineComponent, ref, watch } from "vue";
import { debounce } from "lodash-es";
import type { SelectData, BaseFormType, Dictionary } from "../../../../config";
import { ElOption, ElSelectV2 } from "element-plus";
import type EditForm from "../../../../config/create";

export default defineComponent({
  name: "RemoteSelectForm",
  props: FormMixinsProps,
  setup(props) {
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
    } = new FormMixin(props);
    init();

    const info = currInfo as EditForm<Dictionary, BaseFormType.RemoteSearch>;
    const selectData = ref<SelectData[]>([]);
    const currentSearchValue = ref("");
    const hasInit = ref(false);

    watch(
      comparedData,
      (val: Dictionary, old: Dictionary | undefined) => {
        if (info?.listenFieldsToSearch && info.listenFieldsToSearch.length) {
          if (old === undefined) {
            handleSearch(currentSearchValue.value);
          } else {
            let isDiff = false;
            info.listenFieldsToSearch.forEach((field) => {
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
          info.listenFieldsChangeToReset &&
          info.listenFieldsChangeToReset.length
        ) {
          if (old === undefined) {
            handleSearch(currentSearchValue.value);
          } else if (hasInit.value) {
            let isDiff = false;
            info.listenFieldsChangeToReset.forEach((field) => {
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
          info.extraConfig?.searchFunc!(val, instanceValue).then((data) => {
            selectData.value = data;
          });
      }, info.extraConfig?.debounce ?? 500)(val);
    }

    callbackFunc.afterCurrentValueChanged = () => {
      if (typeof info.defaultValueSearchFunc === "function") {
        info
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

    return (
      <ElSelectV2
        v-model={currentValue}
        placeholder={placeholder}
        allow-clear={true}
        filterable={true}
        remote={true}
        default-first-option={false}
        remote-method={handleSearch}
        disabled={disabled}
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

// defineComponent({
//   name: "RemoteSelectForm",
//   mixins: [FormMixin<BaseFormType.RemoteSearch>()],
//   data() {
//     return {
//       selectData: [] as SelectData[],
//       currentSearchValue: "",
//       hasInit: false,
//     };
//   },
//   watch: {
//     comparedData: {
//       immediate: true,
//       deep: true,
//       handler(val: Dictionary, old: Dictionary | undefined) {
//         if (
//           this.info?.listenFieldsToSearch &&
//           this.info.listenFieldsToSearch.length
//         ) {
//           if (old === undefined) {
//             this.handleSearch(this.currentSearchValue);
//           } else {
//             let isDiff = false;
//             this.info.listenFieldsToSearch.forEach((field) => {
//               if (val[field] !== old[field]) {
//                 isDiff = true;
//               }
//             });
//
//             if (isDiff) {
//               this.handleSearch(this.currentSearchValue);
//             }
//           }
//         }
//
//         if (
//           this.info.listenFieldsChangeToReset &&
//           this.info.listenFieldsChangeToReset.length
//         ) {
//           if (old === undefined) {
//             this.handleSearch(this.currentSearchValue);
//           } else if (this.hasInit) {
//             let isDiff = false;
//             this.info.listenFieldsChangeToReset.forEach((field) => {
//               if (val[field] !== old[field]) {
//                 isDiff = true;
//               }
//             });
//
//             if (isDiff) {
//               this.currentValue = "";
//             }
//           }
//         }
//       },
//     },
//   },
//   created() {
//     this.handleSearch();
//   },
//   methods: {
//     noticeInit() {
//       this.hasInit = true;
//     },
//     noticeHide() {
//       this.hasInit = false;
//     },
//     handleSearch(val = "") {
//       this.currentSearchValue = val;
//       debounce((val = ""): void => {
//         this.info.extraConfig?.searchFunc!(val, this.instanceValue).then(
//           (data) => {
//             this.selectData = data;
//           }
//         );
//       }, this.info.extraConfig?.debounce ?? 500)(val);
//     },
//     afterCurrentValueChanged() {
//       if (typeof this.info.defaultValueSearchFunc === "function") {
//         this.info
//           .defaultValueSearchFunc(this.currentValue)
//           .then((data: SelectData | undefined) => {
//             if (
//               data !== undefined &&
//               !this.selectData.some((item) => item.value === data.value)
//             ) {
//               this.selectData.unshift(data);
//             }
//           });
//       }
//     },
//   },
//   render() {
//     return (
//       <ElSelectV2
//         v-model={this.currentValue}
//         placeholder={this.placeholder}
//         allow-clear={true}
//         filterable={true}
//         remote={true}
//         default-first-option={false}
//         remote-method={this.handleSearch}
//         disabled={this.disabled}
//       >
//         {...this.selectData.map((item) => {
//           return (
//             <ElOption key={item.value} value={item.value} label={item.label}>
//               {item.label}
//             </ElOption>
//           );
//         })}
//       </ElSelectV2>
//     );
//   },
// });
