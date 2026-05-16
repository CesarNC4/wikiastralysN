<template>
  <WikiList titulo="Conceptos" :items="conceptos" :campos-busqueda="['nombre', 'categoria']">
    <template #default="{ items }">
      <div class="groups">
        <div v-for="(grupo, cat) in agrupadosPorCategoria(items)" :key="cat" class="group">
          <div class="group-header">
            <span class="group-title">{{ cat }}</span>
            <div class="group-line"></div>
          </div>
          <div class="lista">
            <NuxtLink v-for="c in grupo" :key="c.id" :to="`/conceptos/${c.id}`" class="row">
              <div class="row-img">
                <img v-if="c.imagen_url" :src="c.imagen_url" :alt="c.nombre" />
                <span v-else class="initial">{{ c.nombre[0] }}</span>
              </div>
              <span class="nombre">{{ c.nombre }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: conceptos } = await useAsyncData('conceptos', async () => {
  const { data } = await supabase.from('conceptos').select('id, nombre, categoria, imagen_url').eq('visible', true).order('orden')
  return data ?? []
})

function agrupadosPorCategoria(items) {
  return items.reduce((acc, item) => {
    const cat = item.categoria || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})
}
</script>

<style scoped>
.groups { display: flex; flex-direction: column; gap: 2rem; }
.group-header { display: flex; align-items: center; gap: 12px; margin-bottom: 0.75rem; }
.group-title { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.25em; color: #c8a84b; text-transform: uppercase; white-space: nowrap; }
.group-line { flex: 1; height: 1px; background: linear-gradient(90deg, #2a2010, transparent); }
.lista { display: flex; flex-direction: column; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; }
.row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #12100a; border-bottom: 1px solid #1a1408; transition: background 0.15s; }
.row:last-child { border-bottom: none; }
.row:hover { background: #18150e; }
.row-img { width: 32px; height: 32px; border-radius: 2px; background: #16120c; border: 1px solid #2a2010; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.row-img img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-family: 'Cinzel', serif; font-size: 0.9rem; color: #2a2010; }
.nombre { font-size: 1rem; color: #c8b890; }
</style>