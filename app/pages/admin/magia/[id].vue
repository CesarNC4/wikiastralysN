<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/magia" class="btn-back">← Magia</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Fundamento' : 'Nuevo Fundamento de Magia' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/magia')">
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Clasificación</div>
          <Field label="Nombre *"><input v-model="f.nombre" /></Field>
          <div class="row3">
            <Field label="Categoría">
              <select v-model="f.categoria">
                <option>Concepto</option>
                <option>Fundamento</option>
                <option>Consciencia</option>
                <option>Elemento</option>
                <option>Sistema</option>
                <option>Habilidad</option>
                <option>Otro</option>
              </select>
            </Field>
            <Field label="Subcategoría">
              <input v-model="f.subcategoria" placeholder="Ej: Essentia, Zenithra..." />
            </Field>
            <Field label="Orden"><input type="number" v-model.number="f.orden" /></Field>
          </div>
          <Field label="Descripción breve"><textarea v-model="f.descripcion" rows="3" /></Field>
        </div>

        <div class="section">
          <div class="sec-title">Contenido</div>
          <Field label="Contenido completo">
            <textarea v-model="f.contenido" rows="16"
              placeholder="Explicación completa del fundamento, mecánicas, lore, ejemplos..." />
          </Field>
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
  nombre: '', categoria: 'Concepto', subcategoria: '', descripcion: '',
  contenido: '', imagen_url: '', orden: 0, visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('magia_fundamentos', f)
onMounted(cargar)
</script>

<style scoped src="~/assets/css/admin-form.css" />
