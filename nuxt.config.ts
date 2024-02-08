// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "nuxt-primevue",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    'dayjs-nuxt'
  ],
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
  ],
  supabase: {
    redirect: false,
  },
});
