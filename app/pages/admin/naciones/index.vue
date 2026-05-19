<template>
  <AdminListPage
    title="Naciones"
    base-path="/admin/naciones"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','capital']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList(
  'naciones', 'id, nombre, capital, elemento_fundamental, visible', 'nombre'
)
const COLS = [
  { key: 'nombre',               label: 'Nombre' },
  { key: 'capital',              label: 'Capital' },
  { key: 'elemento_fundamental', label: 'Elemento', type: 'badge' },
  { key: 'visible',              label: 'Visible',  type: 'bool' },
]
</script>
