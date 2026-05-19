<template>
  <AdminListPage
    title="Organizaciones"
    base-path="/admin/organizaciones"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','tipo','estado']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList(
  'organizaciones', 'id, nombre, tipo, estado, visible', 'nombre'
)
const COLS = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo',   label: 'Tipo',   type: 'badge' },
  { key: 'estado', label: 'Estado', type: 'badge' },
  { key: 'visible',label: 'Visible',type: 'bool' },
]
</script>
