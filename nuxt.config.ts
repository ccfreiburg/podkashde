// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n', '@nuxtjs/tailwindcss'
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
  runtimeConfig: {
    public: {
      appBase: 'http://localhost:3000',
      apiBase: 'http://localhost:3003/api/',
      mediaBase: 'http://localhost:3003'
    }
  },
  nitro: {
    routeRules: {
      "/api/**": { proxy: 'localhost:3003' },
      "/s/**": { proxy: 'localhost:3003' }
    }
  },
  devtools: { enabled: true }
})
