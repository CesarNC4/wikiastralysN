<template>
  <WikiList titulo="Magia" :items="magias" :campos-busqueda="['nombre', 'categoria', 'subcategoria']">
    <template #default="{ items }">
      <div class="groups">
        <div v-for="(grupo, cat) in agrupadosPorCategoria(items)" :key="cat" class="group">
          <div class="group-header">
            <span class="group-title">{{ cat }}</span>
            <div class="group-line"></div>
          </div>
          <div class="grid">
            <NuxtLink v-for="m in grupo" :key="m.id" :to="`/magia/${m.id}`" class="card">
              <div class="card-img">
                <img v-if="m.imagen_url" :src="m.imagen_url" :alt="m.nombre" />
                <span v-else class="initial">{{ m.nombre[0] }}</span>
              </div>
              <div class="card-info">
                <span class="name">{{ m.nombre }}</span>
                <span class="sub">{{ m.subcategoria || m.categoria }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: magias } = await useAsyncData('magias', async () => {
  const { data } = await supabase.from('magia_fundamentos').select('id, nombre, categoria, subcategoria, imagen_url').eq('visible', true).order('orden')
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
.group-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
.group-title { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.25em; color: #c8a84b; text-transform: uppercase; white-space: nowrap; }
.group-line { flex: 1; height: 1px; background: linear-gradient(90deg, #2a2010, transparent); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
.card { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
.card:hover { border-color: #c8a84b; transform: translateY(-2px); }
.card-img { width: 100%; aspect-ratio: 1; background: linear-gradient(160deg, #1e1810, #0e0c08); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-family: 'Cinzel', serif; font-size: 2rem; color: #2a2010; font-weight: 700; }
.card-info { padding: 8px 10px; background: #12100a; border-top: 1px solid #1e1810; }
.name { font-family: 'Cinzel', serif; font-size: 10px; color: #e8dfc8; letter-spacing: 0.08em; display: block; margin-bottom: 2px; }
.sub { font-size: 10px; color: #5a4a30; font-style: italic; }
</style>