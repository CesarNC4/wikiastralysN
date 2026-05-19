<template>
  <AdminListPage
    title="Razas"
    base-path="/admin/razas"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','clasificacion']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList(
  'razas', 'id, nombre, clasificacion, esperanza_vida, visible', 'nombre'
)
const COLS = [
  { key: 'nombre',          label: 'Nombre' },
  { key: 'clasificacion',   label: 'Clasificación', type: 'badge' },
  { key: 'esperanza_vida',  label: 'Esperanza de vida' },
  { key: 'visible',         label: 'Visible', type: 'bool' },
]
</script>
