<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/magia" class="btn-back">← Magia</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Fundamento' : 'Nuevo Fundamento de Magia' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/magia/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/magia')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
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
          <div class="row3">
            <div class="f-group">
              <label class="f-lbl">Categoría</label>
              <select class="f-inp" v-model="f.categoria">
                <option>Concepto</option>
                <option>Fundamento</option>
                <option>Elemental</option>
                <option>Demoniaca</option>
                <option>TecnicaAvanzada</option>
                <option>Habilidad</option>
                <option>Otro</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Subcategoría</label>
              <select v-if="f.categoria === 'Elemental'" class="f-inp" v-model="f.subcategoria">
                <option value="">—</option>
                <option>Cryo</option>
                <option>Dendro</option>
                <option>Electro</option>
                <option>Geo</option>
                <option>Hydro</option>
                <option>Pyro</option>
                <option>Vento</option>
              </select>
              <input v-else class="f-inp" v-model="f.subcategoria" placeholder="Ej: Essentia, Zenithra..." />
            </div>
            <div class="f-group">
              <label class="f-lbl">Orden</label>
              <input class="f-inp" type="number" v-model.number="f.orden" />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción breve</label>
            <textarea class="f-area" v-model="f.descripcion" rows="3"></textarea>
          </div>
        </div>

        <div class="section">
          <div class="sec-title">Contenido</div>
          <div class="f-group">
            <label class="f-lbl">Contenido completo</label>
            <RichEditor v-model="f.contenido" placeholder="Explicación completa del fundamento, mecánicas, lore, ejemplos..." />
          </div>
        </div>
      </div>

      <div>
        <div class="section">
          <div class="sec-title">Imagen</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/magia" />
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
  nombre: '', categoria: 'Concepto', subcategoria: '', descripcion: '',
  contenido: '', imagen_url: '', orden: 0, visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('magia_fundamentos', f)
onMounted(cargar)
</script>

<style scoped src="~/assets/css/admin-form.css" />
