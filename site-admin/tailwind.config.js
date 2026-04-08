const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/**/*.html",
    "./src/**/*.vue",
    "./src/*.js",
    "./src/*.vue",
    "./node_modules/vue-tailwind-datepicker/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "vtd-primary": colors.sky,
        "vtd-secondary": colors.gray,
      },
      width: {
        a4: "210mm",
        a4_half: "100mm",
        pos: "210mm",
      },
      height: {
        a4: "297mm",
        a4_half: "297mm",
        pos: "297mm",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
