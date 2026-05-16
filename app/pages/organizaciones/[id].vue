<template>
  <WikiDetail :item="org" :tags="tags" back-url="/organizaciones">
    <WikiSection titulo="Descripción" :contenido="org?.descripcion" />
    <WikiSection titulo="Historia" :contenido="org?.historia" />
    <WikiSection titulo="Objetivo" :contenido="org?.objetivo" />
    <WikiSection titulo="Ideología" :contenido="org?.ideologia" />
    <WikiSection titulo="Estructura interna" :contenido="org?.estructura_interna" />
    <WikiSection titulo="Liderazgo" :contenido="org?.liderazgo" />
    <div class="info-grid" v-if="org">
      <div class="info-item" v-if="org.sede"><span class="label">Sede</span><span class="value">{{ org.sede }}</span></div>
      <div class="info-item" v-if="org.estado"><span class="label">Estado</span><span class="value">{{ org.estado }}</span></div>
      <div class="info-item" v-if="org.fundacion"><span class="label">Fundación</span><span class="value">{{ org.fundacion }}</span></div>
    </div>
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: org } = await useAsyncData(`org-${route.params.id}`, async () => {
  const { data } = await supabase.from('organizaciones').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  org.value?.tipo && { label: org.value.tipo },
  org.value?.estado && { label: org.value.estado, gold: true },
].filter(Boolean))
useSeoMeta({ title: org.value ? `${org.value.nombre} — Astralys` : 'Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.value { font-size: 0.95rem; color: #e8dfc8; }
</style>