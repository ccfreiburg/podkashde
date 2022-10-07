import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', "@intlify/nuxt3"],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },
  colorMode: {
    classSuffix: ''
  },
  intlify: {
    localeDir: "locales",
    vueI18n: {
      legacy: false,
      locale: "en",
      fallbackLocale: "en",
      globalInjection: true,
      sync: true,
      availableLocales: ["de", "en"],
    },
  },
  buildModules: ["@intlify/nuxt3"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {
          grid: true,
          flexbox: true
      },
    },
  },
  nitro: {
    preset: 'node-server'
  }
})
