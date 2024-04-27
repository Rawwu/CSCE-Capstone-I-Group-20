module.exports = {
  content: ["node_modules/preline/dist/*.js", "./src/**/*.{html,js}"],
  darkMode: "class",
  important: true,
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },

    fontFamily: {
      sans: ['"Inter"', "sans-serif"],
    },
  },

  plugins: [require("preline/plugin")],
};
