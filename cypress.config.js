import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    appBase: 'http://localhost:3000',
    apiBase: 'http://localhost:3003/api/',
    mediaBase: 'http://localhost:3003'
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
