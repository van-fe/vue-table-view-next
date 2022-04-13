import type { Component } from "vue";
import { createApp } from "vue";

export default function (
  component: Component,
  props: Record<string, unknown> = {}
) {
  const app = createApp(component, props);
  const div = document.createElement("div");
  document.body.append(div);
  app.mount(div);

  return () => {
    app.unmount();
    document.body.removeChild(div);
  };
}
