<template>
  <AdminListPage
    title="Misiones"
    base-path="/admin/misiones"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','tipo']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList('misiones','id, nombre, tipo, estado, nivel_riesgo, visible','nombre')
const COLS = [
  { key: 'nombre',      label: 'Nombre' },
  { key: 'tipo',        label: 'Tipo',    type: 'badge' },
  { key: 'estado',      label: 'Estado',  type: 'badge' },
  { key: 'nivel_riesgo',label: 'Riesgo',  type: 'badge' },
  { key: 'visible',     label: 'Visible', type: 'bool' },
]
</script>
