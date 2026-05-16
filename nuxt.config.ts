export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxtjs/google-fonts'],
  css: ['~/assets/css/main.css'],
  supabase: { redirect: false },
  googleFonts: {
    families: {
      Cinzel: [400, 600, 700],
      'Crimson Pro': { wght: [300, 400], ital: [300, 400] }
    }
  }
})