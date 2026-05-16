<template>
  <WikiDetail :item="capitulo" :tags="tags" :mostrar-avatar="false" back-url="/capitulos">
    <WikiSection titulo="Descripción" :contenido="capitulo?.descripcion" />
    <div class="info-grid" v-if="capitulo">
      <div class="info-item" v-if="capitulo.narrador"><span class="label">Narrador</span><span class="value">{{ capitulo.narrador }}</span></div>
      <div class="info-item" v-if="capitulo.fecha_lore"><span class="label">Fecha lore</span><span class="value">{{ capitulo.fecha_lore }}</span></div>
      <div class="info-item" v-if="capitulo.marco_narrativo"><span class="label">Marco narrativo</span><span class="value">{{ capitulo.marco_narrativo }}</span></div>
      <div class="info-item" v-if="capitulo.tipo_temporal"><span class="label">Tiempo</span><span class="value">{{ capitulo.tipo_temporal }}</span></div>
    </div>
    <div class="discord" v-if="capitulo?.discord_url">
      <a :href="capitulo.discord_url" target="_blank" class="discord-link">Leer en Discord →</a>
    </div>
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: capitulo } = await useAsyncData(`capitulo-${route.params.id}`, async () => {
  const { data } = await supabase.from('capitulos').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  capitulo.value?.tipo && { label: capitulo.value.tipo },
  capitulo.value?.tipo_temporal && { label: capitulo.value.tipo_temporal, gold: true },
].filter(Boolean))
useSeoMeta({ title: capitulo.value ? `Cap. ${capitulo.value.numero} — ${capitulo.value.titulo}` : 'Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.value { font-size: 0.95rem; color: #e8dfc8; }
.discord { margin-bottom: 2rem; }
.discord-link { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.15em; color: #c8a84b; border: 1px solid #c8a84b44; padding: 8px 16px; border-radius: 2px; transition: background 0.2s; }
.discord-link:hover { background: #c8a84b11; }
</style>