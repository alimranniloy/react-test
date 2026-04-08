import { fileURLToPath, URL } from "node:url";
import viteCompression from "vite-plugin-compression";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import {
  vitePlugin as utwm,
  defaultMangleClassFilter,
} from "unplugin-tailwindcss-mangle";
const ASSET_PATH = "https://bponi.sgp1.cdn.digitaloceanspaces.com";
export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: "brotliCompress",
    }),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    vue(),
    utwm({
      mangleClassFilter(className) {
        if (
          ["ease-out", "ease-linear", "ease-in", "ease-in-out"].includes(
            className
          )
        ) {
          return false;
        }
        return defaultMangleClassFilter(className);
      },
      classGenerator: { classPrefix: "bponi-" },
      classSetOutput: true,
      classMapOutput: true,
      jsHandlerOptions: {
        minified: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "process.env": {},
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        assetFileNames:
          "assets/[name]-" + generateRandomString(5) + "-[hash:12][extname]",
        manualChunks: {
          lodash: ["lodash"],
        },
      },
    },
  },
  experimental: {
    renderBuiltUrl(filename, { hostId, hostType, type }) {
      if (type === "public") {
        return ASSET_PATH + "/asset/site/site-app/" + filename;
      } else {
        return ASSET_PATH + "/asset/site/site-app/" + filename;
      }
    },
  },
  clearScreen: false,
  server: {
    port: 5107,
    host: "0.0.0.0",
  },
});
function generateRandomString(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomIndex);
  }

  return randomString;
}
