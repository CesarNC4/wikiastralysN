<template>
  <AdminListPage
    title="Familias"
    base-path="/admin/familias"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','apellido','origen']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="duplicar"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'familias', 'id, nombre, apellido, origen, visible', 'nombre'
)
const COLS = [
  { key: 'nombre',   label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'origen',   label: 'Origen', type: 'badge' },
  { key: 'visible',  label: 'Visible', type: 'bool' },
]
</script>
