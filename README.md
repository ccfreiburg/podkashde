# Podkashde

Podkashde is a jamstack podcast management system. It is based on [nuxt 3](https://v3.nuxtjs.org). It is suposed to be a replacement for a podcast hostet on wordpress with seriously simple podcast and allows to migrate the podsts and metadata.

It uses a sqlite database. That way backup is easy, just backup the files in the directory public/s
All assets (mp3s, cover images) can be served statically from the public/s directoy

## Development

You need node version 16. 
Clone the repo. Install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Standalone Production

Build the application for production:

```bash
npm run build
```