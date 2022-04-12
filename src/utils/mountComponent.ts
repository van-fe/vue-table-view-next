import type { Component } from "vue";
import { createApp } from "vue";

export default function (
  component: Component,
  props: Record<string, unknown> = {}
) {
  const app = createApp(component, props);
  app.mount(document.body);

  return () => {
    app.unmount();
  };
}
