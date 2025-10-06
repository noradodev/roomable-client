import km from "./locales/km.json";
import en from "./locales/en.json";


export default defineI18nConfig(() => ({
  legacy: false,
  locale: "km",
  messages: {
    km: km,
    en: en,
   
  },
}));
