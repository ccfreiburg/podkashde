import fs from "fs-extra"
import path from "path"
import type { Nitro } from 'nitropack';
import { defineNuxtConfig } from "nuxt/config";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/i18n','nuxt-umami'],
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
    vueI18n: {
      fallbackLocale: 'de'
    }
  },
  umami: {
    enable: true, // enable the module? true by default
    autoTrack: true,
    doNotTrack: false,
    cache: false,
    domains: process.env.UMAMI_DOMAINS || 'podcast.ccfreiburg.de',
    websiteId: process.env.UMAMI_KEY || '4b79e0da-e70b-430b-b0ea-978691c32f55',
    scriptUrl: process.env.UMAMI_AP || 'https://analytics.ccfreiburg.de/umami.js',
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
        packages.push({
          dest:path.join(
          nitro.options.output.dir,
          'server',
          'node_modules',
          'sqlite3'),
          src: path.join(
          '.',
          'node_modules',
          'sqlite',
          'lib')
        })
        try {
          packages.forEach(pack => {
            fs.copySync(pack.src, pack.dest, {overwrite: true})           
          });
        } catch (err) {}
      },
    },
  }
})
