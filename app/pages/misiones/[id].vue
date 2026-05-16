<template>
  <WikiDetail :item="mision" :tags="tags" :mostrar-avatar="false" back-url="/misiones">
    <WikiSection titulo="Descripción" :contenido="mision?.descripcion" />
    <WikiSection titulo="Objetivo" :contenido="mision?.objetivo" />
    <WikiSection titulo="Recompensa" :contenido="mision?.recompensa" />
    <div class="info-grid" v-if="mision">
      <div class="info-item" v-if="mision.ubicacion"><span class="label">Ubicación</span><span class="value">{{ mision.ubicacion }}</span></div>
      <div class="info-item" v-if="mision.rango_minimo"><span class="label">Rango mínimo</span><span class="value">{{ mision.rango_minimo }}</span></div>
      <div class="info-item" v-if="mision.fecha_lore"><span class="label">Fecha</span><span class="value">{{ mision.fecha_lore }}</span></div>
    </div>
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: mision } = await useAsyncData(`mision-${route.params.id}`, async () => {
  const { data } = await supabase.from('misiones').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  mision.value?.nivel_riesgo && { label: `Nivel ${mision.value.nivel_riesgo}`, gold: true },
  mision.value?.tipo && { label: mision.value.tipo },
  mision.value?.estado && { label: mision.value.estado },
].filter(Boolean))
useSeoMeta({ title: mision.value ? `${mision.value.nombre} — Astralys` : 'Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.value { font-size: 0.95rem; color: #e8dfc8; }
</style>