<template>
  <AdminListPage
    title="Timeline"
    base-path="/admin/timeline"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['titulo','era']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="e => duplicar(e, 'titulo')"
    @delete="e => eliminar(e, 'titulo')"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'timeline_eventos', 'id, titulo, fecha_lore, importancia, visible', 'fecha_lore'
)
const COLS = [
  { key: 'titulo',      label: 'Título' },
  { key: 'fecha_lore',  label: 'Fecha' },
  { key: 'importancia', label: 'Importancia', type: 'badge' },
  { key: 'visible',     label: 'Visible',     type: 'bool' },
]
</script>
