import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from "@vitejs/plugin-vue-jsx";
import { VxeTableResolve } from 'vite-plugin-style-import';
import ElementPlus from "unplugin-element-plus/vite";
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element-variables.scss" as *;`,
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueTableViewNext',
      fileName: (format) => `vue-table-view-next.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'ElementPlus'],
      output: {
        exports: "named",
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    ElementPlus({
      useSource: true,
    }),
    VxeTableResolve(),
  ],
});
