import fs from "fs-extra"
import path from "path"
import type { Nitro } from 'nitropack';
import { nuxtPath } from "./server/services/podcastService";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', "@intlify/nuxt3"],
  ssr: true,
  target: 'server',
  head: {
    title: "Podcasts",
    meta: {
      charset: "UTF-8",
    }
  },
  generate: {
    exclude: [
      /^\/admin/ // path starts with /admin
    ]
  },
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
    preset: 'node-server',
    hooks: {
      compiled(nitro: Nitro) {
        const packages = []
        packages.push({
          dest:path.join(
          nitro.options.output.dir,
          'server',
          'node_modules',
          'parse5'),
          src: path.join(
          '.',
          'node_modules',
          'parse5',
          'dist',
          'cjs')
        })
        packages.push({
          dest:path.join(
          nitro.options.output.dir,
          'server',
          'node_modules',
          'entities'),
          src: path.join(
          '.',
          'node_modules',
          'entities')
        })
        try {
          packages.forEach(pack => {
            fs.copySync(pack.src, pack.dest, {overwrite: true})           
          });
        } catch (err) {}
      },
    },
  },
  runtimeConfig: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    defaultRoute: process.env.DEFAULT_ROUTE || '/recent',
    jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'gb2Coe4mzLWZhXPX',
    jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'nfT8iwa4PSWqcEYj',
    jwtUrlSecret: process.env.JWT_URL_TOKEN_SECRET || 'HkrrdPcdHMXpn3TE',
    adminUser: process.env.ADMIN_USER || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'password'
  }
})
