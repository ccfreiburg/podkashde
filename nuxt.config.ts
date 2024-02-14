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
      appBase: process.env.NUXT_PUBLIC_APP_BASE ?? 'http://localhost:3000',
      apiBase: process.env.NUXT_PUBLIC_API_BASE ??'http://localhost:3003/api/',
      mediaBase: process.env.NUXT_PUBLIC_MEDIA_BASE ??'http://localhost:3003',
      skin: process.env.NUXT_PUBLIC_SKIN ?? '',
      logo: process.env.NUXT_PUBLIC_LOGO ?? '/img/logo.png',
      logoDark: process.env.NUXT_PUBLIC_LOGO_DARK ??'/img/logo-w.png',
      enableDarkMode: process.env.NUXT_PUBLIC_ENABLE_DARK_MODE ?? false
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
