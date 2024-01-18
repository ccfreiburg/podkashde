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
    apiBase: (process.env.API_BASE?process.env.API_BASE as string:'/api/'),
    mediaBase: (process.env.MEDIA_BASE?process.env.MEDIA_BASE as string:''),
  },
  devtools: { enabled: true }
})
