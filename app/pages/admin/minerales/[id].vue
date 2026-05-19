<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/minerales" class="btn-back">← Minerales</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Mineral' : 'Nuevo Mineral' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/minerales')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Clasificación</div>
          <Field label="Nombre *"><input v-model="f.nombre" /></Field>
          <div class="row2">
            <Field label="Tipo / Origen">
              <select v-model="f.tipo">
                <option value="">—</option>
                <option value="Natural">Natural</option>
                <option value="Arcano">Arcano</option>
                <option value="Disonante">Disonante</option>
                <option value="Sintetico">Sintético</option>
              </select>
            </Field>
            <Field label="Rareza">
              <select v-model="f.rareza">
                <option value="">—</option>
                <option value="Comun">Común</option>
                <option value="Infrecuente">Infrecuente</option>
                <option value="Raro">Raro</option>
                <option value="Epico">Épico</option>
                <option value="Legendario">Legendario</option>
              </select>
            </Field>
          </div>
          <Field label="Descripción breve"><textarea v-model="f.descripcion" rows="4" /></Field>
        </div>
        <div class="section">
          <div class="sec-title">Propiedades</div>
          <Field label="Propiedades"><textarea v-model="f.propiedades" rows="4" /></Field>
          <Field label="Usos"><textarea v-model="f.usos" rows="4" /></Field>
          <Field label="Origen / Localización"><input v-model="f.origen" placeholder="Dónde se puede encontrar" /></Field>
          <Field label="Notas adicionales"><textarea v-model="f.notas" rows="3" /></Field>
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
const f = ref({
  nombre: '', tipo: '', rareza: '', descripcion: '',
  propiedades: '', usos: '', origen: '', notas: '', imagen_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('minerales', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
