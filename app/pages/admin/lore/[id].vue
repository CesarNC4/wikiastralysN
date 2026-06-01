<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/lore" class="btn-back">← Lore</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Página Lore' : 'Nueva Página Lore' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit && f.slug" :to="`/lore/${f.slug}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/lore', 'titulo')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Identificación</div>
          <div class="f-group">
            <label class="f-lbl">Título *</label>
            <input class="f-inp" v-model="f.titulo" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Slug</label>
            <input class="f-inp" v-model="f.slug" placeholder="ej: historia-del-mundo" />
            <span class="hint">URL: /lore/{{ f.slug || 'slug-aqui' }}</span>
          </div>
          <div class="f-group">
            <label class="f-lbl">Subtítulo</label>
            <input class="f-inp" v-model="f.subtitulo" />
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Contenido</div>
          <div class="f-group">
            <label class="f-lbl">Introducción</label>
            <textarea class="f-area" v-model="f.introduccion" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 1 — Título</label>
            <input class="f-inp" v-model="f.seccion1_titulo" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 1 — Contenido</label>
            <RichEditor v-model="f.seccion1_contenido" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 2 — Título</label>
            <input class="f-inp" v-model="f.seccion2_titulo" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 2 — Contenido</label>
            <RichEditor v-model="f.seccion2_contenido" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 3 — Título</label>
            <input class="f-inp" v-model="f.seccion3_titulo" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 3 — Contenido</label>
            <RichEditor v-model="f.seccion3_contenido" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 4 — Título</label>
            <input class="f-inp" v-model="f.seccion4_titulo" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 4 — Contenido</label>
            <RichEditor v-model="f.seccion4_contenido" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 5 — Título</label>
            <input class="f-inp" v-model="f.seccion5_titulo" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 5 — Contenido</label>
            <RichEditor v-model="f.seccion5_contenido" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 6 — Título</label>
            <input class="f-inp" v-model="f.seccion6_titulo" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Sección 6 — Contenido</label>
            <RichEditor v-model="f.seccion6_contenido" />
          </div>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/lore" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Banner</label>
            <CloudinaryUpload v-model="f.banner_url" folder="wikiastralys/lore/banners" />
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Visibilidad</div>
          <label class="check-label"><input type="checkbox" v-model="f.visible" /> Visible al público</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const f = ref({
  titulo: '', slug: '', subtitulo: '', introduccion: '',
  seccion1_titulo: '', seccion1_contenido: '',
  seccion2_titulo: '', seccion2_contenido: '',
  seccion3_titulo: '', seccion3_contenido: '',
  seccion4_titulo: '', seccion4_contenido: '',
  seccion5_titulo: '', seccion5_contenido: '',
  seccion6_titulo: '', seccion6_contenido: '',
  imagen_url: '', banner_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('paginas_lore', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
