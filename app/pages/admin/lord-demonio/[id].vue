<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/lord-demonio" class="btn-back">← Lords Demonio</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Lord Demonio' : 'Nuevo Lord Demonio' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/lord-demonio')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Identificación</div>
          <Field label="Nombre *"><input v-model="f.nombre" /></Field>
          <Field label="Dominio"><input v-model="f.dominio" placeholder="Ej: Aniquilación, Odio..." /></Field>
          <Field label="Título completo"><input v-model="f.titulo" placeholder="Ej: Lord Demonio de la Aniquilación" /></Field>
          <div class="row2">
            <Field label="Estado">
              <select v-model="f.estado">
                <option value="">—</option>
                <option>Activo</option><option>Sellado</option><option>Derrotado</option>
                <option>Desconocido</option><option>Eliminado</option>
              </select>
            </Field>
            <Field label="Era de aparición"><input v-model="f.era_aparicion" placeholder="Ej: Post-Ishkoria (-900)" /></Field>
          </div>
          <Field label="Derrotado / Sellado por"><input v-model="f.derrotado_por" /></Field>
        </div>
        <div class="section">
          <div class="sec-title">Descripción y Poderes</div>
          <Field label="Descripción física"><textarea v-model="f.descripcion_fisica" rows="4" /></Field>
          <Field label="Devil Trigger"><textarea v-model="f.devil_trigger" rows="4" /></Field>
          <Field label="Poder especial"><textarea v-model="f.poder_especial" rows="4" /></Field>
          <Field label="Historia"><textarea v-model="f.historia" rows="6" /></Field>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/lord-demonio" />
            </Field>
            <Field label="Banner">
              <CloudinaryUpload v-model="f.banner_url" label="Banner" icon="🖼" folder="wikiastralys/lord-demonio/banners" />
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
  nombre: '', dominio: '', titulo: '', estado: '', era_aparicion: '', derrotado_por: '',
  descripcion_fisica: '', devil_trigger: '', poder_especial: '', historia: '',
  imagen_url: '', banner_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('lord_demonio', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
