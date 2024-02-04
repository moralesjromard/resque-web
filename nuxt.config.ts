// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["nuxt-primevue", "@nuxtjs/supabase"],
  css: ["primevue/resources/themes/aura-light-blue/theme.css"],
  supabase: {
    redirect: false,
  },
  // supabase: {
  //   url: process.env.SUPABASE_URL,
  //   key: process.env.SUPABASE_KEY,
  //   redirectOptions: {
  //     login: "/login",
  //     callback: "/confirm",
  //     exclude: ["/login"],
  //   },
  // },
});
