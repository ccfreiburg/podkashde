function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

module.exports = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      textColor: {
        skin: {
          'base': withOpacity('--color-text-base'),
          'dark': withOpacity('--color-text-dark'),
          'muted': withOpacity('--color-text-muted'),
          'inverted': withOpacity('--color-text-inverted'),
          'accent': withOpacity('--color-text-accent'),
          'error': withOpacity('--color-error'),
        },
      },
      backgroundColor: {
        skin: {
          'light': withOpacity('--color-bg-light'),
          'dark': withOpacity('--color-bg-dark'),
          'muted': withOpacity('--color-bg-muted'),
          'muted-dark': withOpacity('--color-bg-muted-dark'),
          'fill': withOpacity('--color-fill'),
          'button-accent': withOpacity('--color-button-accent'),
          'button-accent-hover': withOpacity('--color-button-accent-hover'),
          'button-muted': withOpacity('--color-button-muted'),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity('--color-fill'),
          from: withOpacity('--color-grad-start'),
          via: withOpacity('--color-grad-via'),
          to: withOpacity('--color-grad-end'),
        },
      },
      ringColor: {
        skin: {
          'error': withOpacity('--color-error'),
          'fokus': withOpacity('--color-button-muted'),
          'dark': withOpacity('--color-bg-muted-dark'),
          'light': withOpacity('--color-bg-muted'),
        }
      }
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
