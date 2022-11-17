import fs from "fs-extra"
import path from "path"
import type { Nitro } from 'nitropack';
import { nuxtPath } from "./server/services/podcastService";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', "@intlify/nuxt3"],
  ssr: true,
  target: 'server',
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
        const destPackagePath = path.join(
          nitro.options.output.dir,
          'server',
          'node_modules',
          'parse5',
        );
        const packagePath = path.join(
          '.',
          'node_modules',
          'parse5',
          'dist',
          'cjs'
        );

        try {
          fs.copySync(packagePath, destPackagePath, {overwrite: true})
        } catch (err) {}
      },
    },
  },
  runtimeConfig: {
    jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'gb2Coe4mzLWZhXPX',
    jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'nfT8iwa4PSWqcEYj',
    jwtUrlSecret: process.env.JWT_URL_TOKEN_SECRET || 'HkrrdPcdHMXpn3TE',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    adminUser: process.env.ADMIN_USER || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'password'
  }
})
