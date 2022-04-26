import type { Component, PropType } from "vue";
import { defineComponent, reactive } from "vue";
import {
  ElTag,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
} from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";

export interface VueTableViewCollapseTagsType {
  text: string;
  /* for tag */
  type?: "" | "success" | "warning" | "info" | "danger";
  closable?: boolean;
  disableTransitions?: boolean;
  hit?: boolean;
  color?: string;
  size?: "large" | "default" | "small";
  effect?: "dark" | "light" | "plain";
  round?: boolean;
  /* for dropdown-item */
  disabled?: boolean;
  divided?: boolean;
  icon?: string | Component;
}

export const CollapseTags = defineComponent({
  name: "CollapseTags",
  props: {
    maxShowOutside: {
      type: Number,
      default: 2,
    },
    tags: {
      type: Array as PropType<VueTableViewCollapseTagsType[]>,
      required: true,
    },
    moreTagText: {
      type: String,
      default: "More",
    },
  },
  emits: ["click", "close"],
  setup(props, { emit }) {
    function onClick(tag: VueTableViewCollapseTagsType) {
      emit("click", tag);
    }

    function onClose(tag: VueTableViewCollapseTagsType) {
      emit("close", tag);
    }

    function onCommand(index: number) {
      emit("click", props.tags[index + props.maxShowOutside]);
    }

    const slots = reactive({
      dropdown: () => (
        // @ts-ignore
        <ElDropdownMenu onCommand={onCommand}>
          {...props.tags.slice(props.maxShowOutside).map((tag, index) => (
            <ElDropdownItem {...tag} command={index}>
              {tag.text}
            </ElDropdownItem>
          ))}
        </ElDropdownMenu>
      ),
    });

    function renderExceedTags() {
      return props.tags.length > props.maxShowOutside ? (
        <ElDropdown v-slots={slots}>
          <ElTag type="info">
            {props.moreTagText}
            <ElIcon>
              <ArrowDown />
            </ElIcon>
          </ElTag>
        </ElDropdown>
      ) : undefined;
    }

    return () => (
      <div class="collapse-tags">
        {...props.tags.slice(0, props.maxShowOutside).map((tag) => (
          <ElTag
            {...tag}
            onClick={() => onClick(tag)}
            onClose={() => onClose(tag)}
          >
            {tag.text}
          </ElTag>
        ))}
        {renderExceedTags()}
      </div>
    );
  },
});
