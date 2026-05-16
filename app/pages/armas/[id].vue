<template>
  <WikiDetail :item="arma" :tags="tags" back-url="/armas">
    <WikiSection titulo="Descripción" :contenido="arma?.descripcion" />
    <WikiSection titulo="Historia" :contenido="arma?.historia" />
    <WikiSection titulo="Poder especial" :contenido="arma?.poder_especial" />
    <div class="info-grid" v-if="arma?.propietario_actual">
      <div class="info-item"><span class="label">Propietario actual</span><span class="value">{{ arma.propietario_actual }}</span></div>
    </div>
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: arma } = await useAsyncData(`arma-${route.params.id}`, async () => {
  const { data } = await supabase.from('armas_artefactos').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  arma.value?.tipo && { label: arma.value.tipo, gold: true },
  arma.value?.propietario_actual && { label: arma.value.propietario_actual },
].filter(Boolean))
useSeoMeta({ title: arma.value ? `${arma.value.nombre} — Astralys` : 'Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.value { font-size: 0.95rem; color: #e8dfc8; }
</style>