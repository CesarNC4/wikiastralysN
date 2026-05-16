<template>
  <WikiList titulo="Bestiario" :items="bestias" :campos-busqueda="['nombre', 'habitat', 'nivel_amenaza']">
    <template #default="{ items }">
      <div class="grid">
        <NuxtLink v-for="b in items" :key="b.id" :to="`/bestiario/${b.id}`" class="card">
          <div class="card-img">
            <img v-if="b.imagen_url" :src="b.imagen_url" :alt="b.nombre" />
            <span v-else class="initial">{{ b.nombre[0] }}</span>
          </div>
          <div class="card-info">
            <span class="name">{{ b.nombre }}</span>
            <span class="amenaza" :class="`nivel-${b.nivel_amenaza}`">{{ b.nivel_amenaza }}</span>
          </div>
        </NuxtLink>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: bestias } = await useAsyncData('bestias', async () => {
  const { data } = await supabase.from('bestias').select('id, nombre, nivel_amenaza, habitat, imagen_url').eq('visible', true).order('nombre')
  return data ?? []
})
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.card { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
.card:hover { border-color: #c8a84b; transform: translateY(-2px); }
.card-img { width: 100%; aspect-ratio: 1; background: linear-gradient(160deg, #1e1810, #0e0c08); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-family: 'Cinzel', serif; font-size: 2rem; color: #2a2010; font-weight: 700; }
.card-info { padding: 10px 12px; background: #12100a; border-top: 1px solid #1e1810; display: flex; justify-content: space-between; align-items: center; }
.name { font-family: 'Cinzel', serif; font-size: 11px; color: #e8dfc8; letter-spacing: 0.08em; }
.amenaza { font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; }
.nivel-S { color: #e24b4a; }
.nivel-A { color: #ef9f27; }
.nivel-B { color: #c8a84b; }
.nivel-C { color: #639922; }
.nivel-D { color: #5a4a30; }
</style>