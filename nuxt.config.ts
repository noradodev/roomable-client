import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@sidebase/nuxt-auth",
    "@pinia/nuxt",
    "nuxt-qrcode"
  ],
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
  runtimeConfig: {
    baseURL: process.env.API_SERVER_ENDPOINT,
    public: {
      apiBase: process.env.API_SERVER_ENDPOINT,
      mediaUrl: process.env.MEDIA_URL
    },
  },
  auth: {
    isEnabled: true,
    baseURL: process.env.API_SERVER_ENDPOINT,
    globalAppMiddleware: true,
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "/login", method: "post" },
        signOut: { path: "/logout", method: "post" },
        signUp: { path: "/register", method: "post" },
        getSession: { path: "/me", method: "get" },
      },
      token: {
        signInResponseTokenPointer: '/data/token',
        headerName: 'Authorization',
        type: 'Bearer',
      },
      session: {
      dataResponsePointer: '/data/curr_user', 
    },
    },
  },
  image: {
    format: ["webp"],
    domains: ["*"],
  },
  plugins: ["~/plugins/axios.client.ts"],
});