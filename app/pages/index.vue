<template>
  <div>
    <!-- ─── HERO ──────────────────────────────────────────── -->
    <section class="hero">
      <div class="orb orb-crimson"></div>
      <div class="orb orb-violet"></div>

      <div class="hero-inner">
        <div class="hero-rail"></div>
        <div class="hero-text">
          <p class="eyebrow">Archivo del Mundo</p>
          <h1 class="title">Astralys</h1>
          <p class="subtitle">
            Un mundo donde la magia sangra en la historia<br>
            y cada nombre carga el peso de su destino.
          </p>
        </div>
      </div>

      <div class="scroll-cue">
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- ─── PERSONAJES ────────────────────────────────────── -->
    <section class="section" ref="persRef">
      <div class="section-head">
        <span class="section-label">Personajes</span>
        <NuxtLink to="/personajes" class="see-all">Ver todos →</NuxtLink>
      </div>
      <div class="chars-grid">
        <div
          v-for="(p, i) in personajes"
          :key="p.id"
          class="char-wrap"
          :class="{ featured: i === 0 }"
          :style="`--i:${i}`"
        >
          <NuxtLink :to="`/personajes/${p.id}`" class="char-card">
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
      </div>
    </section>

    <!-- ─── CAPÍTULOS ─────────────────────────────────────── -->
    <section class="section" ref="capsRef">
      <div class="section-head">
        <span class="section-label">Capítulos</span>
        <NuxtLink to="/capitulos" class="see-all">Historia →</NuxtLink>
      </div>
      <div class="chapters">
        <NuxtLink
          v-for="(cap, i) in capitulos"
          :key="cap.id"
          :to="`/capitulos/${cap.id}`"
          class="chapter-row"
          :class="{ pendiente: cap.estado === 'Pendiente' }"
          :style="`--i:${i}`"
        >
          <span class="chapter-num">{{ String(cap.numero).padStart(2, '0') }}</span>
          <div class="chapter-body">
            <span class="chapter-title">{{ cap.titulo }}</span>
            <span class="chapter-tipo">{{ cap.tipo }}</span>
          </div>
          <span class="chapter-arrow">→</span>
          <div class="chapter-accent"></div>
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
    .limit(5)
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

const persRef = ref(null)
const capsRef = ref(null)

function reveal(el) {
  if (!el) return
  const obs = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect() } },
    { threshold: 0.08 }
  )
  obs.observe(el)
}

onMounted(() => {
  reveal(persRef.value)
  reveal(capsRef.value)
})
</script>

<style scoped>
/* ─── HERO ──────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6rem max(2rem, 8vw) 4rem;
  border-bottom: 1px solid var(--bd);
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(90px);
}
.orb-crimson {
  width: 700px; height: 700px;
  top: -200px; left: -150px;
  background: radial-gradient(circle, rgba(196,32,64,0.22) 0%, transparent 65%);
}
.orb-violet {
  width: 500px; height: 500px;
  bottom: -100px; right: 5%;
  background: radial-gradient(circle, rgba(124,77,224,0.15) 0%, transparent 65%);
}

.hero-inner {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1000px;
}

.hero-rail {
  width: 2px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--accent) 0%, transparent 100%);
  height: clamp(80px, 18vh, 160px);
  margin-top: 0.8rem;
}

.hero-text { display: flex; flex-direction: column; }

.eyebrow {
  font-family: 'Cinzel', serif;
  font-size: clamp(9px, 1.1vw, 11px);
  letter-spacing: 0.4em;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 1rem;
  opacity: 0;
  animation: fadeUp 600ms var(--ease-out) 100ms both;
}

.title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4.5rem, 13vw, 10rem);
  font-weight: 300;
  color: var(--t1);
  letter-spacing: -0.02em;
  line-height: 0.9;
  margin-bottom: 1.75rem;
  opacity: 0;
  animation: fadeUp 800ms var(--ease-out) 200ms both;
}

.subtitle {
  font-family: 'Crimson Pro', serif;
  font-size: clamp(1rem, 1.7vw, 1.25rem);
  font-style: italic;
  color: var(--t2);
  line-height: 1.75;
  max-width: 440px;
  opacity: 0;
  animation: fadeUp 800ms var(--ease-out) 380ms both;
}

.scroll-cue {
  position: absolute;
  bottom: 3rem;
  left: max(2rem, 8vw);
  opacity: 0;
  animation: fadeUp 600ms var(--ease-out) 750ms both;
}

.scroll-line {
  width: 1px;
  height: 52px;
  background: linear-gradient(180deg, var(--accent) 0%, transparent 100%);
  animation: scrollPulse 2.4s ease-in-out 1.5s infinite;
}

@keyframes scrollPulse {
  0%, 100% { transform: scaleY(1); opacity: 0.45; }
  50%       { transform: scaleY(1.1); opacity: 1; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── SECTIONS ──────────────────────────────── */
