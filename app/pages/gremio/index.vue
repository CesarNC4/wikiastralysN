<template>
  <WikiDetail :item="gremio" :tags="tags" back-url="/">
    <WikiSection titulo="Descripción" :contenido="gremio?.descripcion" />
    <WikiSection titulo="Historia" :contenido="gremio?.historia" />
    <WikiSection titulo="Estructura" :contenido="gremio?.estructura_global" />
    <WikiSection titulo="Jerarquía de Rangos" :contenido="gremio?.jerarquia_rangos" />
    <WikiSection titulo="Sistema de Misiones" :contenido="gremio?.sistema_misiones" />
    <WikiSection titulo="Recompensas" :contenido="gremio?.recompensas" />
    <div class="info-grid" v-if="gremio?.sede">
      <div class="info-item"><span class="label">Sede</span><span class="value">{{ gremio.sede }}</span></div>
    </div>
  </WikiDetail>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: gremio } = await useAsyncData('gremio', async () => {
  const { data } = await supabase.from('gremio').select('*').limit(1).single()
  return data
})
const tags = computed(() => [
  gremio.value?.subtitulo && { label: gremio.value.subtitulo },
  gremio.value?.lema && { label: gremio.value.lema, gold: true },
].filter(Boolean))
useSeoMeta({ title: gremio.value ? `${gremio.value.nombre} — Astralys` : 'Gremio — Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: var(--s1); border: 1px solid var(--bd); border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: var(--t3); }
.value { font-size: 0.95rem; color: var(--t1); }
</style>
