<template>
  <AdminListPage
    title="Bestiario"
    base-path="/admin/bestiario"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','nivel_amenaza']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="duplicar"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'bestias', 'id, imagen_url, nombre, nivel_amenaza, visible', 'nombre'
)
const COLS = [
  { key: 'imagen_url',   label: '',          type: 'img' },
  { key: 'nombre',       label: 'Nombre' },
  { key: 'nivel_amenaza',label: 'Amenaza',   type: 'badge' },
  { key: 'visible',      label: 'Visible',   type: 'bool' },
]
</script>
