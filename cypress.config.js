import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    apiBase: 'http://localhost:3003/api/',
    mediaBase: 'http://localhost:3003',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
