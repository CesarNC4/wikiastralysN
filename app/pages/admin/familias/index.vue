<template>
  <AdminListPage
    title="Familias"
    base-path="/admin/familias"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','apellido','origen']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList(
  'familias', 'id, nombre, apellido, origen, visible', 'nombre'
)
const COLS = [
  { key: 'nombre',   label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'origen',   label: 'Origen', type: 'badge' },
  { key: 'visible',  label: 'Visible', type: 'bool' },
]
</script>
