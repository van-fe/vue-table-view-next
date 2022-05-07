import type { Component, PropType } from "vue";
import { defineComponent, reactive, ref, toRef, watch } from "vue";
import {
  ElTag,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
} from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { StringHelper } from "@/utils/helper/StringHelper";

export interface VueTableViewCollapseTagsType {
  text: string;
  params?: Record<string, unknown>;
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
    clickable: {
      type: Boolean,
      default: false,
    },
    resort: {
      type: Boolean,
      default: true,
    },
    separator: {
      type: String,
      default: "",
    },
  },
  emits: ["click", "close"],
  setup(props, { emit }) {
    const tags = toRef(props, "tags");

    function sortTags() {
      tags.value.sort((a, b) => {
        const aZhLength = StringHelper.getChineseLetterLength(a.text);
        const aLength = a.text.length + aZhLength;
        const bZhLength = StringHelper.getChineseLetterLength(b.text);
        const bLength = b.text.length + bZhLength;

        return aLength - bLength;
      });
    }

    watch(
      () => tags.value,
      () => {
        if (props.resort) {
          sortTags();
        }
      },
      {
        immediate: true,
      }
    );

    function onClick(tag: VueTableViewCollapseTagsType) {
      emit("click", tag);
    }

    function onClose(tag: VueTableViewCollapseTagsType) {
      emit("close", tag);
    }

    function onCommand(index: number) {
      emit("click", tags.value[index + props.maxShowOutside]);
    }

    const slots = reactive({
      dropdown: () => (
        <ElDropdownMenu>
          {...tags.value.slice(props.maxShowOutside).map((tag, index) => (
            <ElDropdownItem {...tag} command={index}>
              {tag.text}
            </ElDropdownItem>
          ))}
        </ElDropdownMenu>
      ),
    });

    function renderExceedTags() {
      return props.tags.length > props.maxShowOutside ? (
        <ElDropdown v-slots={slots} onCommand={onCommand}>
          <ElTag type="info">
            {props.moreTagText}
            <ElIcon>
              <ArrowDown />
            </ElIcon>
          </ElTag>
        </ElDropdown>
      ) : undefined;
    }

    const classList = ref(["collapse-tags"]);

    if (props.clickable) {
      classList.value.push("clickable");
    }

    return () => (
      <div class={classList.value}>
        {...tags.value.slice(0, props.maxShowOutside).map((tag, index, arr) => (
          <span class="collapse-tags-item">
            <ElTag
              {...tag}
              onClick={() => onClick(tag)}
              onClose={() => onClose(tag)}
            >
              {tag.text}
            </ElTag>
            {index < arr.length - 1 ? (
              <span class="separator">{props.separator}</span>
            ) : undefined}
          </span>
        ))}
        {renderExceedTags()}
      </div>
    );
  },
});
