<template>
  <AdminListPage
    title="Capítulos"
    base-path="/admin/capitulos"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['titulo','numero','libro']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="e => duplicar(e, 'titulo')"
    @delete="e => eliminar(e, 'titulo')"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList('capitulos','id, numero, titulo, libro, tipo, tipo_temporal, visible','numero')
const COLS = [
  { key: 'numero',        label: 'Nº' },
  { key: 'titulo',        label: 'Título' },
  { key: 'libro',         label: 'Libro' },
  { key: 'tipo',          label: 'Tipo',     type: 'badge' },
  { key: 'tipo_temporal', label: 'Temporal', type: 'badge' },
  { key: 'visible',       label: 'Visible',  type: 'bool' },
]
</script>