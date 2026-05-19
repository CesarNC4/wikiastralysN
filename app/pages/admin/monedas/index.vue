<template>
  <AdminListPage
    title="Monedas"
    base-path="/admin/monedas"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre']"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList('sistema_monetario','id, nombre, denominacion, valor_relativo, visible','nombre')
const COLS = [
  { key: 'nombre',        label: 'Nombre' },
  { key: 'denominacion',  label: 'Denominación' },
  { key: 'valor_relativo',label: 'Valor relativo' },
  { key: 'visible',       label: 'Visible', type: 'bool' },
]
</script>
