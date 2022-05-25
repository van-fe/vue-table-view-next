declare global {
  interface WindowEventMap {
    "vue-table-view-current-page-change": CustomEvent<{
      page: number;
      id: symbol;
    }>;
    "vue-table-view-page-size-change": CustomEvent<{
      size: number;
      id: symbol;
    }>;
    "vue-table-view-destroy-edit-form": CustomEvent<{ id: symbol }>;
    "vue-table-view-edit-form-submit-finished": CustomEvent<{ id: symbol }>;
  }
}

export {};
