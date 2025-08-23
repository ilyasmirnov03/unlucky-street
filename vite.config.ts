import { defineConfig } from "vite";

export default defineConfig({
  build: {
    modulePreload: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
