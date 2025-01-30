module.exports = {
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",
      },
      colors: {
        gray: {
          100: "#FBFBFB",
          200: "#c2c7ca",
          300: "#b8bcbf",
          400: "#999999",
          500: "#7F7F7F",
          600: "#666666",
          700: "#4C4C4C",
          800: "#121212",
          900: "#191919",
        },
        "slate-450": "#8191a0",
        "slate-475": "#728293",
        "flux-input-400": "#1f252d",
        "flux-input-500": "#1a1f26",
        "flux-input-600": "#14181e",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
