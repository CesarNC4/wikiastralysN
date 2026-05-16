<template>
  <WikiList titulo="Banda Sonora" :items="canciones" :campos-busqueda="['titulo', 'artista']" subtitulo="La música del mundo de Astralys">
    <template #default="{ items }">
      <div class="lista">
        <div v-for="c in items" :key="c.id" class="row">
          <div class="row-img">
            <img v-if="c.imagen_url" :src="c.imagen_url" :alt="c.titulo" />
            <span v-else class="initial">♪</span>
          </div>
          <div class="row-info">
            <span class="titulo">{{ c.titulo }}</span>
            <span class="artista">{{ c.artista || 'Desconocido' }}</span>
          </div>
          <a v-if="c.url && c.tipo_fuente !== 'LOCAL'" :href="c.url" target="_blank" class="play-btn">Escuchar →</a>
        </div>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: canciones } = await useAsyncData('canciones', async () => {
  const { data } = await supabase.from('canciones').select('id, titulo, artista, url, tipo_fuente, imagen_url').eq('visible', true).order('titulo')
  return data ?? []
})
</script>

<style scoped>
.lista { display: flex; flex-direction: column; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; }
.row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #12100a; border-bottom: 1px solid #1a1408; }
.row:last-child { border-bottom: none; }
.row-img { width: 40px; height: 40px; border-radius: 2px; background: #16120c; border: 1px solid #2a2010; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.row-img img { width: 100%; height: 100%; object-fit: cover; }
.initial { font-size: 1.2rem; color: #2a2010; }
.row-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.titulo { font-size: 1rem; color: #c8b890; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.artista { font-size: 11px; color: #4a3a20; font-style: italic; }
.play-btn { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.1em; color: #c8a84b; border: 1px solid #c8a84b44; padding: 4px 10px; border-radius: 2px; flex-shrink: 0; transition: background 0.2s; }
.play-btn:hover { background: #c8a84b11; }
</style>