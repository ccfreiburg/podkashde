import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
      globals: true,
      deps: {
      inline: [
        "typeorm", "@nuxt/test-utils-edge"

      ]
    }
  },  
})
