<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/armas" class="btn-back">← Armas</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Arma / Artefacto' : 'Nueva Arma / Artefacto' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/armas/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/armas')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
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
              <label class="f-lbl">Tipo</label>
              <select class="f-inp" v-model="f.tipo">
                <option value="">—</option>
                <optgroup label="Armas de Combate">
                  <option value="Composicion">Composición</option>
                  <option value="Activacion">Activación</option>
                  <option value="Sincronizacion">Sincronización</option>
                  <option value="Amplificacion">Amplificación</option>
                  <option value="Ignicion">Ignición</option>
                </optgroup>
                <optgroup label="Objetos y Reliquias">
                  <option value="Artefacto">Artefacto</option>
                  <option value="Reliquia">Reliquia</option>
                  <option value="Objeto_magico">Objeto Mágico</option>
                  <option value="Familiares">Familiar / Compañero</option>
                </optgroup>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción</label>
            <textarea class="f-area" v-model="f.descripcion" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Historia</label>
            <textarea class="f-area" v-model="f.historia" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Poder Especial</label>
            <textarea class="f-area" v-model="f.poder_especial" rows="4"></textarea>
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Propietario</div>
          <div class="f-group">
            <label class="f-lbl">Portador actual (texto)</label>
            <input class="f-inp" v-model="f.propietario_actual" placeholder="Nombre del portador" />
          </div>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imagen</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/armas" />
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
  nombre: '', tipo: 'Otro', descripcion: '', historia: '',
  poder_especial: '', propietario_actual: '', imagen_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('armas_artefactos', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
