<template>
  <WikiList titulo="Naciones" :items="naciones" :campos-busqueda="['nombre', 'capital', 'gobierno']">
    <template #default="{ items }">
      <div class="grid">
        <NuxtLink v-for="n in items" :key="n.id" :to="`/naciones/${n.id}`" class="card">
          <div class="card-banner" :style="n.banner_url ? `background-image: url('${n.banner_url}')` : ''">
            <div class="card-overlay"></div>
            <div class="card-img">
              <img v-if="n.imagen_url" :src="n.imagen_url" :alt="n.nombre" />
              <span v-else class="initial">{{ n.nombre[0] }}</span>
            </div>
          </div>
          <div class="card-info">
            <span class="name">{{ n.nombre }}</span>
            <span class="sub">{{ n.capital || n.gobierno || '—' }}</span>
          </div>
        </NuxtLink>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: naciones } = await useAsyncData('naciones', async () => {
  const { data } = await supabase.from('naciones').select('id, nombre, capital, gobierno, imagen_url, banner_url').eq('visible', true).order('nombre')
  return data ?? []
})
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.card { background: #16120c; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
.card:hover { border-color: #c8a84b; transform: translateY(-2px); }
.card-banner { position: relative; width: 100%; aspect-ratio: 16/9; background: linear-gradient(160deg, #1e1810, #0e0c08); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; }
.card-overlay { position: absolute; inset: 0; background: rgba(14,11,7,0.4); }
.card-img { position: relative; width: 48px; height: 48px; border: 1px solid #2a2010; border-radius: 50%; background: #12100a; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-family: 'Cinzel', serif; font-size: 1.2rem; color: #2a2010; font-weight: 700; }
.card-info { padding: 10px 12px; background: #12100a; border-top: 1px solid #1e1810; }
.name { font-family: 'Cinzel', serif; font-size: 11px; color: #e8dfc8; letter-spacing: 0.08em; display: block; margin-bottom: 2px; }
.sub { font-size: 11px; color: #5a4a30; font-style: italic; }
</style>