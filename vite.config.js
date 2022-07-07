import { defineConfig } from "vite";
import { ReScriptDynamicImportVitePlugin } from "./ReScriptDynamicImportVitePlugin.mjs";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: process.env.APP_PATH ?? "/",
  plugins: [reactRefresh(), ReScriptDynamicImportVitePlugin()],
  server: {
    port: 8888,
  },
  build: {
    sourcemap: true,
    polyfillDynamicImport: false,
    target: "esnext",
    rollupOptions: {
      plugins: [visualizer()],
      output: {
        format: "esm",
      },
    },
  },
  // Prevent ReScript messages from being lost when we run all things at the same time.
  clearScreen: false,
});
