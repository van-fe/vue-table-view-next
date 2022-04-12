import type { Ref, VNode } from "vue";
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  ref,
  withModifiers,
} from "vue";
import type { Dictionary, Config } from "@/config";
import { ElButton, ElDialog, ElForm, ElRow, ElMessage } from "element-plus";
import type { FormItemRule } from "element-plus/es/tokens/form";
import { FormItemComponent } from "@/components";

export const TableViewEdit = () =>
  defineComponent({
    name: "TableViewEdit",
    setup() {
      const currentConfig = inject<Ref<Config>>("currentConfig");

      const dialogVisible = ref(false);
      const formLoading = ref(false);
      const form = ref<Dictionary>({});
      const rules = ref<Dictionary<FormItemRule | FormItemRule[]>>({});
      loadFormData();

      function loadFormData() {
        currentConfig?.value.editForm?.forEach((item) => {
          form.value[item.field] =
            typeof item.default === "function" ? item.default() : item.default;
          item.rule && (form.value[item.field] = item.rule);
        });
      }

      const isCreate = computed(() => {
        return !!(
          currentConfig?.value.buildInEditConfig &&
          form.value[currentConfig?.value.buildInEditConfig.keyField]
        );
      });

      const dialogTitle = computed(() => {
        const buildInEditConfig = currentConfig?.value.buildInEditConfig;
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
        const Tag = FormItemComponent();
        const rows: VNode[] = [];

        (currentConfig?.value.editForm || []).map((item) => {
          rows.push(
            <ElRow gutter={10}>
              <Tag
                model-value={form.value[item.field]}
                // @ts-ignore
                info={item}
                instance-value={form}
                onUpdate:model-value={(val: unknown) =>
                  (form.value[item.field] = val)
                }
              />
            </ElRow>
          );
        });

        return rows;
      }

      function onSubmit() {
        currentConfig?.value.buildInEditConfig
          ?.createFunc(form.value)
          .then((res) => {
            const config = currentConfig?.value.buildInEditConfig;
            let text: string | undefined;
            if (isCreate.value) {
              text =
                typeof config?.createSuccessTips === "function"
                  ? config?.createSuccessTips(res)
                  : config?.createSuccessTips;
            } else {
              text =
                typeof config?.editSuccessTips === "function"
                  ? config?.editSuccessTips(res)
                  : config?.editSuccessTips;
            }
            ElMessage.success(text || "Success");
          })
          .catch((res) => {
            const config = currentConfig?.value.buildInEditConfig;
            let text: string | undefined;
            if (isCreate.value) {
              text =
                typeof config?.createFailTips === "function"
                  ? config?.createFailTips(res)
                  : config?.createFailTips;
            } else {
              text =
                typeof config?.editFailTips === "function"
                  ? config?.editFailTips(res)
                  : config?.editFailTips;
            }
            ElMessage.error(text || "Fail");
          });
      }

      function onCancel() {
        dialogVisible.value = false;
        window.dispatchEvent(
          new CustomEvent("vue-table-view-destroy-edit-form")
        );
      }

      onMounted(() => {
        dialogVisible.value = true;
      });

      return () => (
        <ElDialog
          modelValue={dialogVisible.value}
          title={dialogTitle.value}
          center={true}
          width={currentConfig?.value.buildInEditConfig?.dialogWidth ?? "400px"}
          destroyOnClose={true}
          beforeClose={onCancel}
        >
          <ElForm
            v-loading={formLoading.value}
            model={form.value}
            rules={rules.value}
            label-width={currentConfig?.value.buildInEditConfig?.formLabelWidth}
            label-suffix={
              currentConfig?.value.buildInEditConfig?.formLabelSuffix
            }
            label-position={
              currentConfig?.value.buildInEditConfig?.formLabelPosition
            }
            size={currentConfig?.value.buildInEditConfig?.formSize}
            // @ts-ignore
            onSubmit={withModifiers(onSubmit, ["prevent"])}
          >
            <input v-show={false} type="submit" />
          </ElForm>
          <template v-slot:footer>
            <ElButton plain onClick={onCancel}>
              {currentConfig?.value.buildInEditConfig
                ?.dialogFooterCancelButtonText ?? "Cancel"}
            </ElButton>
            <ElButton type="primary" plain onClick={onSubmit}>
              {currentConfig?.value.buildInEditConfig
                ?.dialogFooterSubmitButtonText ?? "Submit"}
            </ElButton>
          </template>
        </ElDialog>
      );
    },
  });
