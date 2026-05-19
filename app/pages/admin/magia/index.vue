<template>
  <AdminListPage
    title="Magia — Fundamentos"
    base-path="/admin/magia"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','categoria','subcategoria']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList(
  'magia_fundamentos', 'id, nombre, categoria, subcategoria, orden, visible', 'orden'
)
const COLS = [
  { key: 'nombre',       label: 'Nombre' },
  { key: 'categoria',    label: 'Categoría',    type: 'badge' },
  { key: 'subcategoria', label: 'Subcategoría', type: 'badge' },
  { key: 'orden',        label: 'Orden' },
  { key: 'visible',      label: 'Visible', type: 'bool' },
]
</script>
