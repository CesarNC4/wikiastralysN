<template>
  <WikiDetail :item="magia" :tags="tags" back-url="/magia">
    <WikiSection titulo="Descripción" :contenido="magia?.descripcion" />
    <WikiSection titulo="Contenido" :contenido="magia?.contenido" />
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: magia } = await useAsyncData(`magia-${route.params.id}`, async () => {
  const { data } = await supabase.from('magia_fundamentos').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  magia.value?.categoria && { label: magia.value.categoria, gold: true },
  magia.value?.subcategoria && { label: magia.value.subcategoria },
].filter(Boolean))
useSeoMeta({ title: magia.value ? `${magia.value.nombre} — Astralys` : 'Astralys' })
</script>