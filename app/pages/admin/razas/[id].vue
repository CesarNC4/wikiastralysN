<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/razas" class="btn-back">← Razas</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Raza' : 'Nueva Raza' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/razas/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/razas')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Identidad</div>
          <div class="f-group">
            <label class="f-lbl">Nombre *</label>
            <input class="f-inp" v-model="f.nombre" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Subtítulo</label>
            <input class="f-inp" v-model="f.subtitulo" placeholder="Ej: Los Hijos del Cielo" />
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Clasificación</label>
              <select class="f-inp" v-model="f.clasificacion">
                <option value="">—</option>
                <option>Humana</option><option>Élfica</option><option>Demoníaca</option>
                <option>Divina</option><option>Bestial</option><option>Elemental</option>
                <option>Híbrida</option><option>Otra</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Esperanza de vida</label>
              <input class="f-inp" v-model="f.esperanza_vida" placeholder="Ej: 200-300 años" />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción</label>
            <textarea class="f-area" v-model="f.descripcion" rows="4"></textarea>
          </div>
        </div>

        <div class="section">
          <div class="sec-title">Lore</div>
          <div class="f-group">
            <label class="f-lbl">Origen</label>
            <textarea class="f-area" v-model="f.origen" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Rasgos Físicos</label>
            <textarea class="f-area" v-model="f.rasgos_fisicos" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Cultura</label>
            <textarea class="f-area" v-model="f.cultura" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Habilidades / Rasgos especiales</label>
            <textarea class="f-area" v-model="f.habilidades_rasgo" rows="4"></textarea>
          </div>
        </div>

        <p v-if="!isEdit" class="hint">💡 Guarda la raza primero para gestionar naciones y personajes asociados.</p>
      </div>

      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/razas" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Banner</label>
            <CloudinaryUpload v-model="f.banner_url" folder="wikiastralys/razas/banners" />
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
  nombre: '', subtitulo: '', clasificacion: '', descripcion: '', origen: '',
  rasgos_fisicos: '', cultura: '', habilidades_rasgo: '', esperanza_vida: '',
  imagen_url: '', banner_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('razas', f)
onMounted(cargar)
</script>

<style scoped src="~/assets/css/admin-form.css" />
