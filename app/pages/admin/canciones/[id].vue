<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/canciones" class="btn-back">← Canciones</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Canción' : 'Nueva Canción' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/canciones', 'titulo')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Información</div>
          <Field label="Título *"><input v-model="f.titulo" /></Field>
          <Field label="Artista / Compositor"><input v-model="f.artista" placeholder="Nombre real o ficticio" /></Field>
          <Field label="Tipo / Categoría">
            <select v-model="f.tipo_fuente">
              <option value="YOUTUBE">YouTube</option>
              <option value="SPOTIFY">Spotify</option>
              <option value="LOCAL">Local</option>
              <option value="Tema de Personaje">Tema de Personaje</option>
              <option value="Tema de Batalla">Tema de Batalla</option>
              <option value="Tema Ambiental">Tema Ambiental</option>
              <option value="Tema de Arco">Tema de Arco</option>
              <option value="Tema Emocional">Tema Emocional</option>
              <option value="Intro/Outro">Intro / Outro</option>
            </select>
          </Field>
          <Field label="URL (YouTube / Spotify / archivo)">
            <input v-model="f.url" placeholder="https://youtube.com/watch?v=..." />
            <span v-if="youtubeId" class="yt-hint">▶ YouTube ID: {{ youtubeId }}</span>
          </Field>
          <Field label="Notas / Contexto narrativo">
            <textarea v-model="f.notas" rows="5" placeholder="¿En qué momento de la historia suena?" />
          </Field>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imagen custom</div>
          <Field label="URL Imagen"><input v-model="f.imagen_url" placeholder="https://..." /></Field>
          <img v-if="f.imagen_url" :src="f.imagen_url" class="img-preview" />
          <img v-else-if="youtubeId"
            :src="`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`"
            class="img-preview" style="opacity:0.4"
          />
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
const f = ref({ titulo: '', artista: '', tipo_fuente: 'YOUTUBE', url: '', notas: '', imagen_url: '', visible: true })
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('canciones', f)
onMounted(cargar)
const youtubeId = computed(() => {
  if (!f.value.url) return null
  const m = f.value.url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
})
</script>
<style scoped src="~/assets/css/admin-form.css" />
<style scoped>
.yt-hint { font-size: 0.8rem; color: #c8a84b; margin-top: 4px; }
</style>
