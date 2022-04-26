import type { Dictionary } from "@/config/common";

declare global {
  interface WindowEventMap {
    "vue-table-view-current-page-change": CustomEvent<{ page: number }>;
    "vue-table-view-page-size-change": CustomEvent<{ size: number }>;
    "vue-table-view-destroy-edit-form": CustomEvent;
    "vue-table-view-edit-form-submit-finished": CustomEvent;
  }
}
