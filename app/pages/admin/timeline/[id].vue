<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/timeline" class="btn-back">← Timeline</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Evento' : 'Nuevo Evento' }}</h1>
      <div class="form-header-actions">
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/timeline', 'titulo')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="f-group">
            <label class="f-lbl">Título *</label>
            <input class="f-inp" v-model="f.titulo" />
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Fecha Lore</label>
              <input class="f-inp" v-model="f.fecha_lore" placeholder="Ej: -6000, 340, Año 0..." />
              <span class="hint">Usa números (incluido negativos). El timeline se ordena numéricamente.</span>
            </div>
            <div class="f-group">
              <label class="f-lbl">Importancia</label>
              <select class="f-inp" v-model="f.importancia">
                <option value="">—</option>
                <option value="Critico">Crítico</option>
                <option value="Mayor">Mayor</option>
                <option value="Menor">Menor</option>
                <option value="Lore">Solo Lore</option>
              </select>
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Categoría</label>
            <select class="f-inp" v-model="f.categoria">
              <option value="">—</option>
              <option value="Cosmico">Cósmico</option>
              <option value="Politico">Político</option>
              <option value="Militar">Militar</option>
              <option value="Magico">Mágico</option>
              <option value="Social">Social</option>
              <option value="Natural">Natural</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción</label>
            <textarea class="f-area" v-model="f.descripcion" rows="6"></textarea>
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
const f = ref({ titulo: '', fecha_lore: '', importancia: '', categoria: '', descripcion: '', visible: true })
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('timeline_eventos', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
