<template>
  <AdminListPage
    title="Lords Demonio"
    base-path="/admin/lord-demonio"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','dominio']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="duplicar"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'lord_demonio', 'id, imagen_url, nombre, dominio, estado, visible', 'nombre'
)
const COLS = [
  { key: 'imagen_url', label: '',       type: 'img' },
  { key: 'nombre',     label: 'Nombre' },
  { key: 'dominio',    label: 'Dominio' },
  { key: 'estado',     label: 'Estado', type: 'badge' },
  { key: 'visible',    label: 'Visible',type: 'bool' },
]
</script>
