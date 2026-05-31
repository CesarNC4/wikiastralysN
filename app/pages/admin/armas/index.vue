<template>
  <AdminListPage
    title="Armas y Artefactos"
    base-path="/admin/armas"
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
  'armas_artefactos', 'id, imagen_url, nombre, tipo, propietario_actual, visible', 'nombre'
)
const COLS = [
  { key: 'imagen_url',         label: '',         type: 'img' },
  { key: 'nombre',             label: 'Nombre' },
  { key: 'tipo',               label: 'Tipo',     type: 'badge' },
  { key: 'propietario_actual', label: 'Portador' },
  { key: 'visible',            label: 'Visible',  type: 'bool' },
]
</script>
