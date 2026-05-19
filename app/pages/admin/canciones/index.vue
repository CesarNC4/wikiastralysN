<template>
  <AdminListPage
    title="Canciones"
    base-path="/admin/canciones"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['titulo','artista']"
    @delete="e => eliminar(e, 'titulo')"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList('canciones','id, titulo, artista, tipo_fuente, visible','titulo')
const COLS = [
  { key: 'titulo',      label: 'Título' },
  { key: 'artista',     label: 'Artista' },
  { key: 'tipo_fuente', label: 'Tipo', type: 'badge' },
  { key: 'visible',     label: 'Visible', type: 'bool' },
]
</script>
