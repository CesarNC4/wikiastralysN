<template>
  <WikiList titulo="Misiones" :items="misiones" :campos-busqueda="['nombre', 'tipo', 'ubicacion']">
    <template #default="{ items }">
      <div class="lista">
        <NuxtLink v-for="m in items" :key="m.id" :to="`/misiones/${m.id}`" class="row">
          <div class="row-left">
            <span class="nivel" :class="`nivel-${m.nivel_riesgo}`">{{ m.nivel_riesgo }}</span>
            <div class="row-info">
              <span class="nombre">{{ m.nombre }}</span>
              <span class="tipo">{{ m.tipo }} · {{ m.ubicacion || 'Ubicación desconocida' }}</span>
            </div>
          </div>
          <span class="estado" :class="`estado-${m.estado?.toLowerCase().replace(' ', '-')}`">{{ m.estado }}</span>
        </NuxtLink>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: misiones } = await useAsyncData('misiones', async () => {
  const { data } = await supabase.from('misiones').select('id, nombre, tipo, nivel_riesgo, estado, ubicacion').eq('visible', true).order('nivel_riesgo')
  return data ?? []
})
</script>

<style scoped>
.lista { display: flex; flex-direction: column; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; background: #12100a; border-bottom: 1px solid #1a1408; transition: background 0.15s; }
.row:last-child { border-bottom: none; }
.row:hover { background: #18150e; }
.row-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.nivel { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; min-width: 20px; text-align: center; }
.nivel-S { color: #e24b4a; }
.nivel-A { color: #ef9f27; }
.nivel-B { color: #c8a84b; }
.nivel-C { color: #639922; }
.nivel-D { color: #5a4a30; }
.row-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.nombre { font-size: 1rem; color: #c8b890; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tipo { font-size: 11px; color: #4a3a20; font-style: italic; }
.estado { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 2px; border: 1px solid; flex-shrink: 0; }
.estado-disponible { color: #639922; border-color: #63992244; }
.estado-en-progreso { color: #c8a84b; border-color: #c8a84b44; }
.estado-completada { color: #3a2e1a; border-color: #2a2010; }
</style>