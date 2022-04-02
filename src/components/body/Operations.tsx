import { OperationType } from "../../config";
import type {
  Config,
  Dictionary,
  Operation,
  ColumnCallbackParams,
} from "../../config";
import type { VNode, Ref } from "vue";
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElLink,
} from "element-plus";
import { defineComponent, inject } from "vue";

export const Operations = <Row, Search extends Dictionary>() =>
  defineComponent({
    name: "Operations",
    setup() {
      const currentConfig = inject<Ref<Config<Row, Search>>>("currentConfig");

      function buttonRender(
        operation: Operation<Row>,
        scope: ColumnCallbackParams<Row>
      ): VNode {
        return (
          <ElButton
            icon={operation.icon}
            size="small"
            type={operation?.status ?? undefined}
            circle={operation.type === OperationType.ButtonWithIcon}
            disabled={getOperationDisabledValue(operation, scope)}
            onClick={() => onClink(operation, scope)}
          >
            {operation?.label ?? ""}
          </ElButton>
        );
      }

      function linkRender(
        operation: Operation<Row>,
        scope: ColumnCallbackParams<Row>
      ): VNode {
        return (
          <ElLink
            type={operation?.status ?? undefined}
            underline={operation.type === OperationType.Link}
            disabled={getOperationDisabledValue(operation, scope)}
            onClick={() => onClink(operation, scope)}
          >
            {operation?.label ?? ""}
          </ElLink>
        );
      }

      function moreRender(
        operation: Operation<Row>,
        scope: ColumnCallbackParams<Row>
      ): VNode {
        return (
          <ElDropdown
            disabled={getOperationDisabledValue(operation, scope)}
            on-command={(command: Operation<Row>) => onClink(command, scope)}
          >
            {[
              OperationType.ButtonMore,
              OperationType.ButtonWithIconMore,
            ].includes(operation.type!) ? (
              <ElButton
                size="small"
                icon={operation.icon}
                circle={!!operation.icon}
              >
                {operation.label}
              </ElButton>
            ) : (
              <ElLink underline={operation.type === OperationType.Link}>
                {operation?.label ?? ""}
                <i class="el-icon-arrow-down el-icon--right" />
              </ElLink>
            )}
            <ElDropdownMenu>
              {(operation?.children || []).map((item) => (
                <ElDropdownItem
                  command={item}
                  divided={item.divided}
                  disabled={getOperationDisabledValue(item, scope)}
                >
                  {item.label}
                </ElDropdownItem>
              ))}
            </ElDropdownMenu>
          </ElDropdown>
        );
      }

      function onClink(
        operation: Operation<Row>,
        scope: ColumnCallbackParams<Row>
      ): void {
        if (!getOperationDisabledValue(operation, scope)) {
          operation?.onClick && operation.onClick(scope.row as Row);
        }
      }

      function getOperationDisabledValue(
        operation: Operation<Row>,
        scope: ColumnCallbackParams<Row>
      ): boolean {
        if (typeof operation.disabled === "function") {
          return operation.disabled(scope.row as Row);
        }

        return false;
      }

      return () => (
        <vxe-column
          title={currentConfig?.value.operationConfig!.headerTitle}
          width={currentConfig?.value.operationConfig?.width}
          min-width={currentConfig?.value.operationConfig?.minWidth}
          class-name="table-view__body-operations"
          {...{
            scopedSlots: {
              default: (scope: ColumnCallbackParams<Row>): VNode => {
                const TagName = currentConfig?.value.operationConfig
                  ?.surroundByButtonGroup
                  ? "el-button-group"
                  : "div";
                return (
                  <TagName>
                    {(
                      currentConfig?.value.operationConfig?.operations ?? []
                    ).map((operation) => {
                      switch (operation.type) {
                        case OperationType.Button:
                        case OperationType.ButtonWithIcon:
                          return buttonRender(operation, scope);
                        case OperationType.Link:
                        case OperationType.LinkWithoutUnderline:
                          return linkRender(operation, scope);
                        case OperationType.ButtonMore:
                        case OperationType.ButtonWithIconMore:
                        case OperationType.LinkMore:
                        case OperationType.LinkWithoutUnderlineMore:
                          return moreRender(operation, scope);
                        default:
                          return linkRender(operation, scope);
                      }
                    })}
                  </TagName>
                );
              },
            },
          }}
        />
      );
    },
  });
