module.exports = {
  darkMode: "class",
  content: ["./src/**/*.html", "./src/**/*.vue", "./src/*.js", "./src/*.vue"],
  theme: {
    extend: {
      colors: {
        "optimum-ink": "#021f2a",
        "optimum-forest": "#07373f",
        "optimum-emerald": "#23d2b2",
        "optimum-mint": "#6ef3c5",
        "optimum-gold": "#f3c98b",
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        body: ["Sora", "Inter", "sans-serif"],
      },
      boxShadow: {
        "all-sides":
          "0 6px 12px rgba(0, 0, 0, 0.2), 0 -2px 4px rgba(0, 0, 0, 0.05)",
        "optimum-card":
          "0 25px 60px rgba(3, 15, 17, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },
      screens: {
        xs: "360px",
        "3xl": "1600px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        pingSmooth: {
          "0%": {
            transform: "scale(1)",
            opacity: "0.7",
          },
          "40%": {
            transform: "scale(1.35)",
            opacity: "0.45",
          },
          "70%": {
            transform: "scale(1.2)",
            opacity: "0.55",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "0.7",
          },
        },
        floatSoft: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "ping-smooth": "pingSmooth 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        marquee: "marquee 25s linear infinite",
        "float-soft": "floatSoft 16s ease-in-out infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
};
