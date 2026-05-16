<template>
  <WikiDetail :item="mineral" :tags="tags" back-url="/minerales">
    <WikiSection titulo="Descripción" :contenido="mineral?.descripcion" />
    <WikiSection titulo="Propiedades" :contenido="mineral?.propiedades" />
    <WikiSection titulo="Usos" :contenido="mineral?.usos" />
    <div class="info-grid" v-if="mineral?.origen">
      <div class="info-item"><span class="label">Origen</span><span class="value">{{ mineral.origen }}</span></div>
    </div>
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: mineral } = await useAsyncData(`mineral-${route.params.id}`, async () => {
  const { data } = await supabase.from('minerales').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  mineral.value?.rareza && { label: mineral.value.rareza, gold: true },
  mineral.value?.tipo && { label: mineral.value.tipo },
].filter(Boolean))
useSeoMeta({ title: mineral.value ? `${mineral.value.nombre} — Astralys` : 'Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.value { font-size: 0.95rem; color: #e8dfc8; }
</style>