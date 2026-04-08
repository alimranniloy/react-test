/** @type {import('tailwindcss').Config} */
import fs from "node:fs";
import animate from "tailwindcss-animate";

const TW_SAFELIST_PATH = new URL("./src/siteAdmin/editor/tw.json", import.meta.url);
let twSafelist = [];
try {
  twSafelist = JSON.parse(fs.readFileSync(TW_SAFELIST_PATH, "utf8"));
} catch {
  twSafelist = [];
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  safelist: twSafelist,
  theme: {
    extend: {
      fontFamily: {
        code: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ]
      },
      transitionTimingFunction: {
        bezier: "cubic-bezier(0.19, 1, 0.22, 1)"
      },
      width: {
        "editor-left-sidebar": 320,
        "editor-right-sidebar-ui": 300,
        "editor-right-sidebar-code": 500
      },
      colors: {
        outline: "#e8e7e7",
        canvas: "#efefef",
        primary: {
          DEFAULT: "#0066DE",
          50: "#E8F3FF",
          100: "#D4E8FF",
          200: "#ABD2FF",
          300: "#82BCFF",
          400: "#59A5FF",
          500: "#318FFF",
          600: "#0879FF",
          700: "#0066DE",
          800: "#004CA6",
          900: "#00326E"
        },
        secondary: {
          DEFAULT: "#9334e9",
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c085fb",
          500: "#a856f6",
          600: "#9334e9",
          700: "#7e23cd",
          800: "#6b22a7",
          900: "#581d86"
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af"
        }
      }
    }
  },
  plugins: [animate]
};
