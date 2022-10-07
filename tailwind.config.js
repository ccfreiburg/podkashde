module.exports = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
    },
    plugins: [],
  },
  variants: {
    extend: {
      ring: ['focus'],
      outline: ['focus'],
      border: ['valid'],
    },
  },
};
