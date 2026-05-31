<template>
  <AdminListPage
    title="Páginas Lore"
    base-path="/admin/lore"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['titulo','slug']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="e => duplicar(e, 'titulo')"
    @delete="e => eliminar(e, 'titulo')"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'paginas_lore', 'id, titulo, slug, visible', 'titulo'
)
const COLS = [
  { key: 'titulo',  label: 'Título' },
  { key: 'slug',    label: 'Slug' },
  { key: 'visible', label: 'Visible', type: 'bool' },
]
</script>
