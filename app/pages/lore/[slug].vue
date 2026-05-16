<template>
  <div v-if="pagina" class="page">
    <div class="page-header" :style="pagina.banner_url ? `background-image: url('${pagina.banner_url}')` : ''">
      <div class="header-overlay"></div>
      <div class="header-content">
        <p class="eyebrow">Archivo del mundo</p>
        <h1 class="titulo">{{ pagina.titulo }}</h1>
        <p v-if="pagina.subtitulo" class="subtitulo">{{ pagina.subtitulo }}</p>
        <div class="divider">
          <div class="line"></div>
          <div class="gem"></div>
          <div class="line right"></div>
        </div>
      </div>
    </div>

    <div class="content">
      <p v-if="pagina.introduccion" class="introduccion">{{ pagina.introduccion }}</p>

      <template v-for="n in [1,2,3,4,5,6]" :key="n">
        <WikiSection
          v-if="pagina[`seccion${n}_titulo`]"
          :titulo="pagina[`seccion${n}_titulo`]"
          :contenido="pagina[`seccion${n}_contenido`]"
        />
      </template>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Página no encontrada.</p>
    <NuxtLink to="/" class="back">← Volver al inicio</NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()

const { data: pagina } = await useAsyncData(`lore-${route.params.slug}`, async () => {
  const { data } = await supabase
    .from('paginas_lore')
    .select('*')
    .eq('slug', route.params.slug)
    .eq('visible', true)
    .single()
  return data
})

useSeoMeta({ title: pagina.value ? `${pagina.value.titulo} — Astralys` : 'Astralys' })
</script>

<style scoped>
.page-header {
  position: relative;
  min-height: 300px;
  background: #12100a;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}

.header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #0e0b07 0%, rgba(14,11,7,0.5) 60%, transparent 100%);
}

.header-content {
  position: relative;
  padding: 2rem 1.5rem;
  width: 100%;
  text-align: center;
}

.eyebrow {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.35em;
  color: #c8a84b;
  opacity: 0.7;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.titulo {
  font-family: 'Cinzel', serif;
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
  color: #f0e4c0;
  letter-spacing: 0.08em;
}

.subtitulo {
  font-style: italic;
  color: #7a6a50;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 1.25rem; }
.line { height: 1px; width: 60px; background: linear-gradient(90deg, transparent, #c8a84b); }
.line.right { background: linear-gradient(90deg, #c8a84b, transparent); }
.gem { width: 6px; height: 6px; background: #c8a84b; transform: rotate(45deg); }

.content { padding: 2rem 1.5rem; }

.introduccion {
  font-size: 1.1rem;
  line-height: 1.9;
  color: #a89070;
  font-style: italic;
  border-left: 2px solid #c8a84b44;
  padding-left: 1.25rem;
  margin-bottom: 2rem;
}

.not-found { text-align: center; padding: 4rem 2rem; color: #4a3a20; font-style: italic; }
.back { color: #c8a84b; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.15em; }
</style>