import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import preload from "vite-plugin-preload";

export default () => {
  return defineConfig({
    plugins: [react(), preload()],
    server: {
      port: 9910,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import \"./src/styles/theme/theme.module.scss\";",
        },
      },
    },
    envPrefix: "APP_",
    envDir: "environments"
  });
};
