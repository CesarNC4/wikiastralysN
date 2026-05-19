<template>
  <AdminListPage
    title="Lords Demonio"
    base-path="/admin/lord-demonio"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre','dominio']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList('lord_demonio','id, nombre, dominio, estado, visible','nombre')
const COLS = [
  { key: 'nombre',  label: 'Nombre' },
  { key: 'dominio', label: 'Dominio' },
  { key: 'estado',  label: 'Estado', type: 'badge' },
  { key: 'visible', label: 'Visible', type: 'bool' },
]
</script>
