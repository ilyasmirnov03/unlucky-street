import { defineConfig } from "vite";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({}),
    ViteMinifyPlugin({}),
  ],
  build: {
    rollupOptions: {
      external: [
        'banner.png',
        'icon.png',
      ],
    },
    modulePreload: false,
    minify: "terser",
    terserOptions: {
      mangle: {
        toplevel: true,
        eval: true,
        properties: true,
      },
      compress: {
        booleans_as_integers: true,
        drop_console: true,
        drop_debugger: true,
        ecma: 2020,
        hoist_funs: true,
        hoist_vars: false,
        module: true,
        toplevel: true,
      },
      format: {
        comments: false,
      }
    },
  },
});
