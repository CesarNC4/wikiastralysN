<template>
  <WikiDetail :item="nacion" :tags="tags" back-url="/naciones">
    <WikiSection titulo="Descripción" :contenido="nacion?.descripcion" />
    <WikiSection titulo="Historia" :contenido="nacion?.historia" />
    <WikiSection titulo="Estado actual" :contenido="nacion?.estado_actual" />
    <WikiSection titulo="Estructura" :contenido="nacion?.estructura" />

    <div class="info-grid" v-if="nacion">
      <div class="info-item" v-if="nacion.gobierno"><span class="label">Gobierno</span><span class="value">{{ nacion.gobierno }}</span></div>
      <div class="info-item" v-if="nacion.capital"><span class="label">Capital</span><span class="value">{{ nacion.capital }}</span></div>
      <div class="info-item" v-if="nacion.idioma"><span class="label">Idioma</span><span class="value">{{ nacion.idioma }}</span></div>
      <div class="info-item" v-if="nacion.poblacion"><span class="label">Población</span><span class="value">{{ nacion.poblacion }}</span></div>
      <div class="info-item" v-if="nacion.elemento_fundamental"><span class="label">Elemento</span><span class="value">{{ nacion.elemento_fundamental }}</span></div>
      <div class="info-item" v-if="nacion.dios_fundador"><span class="label">Dios fundador</span><span class="value">{{ nacion.dios_fundador }}</span></div>
    </div>
  </WikiDetail>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { data: nacion } = await useAsyncData(`nacion-${route.params.id}`, async () => {
  const { data } = await supabase.from('naciones').select('*').eq('id', route.params.id).eq('visible', true).single()
  return data
})
const tags = computed(() => [
  nacion.value?.gobierno && { label: nacion.value.gobierno },
  nacion.value?.elemento_fundamental && { label: nacion.value.elemento_fundamental, gold: true },
].filter(Boolean))
useSeoMeta({ title: nacion.value ? `${nacion.value.nombre} — Astralys` : 'Astralys' })
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 2rem; }
.info-item { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.value { font-size: 0.95rem; color: #e8dfc8; }
</style>