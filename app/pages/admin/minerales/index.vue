<template>
  <AdminListPage
    title="Minerales"
    base-path="/admin/minerales"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','tipo']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="duplicar"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'minerales', 'id, nombre, tipo, rareza, visible', 'nombre'
)
const COLS = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo',   label: 'Tipo',   type: 'badge' },
  { key: 'rareza', label: 'Rareza', type: 'badge' },
  { key: 'visible',label: 'Visible',type: 'bool' },
]
</script>
