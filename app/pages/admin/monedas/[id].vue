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
        <div class="f-group">
          <label class="f-lbl">Nombre *</label>
          <input class="f-inp" v-model="f.nombre" />
        </div>
        <div class="f-group">
          <label class="f-lbl">Denominación</label>
          <input class="f-inp" v-model="f.denominacion" placeholder="Ej: Therin, Astra..." />
        </div>
        <div class="f-group">
          <label class="f-lbl">Valor relativo</label>
          <input class="f-inp" v-model="f.valor_relativo" placeholder="Ej: 1 Therin = 100 Coppers" />
        </div>
        <div class="f-group">
          <label class="f-lbl">Descripción</label>
          <textarea class="f-area" v-model="f.descripcion" rows="5"></textarea>
        </div>
        <div class="f-group">
          <label class="f-lbl">Imagen</label>
          <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/monedas" />
        </div>
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
