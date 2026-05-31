<template>
  <AdminListPage
    title="Personajes"
    base-path="/admin/personajes"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','surname','titulo','ocupacion']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="duplicar"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList('personajes','id, imagen_url, nombre, surname, titulo, rango_aventurero, visible','nombre')
const COLS = [
  { key: 'imagen_url',       label: '',         type: 'img' },
  { key: 'nombre',           label: 'Nombre' },
  { key: 'surname',          label: 'Apellido' },
  { key: 'titulo',           label: 'Título' },
  { key: 'rango_aventurero', label: 'Rango', type: 'badge' },
  { key: 'visible',          label: 'Visible', type: 'bool' },
]
</script>