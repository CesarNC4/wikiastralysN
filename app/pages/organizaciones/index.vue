<template>
  <WikiList titulo="Organizaciones" :items="organizaciones" :campos-busqueda="['nombre', 'tipo', 'sede']">
    <template #default="{ items }">
      <div class="grid">
        <NuxtLink v-for="o in items" :key="o.id" :to="`/organizaciones/${o.id}`" class="card">
          <div class="card-img">
            <img v-if="o.imagen_url" :src="o.imagen_url" :alt="o.nombre" />
            <span v-else class="initial">{{ o.nombre[0] }}</span>
          </div>
          <div class="card-info">
            <span class="name">{{ o.nombre }}</span>
            <span class="sub">{{ o.tipo || '—' }}</span>
          </div>
        </NuxtLink>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: organizaciones } = await useAsyncData('organizaciones', async () => {
  const { data } = await supabase.from('organizaciones').select('id, nombre, tipo, sede, imagen_url').eq('visible', true).order('nombre')
  return data ?? []
})
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.card { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
.card:hover { border-color: #c8a84b; transform: translateY(-2px); }
.card-img { width: 100%; aspect-ratio: 1; background: linear-gradient(160deg, #1e1810, #0e0c08); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-family: 'Cinzel', serif; font-size: 2rem; color: #2a2010; font-weight: 700; }
.card-info { padding: 10px 12px; background: #12100a; border-top: 1px solid #1e1810; }
.name { font-family: 'Cinzel', serif; font-size: 11px; color: #e8dfc8; letter-spacing: 0.08em; display: block; margin-bottom: 2px; }
.sub { font-size: 11px; color: #5a4a30; font-style: italic; }
</style>