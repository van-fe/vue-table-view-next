declare global {
  interface WindowEventMap {
    "vue-table-view-current-page-change": CustomEvent<{ page: number }>;
    "vue-table-view-page-size-change": CustomEvent<{ size: number }>;
    "vue-table-view-refresh-table": CustomEvent;
    "vue-table-view-destroy-edit-form": CustomEvent;
  }
}

export {};