.section {
  padding: 3.5rem max(2rem, 6vw);
  border-bottom: 1px solid var(--bd);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-label {
  font-family: 'Cinzel', serif;
  font-size: clamp(9px, 1.1vw, 11px);
  letter-spacing: 0.3em;
  color: var(--t3);
  text-transform: uppercase;
}

.see-all {
  font-family: 'Cinzel', serif;
  font-size: clamp(8px, 1vw, 10px);
  letter-spacing: 0.2em;
  color: var(--t3);
  transition: color 180ms var(--ease-out);
}
.see-all:hover { color: var(--accent); }

/* ─── CHARS GRID ─────────────────────────────── */
.chars-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 8px;
}

.char-wrap {
  opacity: 0;
  transform: translateY(16px);
}
.char-wrap.featured { grid-row: span 2; }

.section.revealed .char-wrap {
  animation: revealCard 550ms var(--ease-out) calc(var(--i) * 70ms + 80ms) both;
}

@keyframes revealCard {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.char-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--s1);
  border-radius: 2px;
  overflow: hidden;
  transition: transform 220ms var(--ease-out), box-shadow 260ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .char-card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 0 0 1px var(--accent),
      0 16px 48px rgba(0,0,0,0.6),
      0 0 80px var(--accent-dim);
  }
  .char-card:hover .char-img img { transform: scale(1.05); }
  .char-card:active { transform: translateY(-2px) scale(0.99); }
}

.char-img {
  width: 100%;
  aspect-ratio: 3/4;
  background: var(--s2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.char-wrap.featured .char-img { aspect-ratio: 3/5; }

.char-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 400ms var(--ease-out);
}

.char-initial {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3.5rem;
  font-weight: 300;
  color: var(--bd-strong);
}

.char-info {
  padding: 12px 14px;
  background: var(--s1);
  border-top: 1px solid var(--bd);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.char-name {
  font-family: 'Cinzel', serif;
  font-size: clamp(9px, 1.1vw, 11px);
  letter-spacing: 0.08em;
  color: var(--t1);
  display: block;
}

.char-role {
  font-family: 'Crimson Pro', serif;
  font-size: 13px;
  color: var(--t3);
  font-style: italic;
}

/* ─── CHAPTERS ───────────────────────────────── */
.chapters { display: flex; flex-direction: column; gap: 2px; }

.chapter-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.1rem 1.25rem 1.1rem 1.5rem;
  background: var(--s1);
  border-radius: 2px;
  overflow: hidden;
  transition: background 180ms ease;
  opacity: 0;
  transform: translateX(-10px);
}

.section.revealed .chapter-row {
  animation: revealRow 480ms var(--ease-out) calc(var(--i) * 55ms + 100ms) both;
}

@keyframes revealRow {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}

.chapter-accent {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--accent);
  clip-path: inset(0 0 100% 0);
  transition: clip-path 220ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .chapter-row:hover { background: var(--s2); }
  .chapter-row:hover .chapter-accent { clip-path: inset(0 0 0% 0); }
  .chapter-row:hover .chapter-num { color: var(--accent); }
  .chapter-row:hover .chapter-arrow { color: var(--accent); transform: translateX(3px); }
  .chapter-row:active { transform: scale(0.995); }
}

.chapter-num {
  font-family: 'Cinzel', serif;
  font-size: clamp(20px, 2.5vw, 30px);
  font-weight: 700;
  color: var(--bd-strong);
  min-width: 52px;
  line-height: 1;
  transition: color 180ms ease;
}

.chapter-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.chapter-title {
  font-family: 'Crimson Pro', serif;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  color: var(--t1);
  line-height: 1.3;
}

.chapter-tipo {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--t3);
  text-transform: uppercase;
}

.chapter-arrow {
  color: var(--t3);
  font-size: 14px;
  transition: color 180ms ease, transform 220ms var(--ease-out);
}

.chapter-row.pendiente .chapter-title { color: var(--t3); }
.chapter-row.pendiente .chapter-num { color: var(--bd); }

/* ─── RESPONSIVE ─────────────────────────────── */
@media (max-width: 640px) {
  .hero-rail { display: none; }
  .chars-grid { grid-template-columns: 1fr 1fr; }
  .char-wrap.featured { grid-column: span 2; grid-row: span 1; }
  .char-wrap.featured .char-img { aspect-ratio: 16/9; }
  .chapter-num { min-width: 36px; }
}
</style>
