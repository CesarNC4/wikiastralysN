<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/bestiario" class="btn-back">← Bestiario</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Bestia' : 'Nueva Bestia' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/bestiario')">
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Información General</div>
          <div class="row2">
            <Field label="Nombre *"><input v-model="f.nombre" /></Field>
            <Field label="Subtítulo"><input v-model="f.subtitulo" /></Field>
          </div>
          <Field label="Nivel de Amenaza">
            <select v-model="f.nivel_amenaza">
              <option value="">—</option>
              <option v-for="n in ['F','E','D','C','B','A','S','SS','SSS']" :key="n" :value="n">{{ n }}</option>
            </select>
          </Field>
          <Field label="Descripción"><textarea v-model="f.descripcion" rows="5" /></Field>
        </div>
        <div class="section">
          <div class="sec-title">Biología y Comportamiento</div>
          <Field label="Ciclo de Vida"><textarea v-model="f.ciclo_vida" rows="4" /></Field>
          <Field label="Comportamiento"><textarea v-model="f.comportamiento" rows="4" /></Field>
          <Field label="Hábitat"><textarea v-model="f.habitat" rows="3" /></Field>
          <Field label="Recursos (drops)"><textarea v-model="f.recursos" rows="3" /></Field>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/bestiario" />
            </Field>
            <Field label="Banner">
              <CloudinaryUpload v-model="f.banner_url" label="Banner" icon="🖼" folder="wikiastralys/bestiario/banners" />
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
  nombre: '', subtitulo: '', nivel_amenaza: 'D',
  descripcion: '', ciclo_vida: '', comportamiento: '',
  habitat: '', recursos: '', imagen_url: '', banner_url: '', visible: true,
})

const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('bestias', f)
onMounted(cargar)
</script>

<style scoped src="~/assets/css/admin-form.css" />
