<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/conceptos" class="btn-back">← Conceptos</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Concepto' : 'Nuevo Concepto' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/conceptos')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Clasificación</div>
          <Field label="Nombre *"><input v-model="f.nombre" /></Field>
          <div class="row2">
            <Field label="Categoría">
              <select v-model="f.categoria">
                <option>General</option><option>Historia</option><option>Cosmología</option>
                <option>Sociedad</option><option>Magia</option><option>Geografía</option><option>Otro</option>
              </select>
            </Field>
            <Field label="Orden"><input type="number" v-model.number="f.orden" /></Field>
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Contenido</div>
          <Field label="Descripción corta"><textarea v-model="f.descripcion" rows="3" /></Field>
          <Field label="Contenido completo"><textarea v-model="f.contenido" rows="12" placeholder="Texto largo con toda la información del concepto..." /></Field>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imagen</div>
          <Field label="URL Imagen"><input v-model="f.imagen_url" placeholder="https://..." /></Field>
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
const f = ref({ nombre: '', categoria: 'General', descripcion: '', contenido: '', imagen_url: '', orden: 0, visible: true })
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('conceptos', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
