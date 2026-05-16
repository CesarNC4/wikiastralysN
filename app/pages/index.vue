<template>
  <div>
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>
      <p class="eyebrow">Archivo del mundo</p>
      <h1 class="title">Astralys</h1>
      <p class="subtitle">Un mundo donde la magia sangra en la historia y cada nombre carga el peso de su destino.</p>
      <div class="divider">
        <div class="line"></div>
        <div class="gem"></div>
        <div class="line right"></div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <span class="section-title">Personajes</span>
        <div class="section-line"></div>
        <NuxtLink to="/personajes" class="badge">Ver todos</NuxtLink>
      </div>
      <div class="chars-grid">
        <NuxtLink
          v-for="p in personajes"
          :key="p.id"
          :to="`/personajes/${p.id}`"
          class="char-card"
        >
          <div class="char-img">
            <img v-if="p.imagen_url" :src="p.imagen_url" :alt="p.nombre" />
            <span v-else class="char-initial">{{ p.nombre[0] }}</span>
          </div>
          <div class="char-info">
            <span class="char-name">{{ p.nombre }}</span>
            <span class="char-role">{{ p.ocupacion || '—' }}</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <span class="section-title">Capítulos</span>
        <div class="section-line"></div>
        <NuxtLink to="/capitulos" class="badge">Historia</NuxtLink>
      </div>
      <div class="chapters">
        <NuxtLink
          v-for="cap in capitulos"
          :key="cap.id"
          :to="`/capitulos/${cap.id}`"
          class="chapter-row"
          :class="{ pendiente: cap.estado === 'Pendiente' }"
        >
          <span class="chapter-num">Cap. {{ cap.numero }}</span>
          <span class="chapter-title">{{ cap.titulo }}</span>
          <span class="chapter-tipo">{{ cap.tipo }}</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { data: personajes } = await useAsyncData('home-personajes', async () => {
  const { data } = await supabase
    .from('personajes')
    .select('id, nombre, ocupacion, imagen_url')
    .eq('visible', true)
    .limit(6)
  return data
})

const { data: capitulos } = await useAsyncData('home-capitulos', async () => {
  const { data } = await supabase
    .from('capitulos')
    .select('id, numero, titulo, tipo')
    .eq('visible', true)
    .order('numero')
    .limit(6)
  return data
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 2rem 3rem;
  text-align: center;
  border-bottom: 1px solid #1e1810;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(180,140,60,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(100,60,160,0.10) 0%, transparent 50%);
  pointer-events: none;
}

.hero-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.12;
  background-image:
    repeating-linear-gradient(90deg, #c8a84b 0px, #c8a84b 1px, transparent 1px, transparent 40px),
    repeating-linear-gradient(0deg, #c8a84b 0px, #c8a84b 1px, transparent 1px, transparent 40px);
  mask-image: radial-gradient(ellipse at center, transparent 40%, black 100%);
}

.eyebrow {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.35em;
  color: #c8a84b;
  margin-bottom: 1rem;
  opacity: 0.7;
  position: relative;
  text-transform: uppercase;
}

.title {
  font-family: 'Cinzel', serif;
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  font-weight: 700;
  color: #f0e4c0;
  letter-spacing: 0.08em;
  line-height: 1;
  margin: 0 0 0.5rem;
  position: relative;
}

.subtitle {
  font-size: 1.1rem;
  font-style: italic;
  color: #7a6a50;
  margin: 0.75rem 0 0;
  position: relative;
  max-width: 400px;
  line-height: 1.6;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 1.5rem;
  position: relative;
}

.line { height: 1px; width: 60px; background: linear-gradient(90deg, transparent, #c8a84b); }
.line.right { background: linear-gradient(90deg, #c8a84b, transparent); }
.gem { width: 6px; height: 6px; background: #c8a84b; transform: rotate(45deg); }

.section { padding: 2rem 1.5rem; border-bottom: 1px solid #1a1408; }

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.25rem;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.25em;
  color: #c8a84b;
  text-transform: uppercase;
}

.section-line { flex: 1; height: 1px; background: linear-gradient(90deg, #2a2010, transparent); }

.badge {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  padding: 3px 8px;
  border: 1px solid #2a2010;
  color: #5a4a30;
  border-radius: 2px;
  transition: color 0.2s, border-color 0.2s;
}
.badge:hover { color: #c8a84b; border-color: #c8a84b; }

.chars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

.char-card {
  background: #16120c;
  border: 1px solid #2a2010;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}
.char-card:hover { border-color: #c8a84b; transform: translateY(-2px); }

.char-img {
  width: 100%;
  aspect-ratio: 3/4;
  background: linear-gradient(160deg, #1e1810 0%, #0e0c08 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.char-img img { width: 100%; height: 100%; object-fit: cover; }

.char-initial {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: #2a2010;
  font-weight: 700;
}

.char-info { padding: 10px 12px; background: #12100a; border-top: 1px solid #1e1810; }
.char-name { font-family: 'Cinzel', serif; font-size: 11px; color: #e8dfc8; letter-spacing: 0.1em; display: block; margin-bottom: 2px; }
.char-role { font-size: 12px; color: #5a4a30; font-style: italic; }

.chapters {
  border: 1px solid #2a2010;
  border-radius: 4px;
  overflow: hidden;
}

.chapter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 13px 16px;
  background: #12100a;
  transition: background 0.15s;
  border-bottom: 1px solid #1a1408;
}
.chapter-row:last-child { border-bottom: none; }
.chapter-row:hover { background: #18150e; }

.chapter-num { font-family: 'Cinzel', serif; font-size: 10px; color: #c8a84b; letter-spacing: 0.15em; min-width: 36px; opacity: 0.6; }
.chapter-title { font-size: 1rem; color: #c8b890; flex: 1; }
.chapter-tipo { font-size: 10px; color: #4a3a20; font-family: 'Cinzel', serif; letter-spacing: 0.1em; }
.chapter-row.pendiente .chapter-title { color: #3a2e1a; }
.chapter-row.pendiente .chapter-num { opacity: 0.2; }
</style>