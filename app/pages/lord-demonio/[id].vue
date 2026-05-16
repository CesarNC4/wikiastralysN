<template>
  <WikiDetail :item="lord" :tags="tags" back-url="/lord-demonio">
    <WikiSection titulo="Descripción física" :contenido="lord?.descripcion_fisica" />
    <WikiSection titulo="Historia" :contenido="lord?.historia" />
    <WikiSection titulo="Poder especial" :contenido="lord?.poder_especial" />
    <WikiSection titulo="Devil trigger" :contenido="lord?.devil_trigger" />
    <div class="info-grid" v-if="lord">
      <div class="info-item" v-if="lord.dominio"><span class="label">Dominio</span><span class="value">{{ lord.dominio }}</span></div>
      <div class="info-item" v-if="lord.era_aparicion"><span class="label">Era</span><span class="value">{{ lord.era_aparicion }}</span></div>
      <div class="info-item" v-if="lord.derrotado_por"><span class="label">Derrotado por</span><span class="value">{{ lord.derrotado_por }}</span></div>
    </div>
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: lord } = await useAsyncData(`lord-${route.params.id}`, async () => {
  const { data } = await supabase.from('lord_demonio').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  lord.value?.titulo && { label: lord.value.titulo },
  lord.value?.estado && { label: lord.value.estado, gold: lord.value.estado === 'Activo' },
].filter(Boolean))
useSeoMeta({ title: lord.value ? `${lord.value.nombre} — Astralys` : 'Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.value { font-size: 0.95rem; color: #e8dfc8; }
</style>