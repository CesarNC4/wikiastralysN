<template>
  <AdminListPage
    title="Conceptos"
    base-path="/admin/conceptos"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','categoria']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList('conceptos','id, nombre, categoria, visible','nombre')
const COLS = [
  { key: 'nombre',    label: 'Nombre' },
  { key: 'categoria', label: 'Categoría', type: 'badge' },
  { key: 'visible',   label: 'Visible',   type: 'bool' },
]
</script>
