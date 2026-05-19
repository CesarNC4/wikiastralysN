<template>
  <div class="search-page">
    <div class="search-header">
      <p class="eyebrow">Wikiastralys</p>
      <h1 class="page-title">Búsqueda</h1>
      <div class="divider"><div class="line"></div><div class="gem"></div><div class="line right"></div></div>
    </div>

    <div class="search-bar-wrap">
      <input
        v-model="query"
        class="search-input"
        placeholder="Buscar personajes, naciones, armas, conceptos..."
        autofocus
        @input="onInput"
      />
      <span v-if="query" class="search-clear" @click="query = ''; resultados = {}">✕</span>
    </div>

    <div v-if="loading" class="loading-msg">Buscando...</div>

    <div v-else-if="query.length >= 2 && totalResultados === 0" class="empty">
      Sin resultados para "<em>{{ query }}</em>".
    </div>

    <div v-else-if="totalResultados > 0" class="results-wrap">
      <p class="total-count">{{ totalResultados }} resultado{{ totalResultados !== 1 ? 's' : '' }}</p>

      <div v-for="grupo in gruposConResultados" :key="grupo.key" class="grupo">
        <div class="grupo-header">
          <span class="grupo-icon">{{ grupo.icon }}</span>
          <span class="grupo-label">{{ grupo.label }}</span>
          <span class="grupo-count">{{ resultados[grupo.key]?.length || 0 }}</span>
        </div>
        <div class="grupo-items">
          <NuxtLink
            v-for="item in resultados[grupo.key]"
            :key="item.id"
            :to="`${grupo.ruta}/${item.id}`"
            class="result-item"
          >
            <img v-if="item.imagen_url" :src="item.imagen_url" class="result-img" />
            <div v-else class="result-img-ph">{{ (item.nombre || item.titulo || '?')[0] }}</div>
            <div class="result-info">
              <span class="result-nombre">{{ item.nombre || item.titulo }}</span>
              <span v-if="item.subtitulo || item.titulo_extra" class="result-sub">{{ item.subtitulo || item.titulo_extra }}</span>
            </div>
            <span class="result-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else-if="query.length === 0" class="hint-inicial">
      <p>Escribe al menos 2 caracteres para buscar.</p>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const query    = ref('')
const loading  = ref(false)
const resultados = ref({})

const GRUPOS = [
  { key: 'personajes',    label: 'Personajes',     icon: '⚔',  ruta: '/personajes',    tabla: 'personajes',       campo: 'nombre' },
  { key: 'naciones',      label: 'Naciones',        icon: '🏰', ruta: '/naciones',      tabla: 'naciones',         campo: 'nombre' },
  { key: 'razas',         label: 'Razas',           icon: '🌿', ruta: '/razas',         tabla: 'razas',            campo: 'nombre' },
  { key: 'organizaciones',label: 'Organizaciones',  icon: '⚖',  ruta: '/organizaciones',tabla: 'organizaciones',   campo: 'nombre' },
  { key: 'familias',      label: 'Familias',        icon: '🌳', ruta: '/familias',      tabla: 'familias',         campo: 'nombre' },
  { key: 'bestias',       label: 'Bestiario',       icon: '🐉', ruta: '/bestiario',     tabla: 'bestias',          campo: 'nombre' },
  { key: 'lord_demonio',  label: 'Lords Demonio',   icon: '👁',  ruta: '/lord-demonio',  tabla: 'lord_demonio',     campo: 'nombre' },
  { key: 'armas',         label: 'Armas',           icon: '🗡',  ruta: '/armas',         tabla: 'armas_artefactos', campo: 'nombre' },
  { key: 'magia',         label: 'Magia',           icon: '✦',  ruta: '/magia',         tabla: 'magia_fundamentos',campo: 'nombre' },
  { key: 'minerales',     label: 'Minerales',       icon: '💎', ruta: '/minerales',     tabla: 'minerales',        campo: 'nombre' },
  { key: 'misiones',      label: 'Misiones',        icon: '📜', ruta: '/misiones',      tabla: 'misiones',         campo: 'nombre' },
  { key: 'conceptos',     label: 'Conceptos',       icon: '🔮', ruta: '/conceptos',     tabla: 'conceptos',        campo: 'nombre' },
  { key: 'canciones',     label: 'Canciones',       icon: '♪',  ruta: '/banda-sonora',  tabla: 'canciones',        campo: 'titulo' },
]

