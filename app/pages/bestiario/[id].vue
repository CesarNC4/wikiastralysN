<template>
  <WikiDetail :item="bestia" :tags="tags" back-url="/bestiario">
    <WikiSection titulo="Descripción" :contenido="bestia?.descripcion" />
    <WikiSection titulo="Comportamiento" :contenido="bestia?.comportamiento" />
    <WikiSection titulo="Ciclo de vida" :contenido="bestia?.ciclo_vida" />
    <WikiSection titulo="Hábitat" :contenido="bestia?.habitat" />
    <WikiSection titulo="Recursos" :contenido="bestia?.recursos" />
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: bestia } = await useAsyncData(`bestia-${route.params.id}`, async () => {
  const { data } = await supabase.from('bestias').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  bestia.value?.nivel_amenaza && { label: `Nivel ${bestia.value.nivel_amenaza}`, gold: true },
  bestia.value?.habitat && { label: bestia.value.habitat },
].filter(Boolean))
useSeoMeta({ title: bestia.value ? `${bestia.value.nombre} — Astralys` : 'Astralys' })
</script>