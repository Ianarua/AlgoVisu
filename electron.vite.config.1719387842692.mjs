// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { swcPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), swcPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer/src"),
        "@resources": resolve("./resources")
      }
    },
    plugins: [react()],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  }
});
export {
  electron_vite_config_default as default
};
