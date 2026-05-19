<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/timeline" class="btn-back">← Timeline</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Evento' : 'Nuevo Evento' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/timeline', 'titulo')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid-single">
      <div class="section">
        <Field label="Título *"><input v-model="f.titulo" /></Field>
        <div class="row2">
          <Field label="Fecha Lore">
            <input v-model="f.fecha_lore" placeholder="Ej: -6000, 340, Año 0..." />
            <span class="hint">Usa números (incluido negativos). El timeline se ordena numéricamente.</span>
          </Field>
          <Field label="Importancia">
            <select v-model="f.importancia">
              <option value="">—</option>
              <option value="Critico">Crítico</option>
              <option value="Mayor">Mayor</option>
              <option value="Menor">Menor</option>
              <option value="Lore">Solo Lore</option>
            </select>
          </Field>
        </div>
        <Field label="Categoría">
          <select v-model="f.categoria">
            <option value="">—</option>
            <option value="Cosmico">Cósmico</option>
            <option value="Politico">Político</option>
            <option value="Militar">Militar</option>
            <option value="Magico">Mágico</option>
            <option value="Social">Social</option>
            <option value="Natural">Natural</option>
            <option value="Otro">Otro</option>
          </select>
        </Field>
        <Field label="Descripción"><textarea v-model="f.descripcion" rows="6" /></Field>
        <label class="check-label"><input type="checkbox" v-model="f.visible" /> Visible al público</label>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const f = ref({ titulo: '', fecha_lore: '', importancia: '', categoria: '', descripcion: '', visible: true })
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('timeline_eventos', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
