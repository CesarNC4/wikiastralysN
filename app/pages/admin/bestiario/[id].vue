<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/bestiario" class="btn-back">← Bestiario</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Bestia' : 'Nueva Bestia' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/bestiario/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/bestiario')">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Información General</div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Nombre *</label>
              <input class="f-inp" v-model="f.nombre" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Subtítulo</label>
              <input class="f-inp" v-model="f.subtitulo" />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Nivel de Amenaza</label>
            <select class="f-inp" v-model="f.nivel_amenaza">
              <option value="">—</option>
              <option v-for="n in ['F','E','D','C','B','A','S','SS','SSS']" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción</label>
            <textarea class="f-area" v-model="f.descripcion" rows="5"></textarea>
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Biología y Comportamiento</div>
          <div class="f-group">
            <label class="f-lbl">Ciclo de Vida</label>
            <textarea class="f-area" v-model="f.ciclo_vida" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Comportamiento</label>
            <textarea class="f-area" v-model="f.comportamiento" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Hábitat</label>
            <textarea class="f-area" v-model="f.habitat" rows="3"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Recursos (drops)</label>
            <textarea class="f-area" v-model="f.recursos" rows="3"></textarea>
          </div>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/bestiario" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Banner</label>
            <CloudinaryUpload v-model="f.banner_url" folder="wikiastralys/bestiario/banners" />
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
  nombre: '', subtitulo: '', nivel_amenaza: 'D',
  descripcion: '', ciclo_vida: '', comportamiento: '',
  habitat: '', recursos: '', imagen_url: '', banner_url: '', visible: true,
})

const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('bestias', f)
onMounted(cargar)
</script>

<style scoped src="~/assets/css/admin-form.css" />
