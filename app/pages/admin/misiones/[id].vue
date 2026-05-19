<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/misiones" class="btn-back">← Misiones</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Misión' : 'Nueva Misión' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/misiones')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Información General</div>
          <Field label="Nombre *"><input v-model="f.nombre" /></Field>
          <div class="row2">
            <Field label="Tipo">
              <select v-model="f.tipo">
                <option>Abierta</option><option>Historia</option><option>Gremio</option>
                <option>Personal</option><option>Urgente</option><option>Secreta</option>
              </select>
            </Field>
            <Field label="Estado">
              <select v-model="f.estado">
                <option>Disponible</option><option>En_Progreso</option><option>Completada</option>
                <option>Fallida</option><option>Cancelada</option>
              </select>
            </Field>
          </div>
          <div class="row2">
            <Field label="Nivel de Riesgo">
              <select v-model="f.nivel_riesgo">
                <option v-for="n in ['F','E','D','C','B','A','S']" :key="n" :value="n">{{ n }}</option>
              </select>
            </Field>
            <Field label="Rango Mínimo"><input v-model="f.rango_minimo" placeholder="Ej: D, C, B..." /></Field>
          </div>
          <Field label="Descripción"><textarea v-model="f.descripcion" rows="5" /></Field>
          <Field label="Objetivo"><textarea v-model="f.objetivo" rows="4" /></Field>
          <Field label="Recompensa"><textarea v-model="f.recompensa" rows="3" /></Field>
        </div>
        <div class="section">
          <div class="sec-title">Detalles</div>
          <div class="row2">
            <Field label="Ubicación"><input v-model="f.ubicacion" /></Field>
            <Field label="Fecha Lore"><input v-model="f.fecha_lore" placeholder="Ej: Año 342" /></Field>
          </div>
        </div>
      </div>
      <div>
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
  nombre: '', tipo: 'Abierta', estado: 'Disponible', nivel_riesgo: 'D',
  rango_minimo: '', descripcion: '', objetivo: '', recompensa: '',
  ubicacion: '', fecha_lore: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('misiones', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
