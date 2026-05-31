<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/lore" class="btn-back">← Lore</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Página Lore' : 'Nueva Página Lore' }}</h1>
      <div style="display:flex;gap:8px;margin-left:auto">
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
          <Field label="Título *"><input v-model="f.titulo" /></Field>
          <Field label="Slug">
            <input v-model="f.slug" placeholder="ej: historia-del-mundo" />
            <span class="hint">URL: /lore/{{ f.slug || 'slug-aqui' }}</span>
          </Field>
          <Field label="Subtítulo"><input v-model="f.subtitulo" /></Field>
        </div>
        <div class="section">
          <div class="sec-title">Contenido</div>
          <Field label="Introducción"><textarea v-model="f.introduccion" rows="4" /></Field>
          <Field label="Sección 1 — Título"><input v-model="f.seccion1_titulo" /></Field>
          <Field label="Sección 1 — Contenido"><RichEditor v-model="f.seccion1_contenido" /></Field>
          <Field label="Sección 2 — Título"><input v-model="f.seccion2_titulo" /></Field>
          <Field label="Sección 2 — Contenido"><RichEditor v-model="f.seccion2_contenido" /></Field>
          <Field label="Sección 3 — Título"><input v-model="f.seccion3_titulo" /></Field>
          <Field label="Sección 3 — Contenido"><RichEditor v-model="f.seccion3_contenido" /></Field>
          <Field label="Sección 4 — Título"><input v-model="f.seccion4_titulo" /></Field>
          <Field label="Sección 4 — Contenido"><RichEditor v-model="f.seccion4_contenido" /></Field>
          <Field label="Sección 5 — Título"><input v-model="f.seccion5_titulo" /></Field>
          <Field label="Sección 5 — Contenido"><RichEditor v-model="f.seccion5_contenido" /></Field>
          <Field label="Sección 6 — Título"><input v-model="f.seccion6_titulo" /></Field>
          <Field label="Sección 6 — Contenido"><RichEditor v-model="f.seccion6_contenido" /></Field>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/lore" />
            </Field>
            <Field label="Banner">
              <CloudinaryUpload v-model="f.banner_url" label="Banner" icon="🖼" folder="wikiastralys/lore/banners" />
            </Field>
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
<style scoped>
.hint { font-size: 0.78rem; color: #3a2a10; font-style: italic; margin-top: 2px; }
</style>
