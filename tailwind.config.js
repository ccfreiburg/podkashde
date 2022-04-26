// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: [
    "./components/**/*.{vue,js}",
    "./app.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
