// https://nuxt.com/docs/api/configuration/nuxt-config

function setEnv( direct: string | undefined, defaultval = "",  indirect: string | undefined = undefined, indirect_postfix: string = "") : string {
  if (direct && direct.length > 0)
    return direct
  if (indirect && indirect.length > 0)
    return indirect + indirect_postfix
  return defaultval
}

function setEnvBool( envvar: string | undefined, defaultval: boolean | undefined = undefined ) : boolean {
  if (envvar && envvar.length>0 && envvar.toLowerCase()!=="false")
    return true 
  else
    return defaultval ?? false
}

function setEnvUndefinedWhenEmpty( envvar: string | undefined ) :string | undefined {
  if (envvar && envvar.length>0 && envvar.toLowerCase()!=="false")
    return envvar
  else
    return undefined
}

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'
  ],
  extends: [ 'nuxt-umami' ],
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
  // css: [ './assets/css/tailwind.css' 
  // ],
  // app: {
  //   pageTransition: {
  //     name: 'page',
  //     mode: 'out-in'
  //   }
  // },
  runtimeConfig: {
    public: {
      url: process.env.NUXT_PUBLIC_URL,
      appBase: setEnv(process.env.NUXT_PUBLIC_APP_BASE, 'http://localhost:3000', process.env.NUXT_PUBLIC_URL),
      apiBase: setEnv(process.env.NUXT_PUBLIC_API_BASE, 'http://localhost:3003/api/', process.env.NUXT_PUBLIC_URL, "/api/") ,
      mediaBase: setEnv(process.env.NUXT_PUBLIC_MEDIA_BASE, 'http://localhost:3003', process.env.NUXT_PUBLIC_URL),
      skin: setEnv(process.env.NUXT_PUBLIC_SKIN,''),
      logo: setEnv(process.env.NUXT_PUBLIC_LOGO, '/img/logo.png'),
      logoDark: setEnv(process.env.NUXT_PUBLIC_LOGO_DARK, '/img/logo-w.png'),
      enableDarkMode: setEnvUndefinedWhenEmpty(process.env.NUXT_PUBLIC_ENABLE_DARK_MODE),
      umamiActive: setEnvBool(process.env.NUXT_PUBLIC_UMAMI_ID)
    }
  },
  appConfig: {
    umami: {
      autoTrack: setEnvBool(process.env.NUXT_PUBLIC_UMAMI_ID),
      version: 2
  }},
  // nitro: {
  //   routeRules: {
  //     "/api/**": { proxy: 'localhost:3003' },
  //     "/s/**": { proxy: 'localhost:3003' }
  //   }
  // },
  devtools: { enabled: false }
})
