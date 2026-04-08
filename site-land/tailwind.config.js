const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.html",
    "./src/**/*.vue",
    "./src/**/*.js",
    "./src/*.js",
    "./src/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf8f3",
          100: "#d6eee3",
          200: "#a8dcc6",
          300: "#7dcaae",
          400: "#35a37e",
          500: "#1d8c66",
          600: "#0f6e4f",
          700: "#0c5a41",
          800: "#094833",
          900: "#083b2a",
        },
        sand: {
          50: "#f6f1ea",
          100: "#eae0d2",
          200: "#d8c3a8",
          300: "#c6a47c",
          400: "#b8885a",
          500: "#a86d3c",
          600: "#8f5830",
          700: "#734527",
          800: "#5c3620",
          900: "#4b2c1c",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", ...defaultTheme.fontFamily.sans],
        body: ["'Manrope'", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
};
