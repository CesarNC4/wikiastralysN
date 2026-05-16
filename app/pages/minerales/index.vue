<template>
  <WikiList titulo="Minerales" :items="minerales" :campos-busqueda="['nombre', 'rareza', 'tipo']">
    <template #default="{ items }">
      <div class="grid">
        <NuxtLink v-for="m in items" :key="m.id" :to="`/minerales/${m.id}`" class="card">
          <div class="card-img">
            <img v-if="m.imagen_url" :src="m.imagen_url" :alt="m.nombre" />
            <span v-else class="initial">{{ m.nombre[0] }}</span>
          </div>
          <div class="card-info">
            <span class="name">{{ m.nombre }}</span>
            <span class="rareza" :class="`r-${m.rareza?.toLowerCase()}`">{{ m.rareza }}</span>
          </div>
        </NuxtLink>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: minerales } = await useAsyncData('minerales', async () => {
  const { data } = await supabase.from('minerales').select('id, nombre, rareza, tipo, imagen_url').eq('visible', true).order('nombre')
  return data ?? []
})
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
.card { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
.card:hover { border-color: #c8a84b; transform: translateY(-2px); }
.card-img { width: 100%; aspect-ratio: 1; background: linear-gradient(160deg, #1e1810, #0e0c08); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-family: 'Cinzel', serif; font-size: 2rem; color: #2a2010; font-weight: 700; }
.card-info { padding: 8px 10px; background: #12100a; border-top: 1px solid #1e1810; display: flex; justify-content: space-between; align-items: center; }
.name { font-family: 'Cinzel', serif; font-size: 10px; color: #e8dfc8; letter-spacing: 0.08em; }
.rareza { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.1em; }
.r-legendario { color: #e24b4a; }
.r-épico { color: #a855f7; }
.r-raro { color: #c8a84b; }
.r-poco\ común { color: #639922; }
.r-comun { color: #5a4a30; }
</style>