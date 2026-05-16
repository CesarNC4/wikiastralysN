<template>
  <WikiDetail :item="familia" :tags="tags" back-url="/familias">
    <WikiSection titulo="Descripción" :contenido="familia?.descripcion" />
    <WikiSection titulo="Historia" :contenido="familia?.historia" />
    <WikiSection titulo="Poder económico" :contenido="familia?.poder_economico" />
    <WikiSection titulo="Poder político" :contenido="familia?.poder_politico" />
    <WikiSection titulo="Poder militar" :contenido="familia?.poder_militar" />
    <WikiSection titulo="Estructura núcleo" :contenido="familia?.estructura_nucleo" />
    <WikiSection titulo="Liderazgo" :contenido="familia?.liderazgo" />
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: familia } = await useAsyncData(`familia-${route.params.id}`, async () => {
  const { data } = await supabase.from('familias').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  familia.value?.origen && { label: familia.value.origen, gold: true },
  familia.value?.apellido && { label: familia.value.apellido },
].filter(Boolean))
useSeoMeta({ title: familia.value ? `${familia.value.nombre} — Astralys` : 'Astralys' })
</script>