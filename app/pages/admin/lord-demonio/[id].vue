<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/lord-demonio" class="btn-back">← Lords Demonio</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Lord Demonio' : 'Nuevo Lord Demonio' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/lord-demonio/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/lord-demonio')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Identificación</div>
          <div class="f-group">
            <label class="f-lbl">Nombre *</label>
            <input class="f-inp" v-model="f.nombre" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Dominio</label>
            <input class="f-inp" v-model="f.dominio" placeholder="Ej: Aniquilación, Odio..." />
          </div>
          <div class="f-group">
            <label class="f-lbl">Título completo</label>
            <input class="f-inp" v-model="f.titulo" placeholder="Ej: Lord Demonio de la Aniquilación" />
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Estado</label>
              <select class="f-inp" v-model="f.estado">
                <option value="">—</option>
                <option>Activo</option><option>Sellado</option><option>Derrotado</option>
                <option>Desconocido</option><option>Eliminado</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Era de aparición</label>
              <input class="f-inp" v-model="f.era_aparicion" placeholder="Ej: Post-Ishkoria (-900)" />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Derrotado / Sellado por</label>
            <input class="f-inp" v-model="f.derrotado_por" />
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Descripción y Poderes</div>
          <div class="f-group">
            <label class="f-lbl">Descripción física</label>
            <textarea class="f-area" v-model="f.descripcion_fisica" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Devil Trigger</label>
            <textarea class="f-area" v-model="f.devil_trigger" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Poder especial</label>
            <textarea class="f-area" v-model="f.poder_especial" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Historia</label>
            <textarea class="f-area" v-model="f.historia" rows="6"></textarea>
          </div>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/lord-demonio" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Banner</label>
            <CloudinaryUpload v-model="f.banner_url" folder="wikiastralys/lord-demonio/banners" />
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
  nombre: '', dominio: '', titulo: '', estado: '', era_aparicion: '', derrotado_por: '',
  descripcion_fisica: '', devil_trigger: '', poder_especial: '', historia: '',
  imagen_url: '', banner_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('lord_demonio', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
