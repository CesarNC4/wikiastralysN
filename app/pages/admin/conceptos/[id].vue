<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/conceptos" class="btn-back">← Conceptos</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Concepto' : 'Nuevo Concepto' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/conceptos/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/conceptos')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Clasificación</div>
          <div class="f-group">
            <label class="f-lbl">Nombre *</label>
            <input class="f-inp" v-model="f.nombre" />
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Categoría</label>
              <select class="f-inp" v-model="f.categoria">
                <option>General</option><option>Historia</option><option>Cosmología</option>
                <option>Sociedad</option><option>Magia</option><option>Geografía</option><option>Otro</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Orden</label>
              <input class="f-inp" type="number" v-model.number="f.orden" />
            </div>
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Contenido</div>
          <div class="f-group">
            <label class="f-lbl">Descripción corta</label>
            <textarea class="f-area" v-model="f.descripcion" rows="3"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Contenido completo</label>
            <RichEditor v-model="f.contenido" placeholder="Texto largo con toda la información del concepto..." />
          </div>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imagen</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/conceptos" />
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
const f = ref({ nombre: '', categoria: 'General', descripcion: '', contenido: '', imagen_url: '', orden: 0, visible: true })
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('conceptos', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
