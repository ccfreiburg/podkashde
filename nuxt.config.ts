import { darkMode } from "./tailwind.config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'
  ],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'de',
    locales: [
      { 
        code: "en", 
        file: "en.json",
        name: "English"
      },
      {
        code: "de",
        file: "de.json",
        name: "Deutsch"
      }
    ],
    lazy: true,
    langDir: 'locales',
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    classSuffix: '',
    classPrefix: '',
  },
  runtimeConfig: {
    public: {
      appBase: 'http://localhost:3000',
      apiBase: 'http://localhost:3003/api/',
      mediaBase: 'http://localhost:3003',
      skin: '',
      logo: '/img/logo.png',
      logoDark: '/img/logo-w.png',
      enableDarkMode: false
    }
  },
  nitro: {
    routeRules: {
      "/api/**": { proxy: 'localhost:3003' },
      "/s/**": { proxy: 'localhost:3003' }
    }
  },
  devtools: { enabled: false }
})
