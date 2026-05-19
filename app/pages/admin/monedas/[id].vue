<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/monedas" class="btn-back">← Monedas</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Moneda' : 'Nueva Moneda' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/monedas')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid-single">
      <div class="section">
        <div class="sec-title">Información</div>
        <Field label="Nombre *"><input v-model="f.nombre" /></Field>
        <Field label="Denominación"><input v-model="f.denominacion" placeholder="Ej: Therin, Astra..." /></Field>
        <Field label="Valor relativo"><input v-model="f.valor_relativo" placeholder="Ej: 1 Therin = 100 Coppers" /></Field>
        <Field label="Descripción"><textarea v-model="f.descripcion" rows="5" /></Field>
        <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/monedas" />
            </Field>
        <label class="check-label" style="margin-top:12px"><input type="checkbox" v-model="f.visible" /> Visible al público</label>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const f = ref({ nombre: '', denominacion: '', valor_relativo: '', descripcion: '', imagen_url: '', visible: false })
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('sistema_monetario', f)
onMounted(cargar)
</script>
<style scoped src="~/assets/css/admin-form.css" />
