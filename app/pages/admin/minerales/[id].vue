<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/minerales" class="btn-back">← Minerales</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Mineral' : 'Nuevo Mineral' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/minerales/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/minerales')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
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
              <label class="f-lbl">Tipo / Origen</label>
              <select class="f-inp" v-model="f.tipo">
                <option value="">—</option>
                <option value="Natural">Natural</option>
                <option value="Arcano">Arcano</option>
                <option value="Disonante">Disonante</option>
                <option value="Sintetico">Sintético</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Rareza</label>
              <select class="f-inp" v-model="f.rareza">
                <option value="">—</option>
                <option value="Comun">Común</option>
                <option value="Infrecuente">Infrecuente</option>
                <option value="Raro">Raro</option>
                <option value="Epico">Épico</option>
                <option value="Legendario">Legendario</option>
              </select>
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción breve</label>
            <textarea class="f-area" v-model="f.descripcion" rows="4"></textarea>
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Propiedades</div>
          <div class="f-group">
            <label class="f-lbl">Propiedades</label>
            <textarea class="f-area" v-model="f.propiedades" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Usos</label>
            <textarea class="f-area" v-model="f.usos" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Origen / Localización</label>
            <input class="f-inp" v-model="f.origen" placeholder="Dónde se puede encontrar" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Notas adicionales</label>
            <textarea class="f-area" v-model="f.notas" rows="3"></textarea>
          </div>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imagen</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/minerales" />
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
  nombre: '', tipo: '', rareza: '', descripcion: '',
  propiedades: '', usos: '', origen: '', notas: '', imagen_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('minerales', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
