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
  devtools: { enabled: true }
})
