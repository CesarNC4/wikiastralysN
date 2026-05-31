<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/armas" class="btn-back">← Armas</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Arma / Artefacto' : 'Nueva Arma / Artefacto' }}</h1>
      <div style="display:flex;gap:8px;margin-left:auto">
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
            <Field label="Nombre *"><input v-model="f.nombre" /></Field>
            <Field label="Tipo">
              <select v-model="f.tipo">
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
            </Field>
          </div>
          <Field label="Descripción"><textarea v-model="f.descripcion" rows="5" /></Field>
          <Field label="Historia"><textarea v-model="f.historia" rows="5" /></Field>
          <Field label="Poder Especial"><textarea v-model="f.poder_especial" rows="4" /></Field>
        </div>
        <div class="section">
          <div class="sec-title">Propietario</div>
          <Field label="Portador actual (texto)">
            <input v-model="f.propietario_actual" placeholder="Nombre del portador" />
          </Field>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imagen</div>
          <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/armas" />
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
  nombre: '', tipo: 'Otro', descripcion: '', historia: '',
  poder_especial: '', propietario_actual: '', imagen_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('armas_artefactos', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
