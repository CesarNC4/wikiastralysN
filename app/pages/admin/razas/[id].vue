<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/razas" class="btn-back">← Razas</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Raza' : 'Nueva Raza' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/razas')">
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Identidad</div>
          <Field label="Nombre *"><input v-model="f.nombre" /></Field>
          <Field label="Subtítulo"><input v-model="f.subtitulo" placeholder="Ej: Los Hijos del Cielo" /></Field>
          <div class="row2">
            <Field label="Clasificación">
              <select v-model="f.clasificacion">
                <option value="">—</option>
                <option>Humana</option><option>Élfica</option><option>Demoníaca</option>
                <option>Divina</option><option>Bestial</option><option>Elemental</option>
                <option>Híbrida</option><option>Otra</option>
              </select>
            </Field>
            <Field label="Esperanza de vida"><input v-model="f.esperanza_vida" placeholder="Ej: 200-300 años" /></Field>
          </div>
          <Field label="Descripción"><textarea v-model="f.descripcion" rows="4" /></Field>
        </div>

        <div class="section">
          <div class="sec-title">Lore</div>
          <Field label="Origen"><textarea v-model="f.origen" rows="5" /></Field>
          <Field label="Rasgos Físicos"><textarea v-model="f.rasgos_fisicos" rows="4" /></Field>
          <Field label="Cultura"><textarea v-model="f.cultura" rows="4" /></Field>
          <Field label="Habilidades / Rasgos especiales"><textarea v-model="f.habilidades_rasgo" rows="4" /></Field>
        </div>

        <p v-if="!isEdit" class="hint">💡 Guarda la raza primero para gestionar naciones y personajes asociados.</p>
      </div>

      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <Field label="URL Imagen (card)"><input v-model="f.imagen_url" placeholder="https://..." /></Field>
          <Field label="URL Banner"><input v-model="f.banner_url" placeholder="https://..." /></Field>
          <img v-if="f.imagen_url" :src="f.imagen_url" class="img-preview" />
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
  nombre: '', subtitulo: '', clasificacion: '', descripcion: '', origen: '',
  rasgos_fisicos: '', cultura: '', habilidades_rasgo: '', esperanza_vida: '',
  imagen_url: '', banner_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('razas', f)
onMounted(cargar)
</script>

<style scoped src="~/assets/css/admin-form.css" />
