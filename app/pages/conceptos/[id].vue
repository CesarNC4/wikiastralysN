<template>
  <WikiDetail :item="concepto" :tags="tags" back-url="/conceptos">
    <WikiSection titulo="Descripción" :contenido="concepto?.descripcion" />
    <WikiSection titulo="Contenido" :contenido="concepto?.contenido" />
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: concepto } = await useAsyncData(`concepto-${route.params.id}`, async () => {
  const { data } = await supabase.from('conceptos').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  concepto.value?.categoria && { label: concepto.value.categoria, gold: true },
].filter(Boolean))
useSeoMeta({ title: concepto.value ? `${concepto.value.nombre} — Astralys` : 'Astralys' })
</script>