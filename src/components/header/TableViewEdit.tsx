import type { PropType, Ref, VNode, Component } from "vue";
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
} from "vue";
import type { Dictionary, Config } from "@/config";
import {
  ElButton,
  ElDialog,
  ElForm,
  ElRow,
  ElMessage,
  ElLoading,
} from "element-plus";
import type { FormItemRule } from "element-plus/es/tokens/form";
import { FormItemComponent } from "@/components";
import { cloneDeep } from "lodash-es";

export const TableViewEdit = () =>
  defineComponent({
    name: "TableViewEdit",
    props: {
      currentConfig: {
        type: Object as PropType<Ref<Config>>,
        required: true,
      },
      row: {
        type: Object as PropType<Dictionary>,
        default: null,
      },
      currentTableSymbol: {
        type: Symbol,
        required: true,
      },
    },
    setup(props, { expose }) {
      const dialogVisible = ref(false);
      const formLoading = ref(false);
      const formLoadingInstance = ref();
      const dialogRef = ref();
      const form = ref<Dictionary>({});
      const formRef = ref();
      const rules = ref<Dictionary<FormItemRule | FormItemRule[]>>({});
      loadFormData();

      function loadFormData() {
        props.currentConfig?.value.editForm?.forEach((item) => {
          form.value[item.field] =
            props.row?.[item.field] ??
            (typeof item.default === "function"
              ? item.default()
              : item.default);
          if (typeof item.beforeLoad === "function") {
            form.value[item.field] = item.beforeLoad(
              form.value[item.field],
              props.row
            );
          }

          item.rule && (rules.value[item.field] = item.rule);
        });

        if (
          props.currentConfig.value.buildInEditConfig?.rowFieldPassToKeyField
        ) {
          form.value[props.currentConfig.value.buildInEditConfig.keyField] =
            props.row[
              props.currentConfig.value.buildInEditConfig?.rowFieldPassToKeyField
            ];
        }
      }

      const isCreate = computed(() => {
        return !(
          props.currentConfig?.value.buildInEditConfig &&
          form.value[props.currentConfig?.value.buildInEditConfig.keyField]
        );
      });

      const dialogTitle = computed(() => {
        const buildInEditConfig = props.currentConfig?.value.buildInEditConfig;
        if (buildInEditConfig) {
          return `${buildInEditConfig?.titlePrefix ?? ""}${
            isCreate.value
              ? buildInEditConfig?.titleCreateText ?? "Create"
              : buildInEditConfig?.titleEditText ?? "Edit"
          }${buildInEditConfig?.titleSuffix ?? ""}`;
        }

        return "";
      });

      function createControllerFormItem(): VNode[] {
        const Tag = FormItemComponent() as Component;
        const rows: VNode[] = [];

        (props.currentConfig?.value.editForm || []).map((item) => {
          rows.push(
            <ElRow
              v-show={
                typeof item.visible === "function"
                  ? item.visible(props.row, form.value)
                  : item.visible ?? true
              }
            >
              {
                // @ts-ignore
                <Tag
                  model-value={form.value[item.field]}
                  // @ts-ignore
                  info={item}
                  // @ts-ignore
                  row={props.row}
                  instance-value={form}
                  onUpdate:model-value={(val: unknown) =>
                    (form.value[item.field] = val)
                  }
                />
              }
            </ElRow>
          );
        });

        return rows;
      }

      watch(
        () => formLoading.value,
        (val) => {
          if (val) {
            formLoadingInstance.value = ElLoading.service({
              fullscreen: true,
            });
          } else {
            formLoadingInstance.value.close();
          }
        }
      );

      function afterValidToSubmit() {
        const submitValue = cloneDeep(form.value);

        props.currentConfig?.value.editForm?.forEach((item) => {
          if (typeof item.beforeSubmit === "function") {
            submitValue[item.field] = item.beforeSubmit(
              submitValue[item.field],
              props.row
            );
          }
        });

        const func = isCreate.value
          ? props.currentConfig?.value.buildInEditConfig?.createFunc
          : props.currentConfig?.value.buildInEditConfig?.editFunc ??
            props.currentConfig?.value.buildInEditConfig?.createFunc;

        if (!func) return;

        formLoading.value = true;
        func(submitValue)
          .then((res) => {
            const config = props.currentConfig?.value.buildInEditConfig;
            let text: string | undefined;
            let cb: Function | undefined;
            if (isCreate.value) {
              text =
                typeof config?.createSuccessTips === "function"
                  ? config?.createSuccessTips(res)
                  : config?.createSuccessTips;
              cb = config?.onCreateSuccess;
            } else {
              text =
                typeof config?.editSuccessTips === "function"
                  ? config?.editSuccessTips(res)
                  : config?.editSuccessTips;
              cb = config?.onEditSuccess;
            }
            ElMessage.success(text || "Success");
            cb && cb();
            onSubmitSuccess();
          })
          .catch((res) => {
            const config = props.currentConfig?.value.buildInEditConfig;
            let text: string | undefined;
            let cb: Function | undefined;
            if (isCreate.value) {
              text =
                res instanceof Error
                  ? res.message
                  : typeof config?.createFailTips === "function"
                  ? config?.createFailTips(res)
                  : config?.createFailTips;
              cb = config?.onCreateFail;
            } else {
              text =
                res instanceof Error
                  ? res.message
                  : typeof config?.editFailTips === "function"
                  ? config?.editFailTips(res)
                  : config?.editFailTips;
              cb = config?.onEditFail;
            }
            ElMessage.error(text || "Fail");
            cb && cb();
          });
      }

      function onSubmit(e: Event) {
        e.preventDefault();
        if (Object.keys(rules).length === 0) {
          afterValidToSubmit();
        } else {
          formRef.value.validate((valid: boolean) => {
            if (!valid) {
              return;
            }
            afterValidToSubmit();
          });
        }
      }

      function onSubmitSuccess() {
        formLoading.value = false;
        window.dispatchEvent(
          new CustomEvent("vue-table-view-edit-form-submit-finished", {
            detail: {
              id: props.currentTableSymbol,
            },
          })
        );
        onCancel();
      }

      function onCancel() {
        dialogVisible.value = false;
        nextTick(() => {
          window.dispatchEvent(
            new CustomEvent("vue-table-view-destroy-edit-form", {
              detail: {
                id: props.currentTableSymbol,
              },
            })
          );
        });
      }

      onMounted(() => {
        dialogVisible.value = true;
      });

      function updateCurrEditForm(data: Record<string, unknown>) {
        Object.entries(data).forEach(([key, value]) => {
          form.value[key] = value;
        });
      }

      expose({
        updateCurrEditForm,
      });

      const slots = {
        default() {
          return (
            <ElForm
              ref={formRef}
              model={form.value}
              rules={rules.value}
              label-width={
                props.currentConfig?.value.buildInEditConfig?.formLabelWidth ??
                "120px"
              }
              label-suffix={
                props.currentConfig?.value.buildInEditConfig?.formLabelSuffix ??
                ":"
              }
              label-position={
                props.currentConfig?.value.buildInEditConfig
                  ?.formLabelPosition ?? "right"
              }
              size={props.currentConfig?.value.buildInEditConfig?.formSize}
            >
              <>{...createControllerFormItem()}</>
            </ElForm>
          );
        },
        footer() {
          return (
            <div class="table-view-edit__dialog-footer">
              <ElButton plain onClick={onCancel}>
                {props.currentConfig?.value.buildInEditConfig
                  ?.dialogFooterCancelButtonText ?? "Cancel"}
              </ElButton>
              <ElButton type="primary" plain onClick={onSubmit}>
                {props.currentConfig?.value.buildInEditConfig
                  ?.dialogFooterSubmitButtonText ?? "Submit"}
              </ElButton>
            </div>
          );
        },
      };

      return () => (
        <ElDialog
          ref={dialogRef}
          v-slots={slots}
          modelValue={dialogVisible.value}
          title={dialogTitle.value}
          width={
            props.currentConfig?.value.buildInEditConfig?.dialogWidth ?? "400px"
          }
          customClass="vue-table-view-edit-dialog"
          destroyOnClose={true}
          beforeClose={onCancel}
        />
      );
    },
  });
