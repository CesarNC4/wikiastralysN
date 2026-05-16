<template>
  <div v-if="personaje">
    <div class="banner" :style="personaje.banner_url ? `background-image: url('${personaje.banner_url}')` : ''">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <div class="avatar">
          <img v-if="personaje.imagen_url" :src="personaje.imagen_url" :alt="personaje.nombre" />
          <span v-else class="avatar-initial">{{ personaje.nombre[0] }}</span>
        </div>
        <div class="banner-info">
          <p v-if="personaje.titulo" class="char-titulo">{{ personaje.titulo }}</p>
          <h1 class="char-nombre">{{ personaje.nombre }} <span v-if="personaje.surname" class="char-surname">{{ personaje.surname }}</span></h1>
          <p v-if="personaje.subtitulo" class="char-subtitulo">{{ personaje.subtitulo }}</p>
          <div class="char-tags">
            <span v-if="personaje.ocupacion" class="tag">{{ personaje.ocupacion }}</span>
            <span v-if="personaje.rango_aventurero" class="tag gold">{{ personaje.rango_aventurero }}</span>
            <span v-if="personaje.genero" class="tag">{{ personaje.genero }}</span>
            <span v-if="personaje.edad" class="tag">{{ personaje.edad }} años</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="section" v-if="personaje.historia">
        <div class="section-header">
          <span class="section-title">Historia</span>
          <div class="section-line"></div>
        </div>
        <p class="prose">{{ personaje.historia }}</p>
      </div>

      <div class="section" v-if="personaje.rasgos_personalidad">
        <div class="section-header">
          <span class="section-title">Personalidad</span>
          <div class="section-line"></div>
        </div>
        <p class="prose">{{ personaje.rasgos_personalidad }}</p>
      </div>

      <div class="two-col">
        <div class="section" v-if="personaje.motivacion">
          <div class="section-header">
            <span class="section-title">Motivación</span>
            <div class="section-line"></div>
          </div>
          <p class="prose">{{ personaje.motivacion }}</p>
        </div>
        <div class="section" v-if="personaje.miedos">
          <div class="section-header">
            <span class="section-title">Miedos</span>
            <div class="section-line"></div>
          </div>
          <p class="prose">{{ personaje.miedos }}</p>
        </div>
      </div>

      <div class="section" v-if="personaje.tipo_magia_principal">
        <div class="section-header">
          <span class="section-title">Magia</span>
          <div class="section-line"></div>
        </div>
        <div class="magic-grid">
          <div class="magic-item" v-if="personaje.tipo_magia_principal">
            <span class="magic-label">Principal</span>
            <span class="magic-value">{{ personaje.tipo_magia_principal }}</span>
          </div>
          <div class="magic-item" v-if="personaje.magia_secundaria">
            <span class="magic-label">Secundaria</span>
            <span class="magic-value">{{ personaje.magia_secundaria }}</span>
          </div>
          <div class="magic-item" v-if="personaje.essentia">
            <span class="magic-label">Essentia</span>
            <span class="magic-value">{{ personaje.essentia }}</span>
          </div>
          <div class="magic-item" v-if="personaje.zenithra">
            <span class="magic-label">Zenithra</span>
            <span class="magic-value">{{ personaje.zenithra }}</span>
          </div>
          <div class="magic-item" v-if="personaje.bendicion">
            <span class="magic-label">Bendición</span>
            <span class="magic-value">{{ personaje.bendicion }}</span>
          </div>
          <div class="magic-item" v-if="personaje.circuito_forte">
            <span class="magic-label">Circuito forte</span>
            <span class="magic-value">{{ personaje.circuito_forte }}</span>
          </div>
        </div>
      </div>

      <div class="section" v-if="estadisticas">
        <div class="section-header">
          <span class="section-title">Estadísticas</span>
          <div class="section-line"></div>
        </div>
        <div class="stats-grid">
          <div class="stat" v-if="estadisticas.fuerza">
            <span class="stat-label">Fuerza</span>
            <div class="stat-bar"><div class="stat-fill" :style="`width: ${estadisticas.fuerza}%`"></div></div>
            <span class="stat-val">{{ estadisticas.fuerza }}</span>
          </div>
          <div class="stat" v-if="estadisticas.destreza">
            <span class="stat-label">Destreza</span>
            <div class="stat-bar"><div class="stat-fill" :style="`width: ${estadisticas.destreza}%`"></div></div>
            <span class="stat-val">{{ estadisticas.destreza }}</span>
          </div>
          <div class="stat" v-if="estadisticas.inteligencia">
            <span class="stat-label">Inteligencia</span>
            <div class="stat-bar"><div class="stat-fill" :style="`width: ${estadisticas.inteligencia}%`"></div></div>
            <span class="stat-val">{{ estadisticas.inteligencia }}</span>
          </div>
          <div class="stat" v-if="estadisticas.sabiduria">
            <span class="stat-label">Sabiduría</span>
            <div class="stat-bar"><div class="stat-fill" :style="`width: ${estadisticas.sabiduria}%`"></div></div>
            <span class="stat-val">{{ estadisticas.sabiduria }}</span>
          </div>
          <div class="stat" v-if="estadisticas.constitucion">
            <span class="stat-label">Constitución</span>
            <div class="stat-bar"><div class="stat-fill" :style="`width: ${estadisticas.constitucion}%`"></div></div>
            <span class="stat-val">{{ estadisticas.constitucion }}</span>
          </div>
          <div class="stat" v-if="estadisticas.carisma">
            <span class="stat-label">Carisma</span>
            <div class="stat-bar"><div class="stat-fill" :style="`width: ${estadisticas.carisma}%`"></div></div>
            <span class="stat-val">{{ estadisticas.carisma }}</span>
          </div>
        </div>
      </div>

      <div class="section" v-if="relaciones.length">
        <div class="section-header">
          <span class="section-title">Relaciones</span>
          <div class="section-line"></div>
        </div>
        <div class="relaciones">
          <NuxtLink
            v-for="r in relaciones"
            :key="r.id_rr"
            :to="r.personaje_relacionado_id ? `/personajes/${r.personaje_relacionado_id}` : '#'"
            class="relacion-item"
          >
            <span class="relacion-nombre">{{ r.nombre_pj_organizacion }}</span>
            <span class="relacion-tipo">{{ r.tipo_relacion }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Personaje no encontrado.</p>
    <NuxtLink to="/personajes" class="back">← Volver a personajes</NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const id = route.params.id

const { data: personaje } = await useAsyncData(`personaje-${id}`, async () => {
  const { data } = await supabase
    .from('personajes')
    .select('*')
    .eq('id', id)
    .eq('visible', true)
    .single()
  return data
})

const { data: estadisticas } = await useAsyncData(`stats-${id}`, async () => {
  const { data } = await supabase
    .from('estadisticas')
    .select('*')
    .eq('personaje_id', id)
    .single()
  return data
})

const { data: relaciones } = await useAsyncData(`relaciones-${id}`, async () => {
  const { data } = await supabase
    .from('relaciones')
    .select('*')
    .eq('personaje_id', id)
  return data ?? []
})

useSeoMeta({
  title: personaje.value ? `${personaje.value.nombre} — Astralys` : 'Astralys',
})
</script>

<style scoped>
.banner {
  position: relative;
  min-height: 280px;
  background: #12100a;
  background-size: cover;
  background-position: center top;
  display: flex;
  align-items: flex-end;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #0e0b07 0%, rgba(14,11,7,0.5) 60%, transparent 100%);
}

.banner-content {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  width: 100%;
}

.avatar {
  width: 100px;
  height: 130px;
  border: 1px solid #2a2010;
  border-radius: 4px;
  overflow: hidden;
  background: #16120c;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initial { font-family: 'Cinzel', serif; font-size: 2.5rem; color: #2a2010; font-weight: 700; }

.char-titulo {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.25em;
  color: #c8a84b;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.char-nombre {
  font-family: 'Cinzel', serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #f0e4c0;
  letter-spacing: 0.05em;
  line-height: 1.1;
}
.char-surname { color: #a89070; }

.char-subtitulo {
  font-style: italic;
  color: #7a6a50;
  font-size: 0.95rem;
  margin-top: 0.25rem;
}

.char-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 0.75rem;
}

.tag {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  padding: 3px 8px;
  border: 1px solid #2a2010;
  color: #5a4a30;
  border-radius: 2px;
}
.tag.gold { border-color: #c8a84b44; color: #c8a84b; }

.content { padding: 2rem 1.5rem; }

.section { margin-bottom: 2rem; }

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.25em;
  color: #c8a84b;
  text-transform: uppercase;
  white-space: nowrap;
}

.section-line { flex: 1; height: 1px; background: linear-gradient(90deg, #2a2010, transparent); }

.prose {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #c8b890;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.magic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.magic-item {
  background: #16120c;
  border: 1px solid #2a2010;
  border-radius: 4px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.magic-label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a3a20; }
.magic-value { font-size: 0.95rem; color: #e8dfc8; }

.stats-grid { display: flex; flex-direction: column; gap: 10px; }

.stat { display: flex; align-items: center; gap: 12px; }
.stat-label { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.1em; color: #5a4a30; min-width: 90px; }
.stat-bar { flex: 1; height: 3px; background: #1e1810; border-radius: 2px; overflow: hidden; }
.stat-fill { height: 100%; background: #c8a84b; border-radius: 2px; transition: width 0.6s ease; }
.stat-val { font-family: 'Cinzel', serif; font-size: 11px; color: #c8a84b; min-width: 28px; text-align: right; }

.relaciones { display: flex; flex-direction: column; gap: 1px; border: 1px solid #2a2010; border-radius: 4px; overflow: hidden; }

.relacion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #12100a;
  border-bottom: 1px solid #1a1408;
  transition: background 0.15s;
}
.relacion-item:last-child { border-bottom: none; }
.relacion-item:hover { background: #18150e; }
.relacion-nombre { font-size: 1rem; color: #c8b890; }
.relacion-tipo { font-family: 'Cinzel', serif; font-size: 10px; color: #4a3a20; letter-spacing: 0.1em; }

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  color: #4a3a20;
  font-style: italic;
}
.back { color: #c8a84b; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.15em; }
</style>