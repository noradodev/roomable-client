import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxtjs/i18n"],
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  colorMode: {
    preference: "light",
  },
   ui: {
    fonts: false
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'km',
    locales: [{
      code: 'km',
      language: 'km',
      name: 'Khmer',
      file: 'km.json'
    }, {
      code: 'en',
      language: 'en',
      name: 'English',
       file: 'en.json'
    }]
  }
});