const gruposConResultados = computed(() =>
  GRUPOS.filter(g => resultados.value[g.key]?.length > 0)
)

const totalResultados = computed(() =>
  Object.values(resultados.value).reduce((acc, arr) => acc + (arr?.length || 0), 0)
)

let debounceTimer = null
function onInput() {
  clearTimeout(debounceTimer)
  if (query.value.length < 2) { resultados.value = {}; return }
  debounceTimer = setTimeout(buscar, 300)
}

async function buscar() {
  loading.value = true
  const q = query.value.trim()
  try {
    const promesas = GRUPOS.map(async g => {
      const { data } = await supabase
        .from(g.tabla)
        .select(`id, ${g.campo}, subtitulo, imagen_url`)
        .ilike(g.campo, `%${q}%`)
        .eq('visible', true)
        .limit(6)
      return [g.key, data ?? []]
    })
    const pares = await Promise.all(promesas)
    resultados.value = Object.fromEntries(pares)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.search-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem 6rem;
}

.search-header { text-align: center; margin-bottom: 2rem; }
.eyebrow { font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.35em; color:#c8a84b; opacity:0.7; text-transform:uppercase; margin-bottom:0.5rem; }
.page-title { font-family:'Cinzel',serif; font-size:clamp(1.6rem,4vw,2.2rem); font-weight:700; color:#f0e4c0; letter-spacing:0.08em; }
.divider { display:flex; align-items:center; justify-content:center; gap:10px; margin-top:1rem; }
.line { height:1px; width:50px; background:linear-gradient(90deg,transparent,#c8a84b); }
.line.right { background:linear-gradient(90deg,#c8a84b,transparent); }
.gem { width:6px; height:6px; background:#c8a84b; transform:rotate(45deg); }

.search-bar-wrap {
  position: relative;
  margin-bottom: 2rem;
}
.search-input {
  width: 100%;
  box-sizing: border-box;
  background: #12100a;
  border: 1px solid #2a2010;
  border-radius: 3px;
  padding: 14px 44px 14px 18px;
  color: #e8dfc8;
  font-family: 'Crimson Pro', serif;
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #c8a84b; }
.search-input::placeholder { color: #3a2a10; }
.search-clear {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a3a20;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.search-clear:hover { color: #e24b4a; }

.loading-msg { font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.2em; color:#4a3a20; text-align:center; padding:2rem 0; }
.empty { text-align:center; color:#4a3a20; font-style:italic; padding:2rem 0; font-family:'Crimson Pro',serif; }
.hint-inicial { text-align:center; color:#3a2a10; font-style:italic; padding:3rem 0; font-family:'Crimson Pro',serif; }
.total-count { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.2em; color:#4a3a20; margin-bottom:1.5rem; }

.grupo { margin-bottom: 2rem; }
.grupo-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1e1810;
}
.grupo-icon  { font-size: 0.9rem; }
.grupo-label { font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#7a6a50; flex:1; }
.grupo-count { font-family:'Cinzel',serif; font-size:9px; color:#4a3a20; }

.grupo-items { display: flex; flex-direction: column; gap: 4px; }

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #12100a;
  border: 1px solid #1e1810;
  border-radius: 2px;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
}
.result-item:hover { border-color: #c8a84b; background: #16120c; }

.result-img {
  width: 36px;
  height: 36px;
  border-radius: 2px;
  object-fit: cover;
  object-position: top;
  border: 1px solid #2a2010;
  flex-shrink: 0;
}
.result-img-ph {
  width: 36px;
  height: 36px;
  border-radius: 2px;
  background: #1e1810;
  border: 1px solid #2a2010;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  color: #4a3a20;
  flex-shrink: 0;
}
.result-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.result-nombre { font-family:'Crimson Pro',serif; font-size:1rem; color:#e8dfc8; }
.result-sub    { font-family:'Crimson Pro',serif; font-size:0.82rem; color:#5a4a30; font-style:italic; }
.result-arrow  { color:#2a2010; font-size:0.9rem; transition:color 0.2s; }
.result-item:hover .result-arrow { color:#c8a84b; }
</style>
