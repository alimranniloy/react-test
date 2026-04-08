import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import {
  defaultMangleClassFilter,
  vitePlugin as utwm,
} from "unplugin-tailwindcss-mangle";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
const ASSET_PATH = "https://bponi.sgp1.cdn.digitaloceanspaces.com";
export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: "brotliCompress",
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["marquee"].includes(tag),
        },
      },
    }),
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
        return ASSET_PATH + "/asset/store/store-optimum/" + filename;
      } else {
        return ASSET_PATH + "/asset/store/store-optimum/" + filename;
      }
    },
  },
  clearScreen: false,
  server: {
    host: "0.0.0.0",
    port: 5120,
    strictPort: true,
    allowedHosts: true, // allow all hosts
    cors: true,
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
