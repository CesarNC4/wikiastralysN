<template>
  <WikiList titulo="Lords Demonio" :items="lords" :campos-busqueda="['nombre', 'titulo', 'dominio']">
    <template #default="{ items }">
      <div class="grid">
        <NuxtLink v-for="l in items" :key="l.id" :to="`/lord-demonio/${l.id}`" class="card">
          <div class="card-img">
            <img v-if="l.imagen_url" :src="l.imagen_url" :alt="l.nombre" />
            <span v-else class="initial">{{ l.nombre[0] }}</span>
          </div>
          <div class="card-info">
            <span class="name">{{ l.nombre }}</span>
            <span class="sub">{{ l.titulo || l.dominio || '—' }}</span>
            <span class="estado" :class="l.estado === 'Activo' ? 'activo' : 'derrotado'">{{ l.estado }}</span>
          </div>
        </NuxtLink>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: lords } = await useAsyncData('lords', async () => {
  const { data } = await supabase.from('lord_demonio').select('id, nombre, titulo, dominio, estado, imagen_url').eq('visible', true).order('nombre')
  return data ?? []
})
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.card { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
.card:hover { border-color: #c8a84b; transform: translateY(-2px); }
.card-img { width: 100%; aspect-ratio: 3/4; background: linear-gradient(160deg, #1e1810, #0e0c08); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-family: 'Cinzel', serif; font-size: 2rem; color: #2a2010; font-weight: 700; }
.card-info { padding: 10px 12px; background: #12100a; border-top: 1px solid #1e1810; display: flex; flex-direction: column; gap: 2px; }
.name { font-family: 'Cinzel', serif; font-size: 11px; color: #e8dfc8; letter-spacing: 0.08em; }
.sub { font-size: 11px; color: #5a4a30; font-style: italic; }
.estado { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.15em; margin-top: 2px; }
.activo { color: #e24b4a; }
.derrotado { color: #3a3020; }
</style>