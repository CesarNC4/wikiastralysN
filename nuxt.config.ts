export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxtjs/google-fonts'],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      exclude: ['/', '/personajes/**', '/capitulos/**', '/naciones/**', '/razas/**',
        '/organizaciones/**', '/familias/**', '/bestiario/**', '/lord-demonio/**',
        '/armas/**', '/magia/**', '/minerales/**', '/misiones/**', '/conceptos/**',
        '/banda-sonora', '/lore/**', '/economia', '/timeline', '/busqueda', '/gremio',
        '/historia', '/cosmos'],
    },
  },
  googleFonts: {
    families: {
      Cinzel: [400, 600, 700],
      'Cormorant Garamond': [300, 400, 600, 700],
      'Crimson Pro': { wght: [300, 400], ital: [300, 400] }
    }
  },
  runtimeConfig: {
    public: {
      cloudinaryCloudName:   process.env.CLOUDINARY_CLOUD_NAME   ?? '',
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ?? '',
    }
  }
})
