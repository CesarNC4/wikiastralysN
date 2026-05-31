<template>
  <AdminListPage
    title="Monedas"
    base-path="/admin/monedas"
    :items="items" :columns="COLS" :loading="loading"
    :delete-error="deleteError" :search-keys="['nombre']"
    :page="page" :total-pages="totalPages" :total="total"
    :on-page-change="irAPagina" :on-duplicate="duplicar"
    @delete="eliminar"
  />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar, duplicar, page, total, totalPages, irAPagina } = useAdminList(
  'sistema_monetario', 'id, nombre, denominacion, valor_relativo, visible', 'nombre'
)
const COLS = [
  { key: 'nombre',        label: 'Nombre' },
  { key: 'denominacion',  label: 'Denominación' },
  { key: 'valor_relativo',label: 'Valor relativo' },
  { key: 'visible',       label: 'Visible', type: 'bool' },
]
</script>
