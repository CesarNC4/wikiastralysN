<template>
  <WikiList titulo="Timeline" :items="eventos" :campos-busqueda="['titulo', 'categoria']">
    <template #default="{ items }">
      <div class="timeline">
        <div v-for="e in items" :key="e.id" class="evento" :class="`imp-${e.importancia?.toLowerCase()}`">
          <div class="evento-marker">
            <div class="marker-dot"></div>
            <div class="marker-line"></div>
          </div>
          <div class="evento-content">
            <div class="evento-header">
              <span class="fecha">{{ e.fecha_lore }}</span>
              <span class="categoria">{{ e.categoria }}</span>
            </div>
            <h3 class="evento-titulo">{{ e.titulo }}</h3>
            <p class="evento-desc" v-if="e.descripcion">{{ e.descripcion }}</p>
          </div>
        </div>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: eventos } = await useAsyncData('timeline', async () => {
  const { data } = await supabase.from('timeline_eventos').select('*').eq('visible', true).order('fecha_lore')
  return data ?? []
})
</script>

<style scoped>
.timeline { display: flex; flex-direction: column; }

.evento { display: flex; gap: 16px; }

.evento-marker { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.marker-dot { width: 10px; height: 10px; border-radius: 50%; background: #2a2010; border: 1px solid #3a2e1a; flex-shrink: 0; margin-top: 4px; }
.marker-line { flex: 1; width: 1px; background: #1e1810; margin: 4px 0; min-height: 20px; }
.evento:last-child .marker-line { display: none; }

.imp-mayor .marker-dot { background: #c8a84b; border-color: #c8a84b; box-shadow: 0 0 8px rgba(200,168,75,0.3); }
.imp-crítico .marker-dot { background: #e24b4a; border-color: #e24b4a; box-shadow: 0 0 8px rgba(226,75,74,0.3); }

.evento-content { padding-bottom: 2rem; flex: 1; }

.evento-header { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.fecha { font-family: 'Cinzel', serif; font-size: 10px; color: #c8a84b; letter-spacing: 0.15em; opacity: 0.7; }
.categoria { font-family: 'Cinzel', serif; font-size: 9px; color: #3a2e1a; letter-spacing: 0.1em; border: 1px solid #2a2010; padding: 1px 6px; border-radius: 2px; }

.evento-titulo { font-family: 'Cinzel', serif; font-size: 13px; color: #e8dfc8; letter-spacing: 0.05em; margin-bottom: 6px; }
.evento-desc { font-size: 0.95rem; color: #7a6a50; line-height: 1.6; }
</style>