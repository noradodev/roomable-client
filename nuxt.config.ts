import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxtjs/i18n", '@nuxt/image'],
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  colorMode: {
    preference: "light",
  },
  ui: {
    fonts: false,
  },
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "km",
    detectBrowserLanguage: false,
    vueI18n: "./i18n.config.ts",
    locales: [
      {
        code: "km",
        name: "Khmer",
      },
      {
        code: "en",
        name: "English",
      },
      
    ],
  },
  image: {
    format: ['webp'],
    domains: ['*']
  }
});
