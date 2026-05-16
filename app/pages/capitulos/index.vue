<template>
  <WikiList titulo="Capítulos" :items="capitulos" :campos-busqueda="['titulo', 'numero', 'tipo']">
    <template #default="{ items }">
      <div class="chapters">
        <NuxtLink v-for="cap in items" :key="cap.id" :to="`/capitulos/${cap.id}`" class="row" :class="{ pendiente: !cap.visible }">
          <div class="row-left">
            <span class="num">Cap. {{ cap.numero }}</span>
            <div class="row-info">
              <span class="titulo">{{ cap.titulo }}</span>
              <span class="libro" v-if="cap.marco_narrativo">{{ cap.marco_narrativo }}</span>
            </div>
          </div>
          <div class="row-right">
            <span class="tipo">{{ cap.tipo }}</span>
            <span class="temporal">{{ cap.tipo_temporal }}</span>
          </div>
        </NuxtLink>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: capitulos } = await useAsyncData('capitulos', async () => {
  const { data } = await supabase
    .from('capitulos')
    .select('id, numero, titulo, tipo, tipo_temporal, marco_narrativo, visible')
    .eq('visible', true)
    .order('numero')
  return data ?? []
})
</script>

<style scoped>
.chapters { display: flex; flex-direction: column; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; }

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  background: #12100a;
  border-bottom: 1px solid #1a1408;
  transition: background 0.15s;
}
.row:last-child { border-bottom: none; }
.row:hover { background: #18150e; }
.row.pendiente { opacity: 0.4; }

.row-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
.num { font-family: 'Cinzel', serif; font-size: 10px; color: #c8a84b; letter-spacing: 0.15em; min-width: 50px; opacity: 0.7; }
.row-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.titulo { font-size: 1rem; color: #c8b890; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.libro { font-size: 11px; color: #4a3a20; font-style: italic; }

.row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.tipo { font-family: 'Cinzel', serif; font-size: 9px; color: #4a3a20; letter-spacing: 0.1em; }
.temporal { font-family: 'Cinzel', serif; font-size: 9px; color: #3a2e1a; letter-spacing: 0.1em; }
</style>