<template>
  <AdminListPage
    title="Bestiario"
    base-path="/admin/bestiario"
    :items="items"
    :columns="COLS"
    :loading="loading"
    :delete-error="deleteError"
    :search-keys="['nombre', 'nivel_amenaza']"
    @delete="eliminar"
  />
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList(
  'bestias',
  'id, nombre, nivel_amenaza, visible',
  'nombre'
)
const COLS = [
  { key: 'nombre',        label: 'Nombre' },
  { key: 'nivel_amenaza', label: 'Amenaza', type: 'badge' },
  { key: 'visible',       label: 'Visible',  type: 'bool' },
]
</script>
