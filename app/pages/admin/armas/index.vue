<template>
  <AdminListPage
    title="Armas y Artefactos"
    base-path="/admin/armas"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','tipo']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList('armas_artefactos','id, nombre, tipo, propietario_actual, visible','nombre')
const COLS = [
  { key: 'nombre',            label: 'Nombre' },
  { key: 'tipo',              label: 'Tipo', type: 'badge' },
  { key: 'propietario_actual',label: 'Portador' },
  { key: 'visible',           label: 'Visible', type: 'bool' },
]
</script>
