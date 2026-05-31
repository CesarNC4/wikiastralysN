<template>
  <AdminListPage
    title="Conceptos"
    base-path="/admin/conceptos"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','categoria']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="duplicar"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'conceptos', 'id, nombre, categoria, visible', 'nombre'
)
const COLS = [
  { key: 'nombre',    label: 'Nombre' },
  { key: 'categoria', label: 'Categoría', type: 'badge' },
  { key: 'visible',   label: 'Visible',   type: 'bool' },
]
</script>
