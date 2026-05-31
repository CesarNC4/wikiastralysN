<template>
  <AdminListPage
    title="Organizaciones"
    base-path="/admin/organizaciones"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','tipo','estado']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="duplicar"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'organizaciones', 'id, nombre, tipo, estado, visible', 'nombre'
)
const COLS = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo',   label: 'Tipo',   type: 'badge' },
  { key: 'estado', label: 'Estado', type: 'badge' },
  { key: 'visible',label: 'Visible',type: 'bool' },
]
</script>
