<template>
  <AdminListPage
    title="Minerales"
    base-path="/admin/minerales"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','tipo']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList('minerales','id, nombre, tipo, rareza, visible','nombre')
const COLS = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo',   label: 'Tipo',   type: 'badge' },
  { key: 'rareza', label: 'Rareza', type: 'badge' },
  { key: 'visible',label: 'Visible',type: 'bool' },
]
</script>
