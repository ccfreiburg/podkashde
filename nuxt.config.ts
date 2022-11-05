import fs from "fs"
import path from "path"
import type { Nitro } from 'nitropack';
import { dev } from "process";

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
        const packagePath = path.join(
          nitro.options.output.dir,
          'server',
          'node_modules',
          'parse5',
          'package.json'
        );

        try {
          const packageContent = fs.readFileSync(packagePath, 'utf-8');

          fs.writeFileSync(
            packagePath,
            packageContent.replace('"main": "./lib/index.js"', '"main": "./lib/common/doctype.js"')
          );
        } catch (err) {}
      },
    },
  }
})
