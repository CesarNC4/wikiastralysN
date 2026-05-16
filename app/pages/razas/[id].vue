<template>
  <WikiDetail :item="raza" :tags="tags" back-url="/razas">
    <WikiSection titulo="Descripción" :contenido="raza?.descripcion" />
    <WikiSection titulo="Origen" :contenido="raza?.origen" />
    <WikiSection titulo="Rasgos físicos" :contenido="raza?.rasgos_fisicos" />
    <WikiSection titulo="Cultura" :contenido="raza?.cultura" />
    <WikiSection titulo="Habilidades y rasgos" :contenido="raza?.habilidades_rasgo" />
    <div class="info-grid" v-if="raza?.esperanza_vida">
      <div class="info-item"><span class="label">Esperanza de vida</span><span class="value">{{ raza.esperanza_vida }}</span></div>
    </div>
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: raza } = await useAsyncData(`raza-${route.params.id}`, async () => {
  const { data } = await supabase.from('razas').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  raza.value?.clasificacion && { label: raza.value.clasificacion, gold: true },
].filter(Boolean))
useSeoMeta({ title: raza.value ? `${raza.value.nombre} — Astralys` : 'Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.value { font-size: 0.95rem; color: #e8dfc8; }
</style>