<template>
  <div>
    <div class="list-header">
      <div>
        <p class="eyebrow">Admin</p>
        <h1 class="list-title">Búsqueda Global</h1>
      </div>
    </div>

    <div class="search-bar-wrap">
      <input
        v-model="query"
        class="search-input"
        placeholder="Buscar en todas las tablas..."
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
          <span class="grupo-label">{{ grupo.label }}</span>
          <span class="grupo-count">{{ resultados[grupo.key]?.length || 0 }}</span>
        </div>
        <div class="grupo-items">
          <NuxtLink
            v-for="item in resultados[grupo.key]"
            :key="item.id"
            :to="`${grupo.rutaAdmin}/${item.id}`"
            class="result-item"
          >
            <img v-if="item.imagen_url" :src="item.imagen_url" class="result-img" />
            <div v-else class="result-img-ph">{{ (item.nombre || item.titulo || '?')[0] }}</div>
            <div class="result-info">
              <span class="result-nombre">{{ item.nombre || item.titulo }}</span>
              <span v-if="item.subtitulo" class="result-sub">{{ item.subtitulo }}</span>
            </div>
            <span class="result-badge" :class="{ hidden: !item.visible }">
              {{ item.visible !== false ? 'visible' : 'oculto' }}
            </span>
            <span class="result-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else-if="query.length === 0" class="hint-inicial">
      Escribe al menos 2 caracteres para buscar en todas las tablas.
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabaseClient()
const query    = ref('')
const loading  = ref(false)
const resultados = ref({})

const GRUPOS = [
  { key: 'personajes',     label: 'Personajes',     tabla: 'personajes',        campo: 'nombre', rutaAdmin: '/admin/personajes' },
  { key: 'capitulos',      label: 'Capítulos',      tabla: 'capitulos',         campo: 'titulo', rutaAdmin: '/admin/capitulos' },
  { key: 'naciones',       label: 'Naciones',       tabla: 'naciones',          campo: 'nombre', rutaAdmin: '/admin/naciones' },
  { key: 'razas',          label: 'Razas',          tabla: 'razas',             campo: 'nombre', rutaAdmin: '/admin/razas' },
  { key: 'organizaciones', label: 'Organizaciones', tabla: 'organizaciones',    campo: 'nombre', rutaAdmin: '/admin/organizaciones' },
  { key: 'familias',       label: 'Familias',       tabla: 'familias',          campo: 'nombre', rutaAdmin: '/admin/familias' },
  { key: 'bestias',        label: 'Bestiario',      tabla: 'bestias',           campo: 'nombre', rutaAdmin: '/admin/bestiario' },
  { key: 'lord_demonio',   label: 'Lords Demonio',  tabla: 'lord_demonio',      campo: 'nombre', rutaAdmin: '/admin/lord-demonio' },
  { key: 'armas',          label: 'Armas',          tabla: 'armas_artefactos',  campo: 'nombre', rutaAdmin: '/admin/armas' },
  { key: 'magia',          label: 'Magia',          tabla: 'magia_fundamentos', campo: 'nombre', rutaAdmin: '/admin/magia' },
  { key: 'minerales',      label: 'Minerales',      tabla: 'minerales',         campo: 'nombre', rutaAdmin: '/admin/minerales' },
  { key: 'misiones',       label: 'Misiones',       tabla: 'misiones',          campo: 'nombre', rutaAdmin: '/admin/misiones' },
  { key: 'conceptos',      label: 'Conceptos',      tabla: 'conceptos',         campo: 'nombre', rutaAdmin: '/admin/conceptos' },
  { key: 'canciones',      label: 'Canciones',      tabla: 'canciones',         campo: 'titulo', rutaAdmin: '/admin/canciones' },
  { key: 'paginas_lore',   label: 'Lore',           tabla: 'paginas_lore',      campo: 'titulo', rutaAdmin: '/admin/lore' },
  { key: 'timeline',       label: 'Timeline',       tabla: 'timeline_eventos',  campo: 'titulo', rutaAdmin: '/admin/timeline' },
  { key: 'sistema_monetario', label: 'Monedas',     tabla: 'sistema_monetario', campo: 'nombre', rutaAdmin: '/admin/monedas' },
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
        .select(`id, ${g.campo}, subtitulo, imagen_url, visible`)
        .ilike(g.campo, `%${q}%`)
        .limit(8)
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
.list-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; gap:12px; }
.eyebrow { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.3em; color:#c8a84b; opacity:0.7; text-transform:uppercase; margin-bottom:4px; }
.list-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:700; color:#f0e4c0; letter-spacing:0.06em; }

.search-bar-wrap { position:relative; margin-bottom:2rem; }
.search-input {
  width:100%; box-sizing:border-box;
  background:#12100a; border:1px solid #2a2010; border-radius:2px;
  padding:12px 40px 12px 16px; color:#e8dfc8;
  font-family:'Crimson Pro',serif; font-size:1rem;
  outline:none; transition:border-color 0.2s;
}
.search-input:focus { border-color:#c8a84b; }
.search-input::placeholder { color:#3a2a10; }
.search-clear { position:absolute; right:14px; top:50%; transform:translateY(-50%); color:#4a3a20; cursor:pointer; transition:color 0.2s; }
.search-clear:hover { color:#e24b4a; }

.loading-msg { font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.2em; color:#4a3a20; text-align:center; padding:2rem 0; }
.empty { text-align:center; color:#4a3a20; font-style:italic; padding:2rem 0; font-family:'Crimson Pro',serif; }
.hint-inicial { text-align:center; color:#3a2a10; font-style:italic; padding:3rem 0; font-family:'Crimson Pro',serif; }
.total-count { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.2em; color:#4a3a20; margin-bottom:1.5rem; }

.grupo { margin-bottom:1.5rem; }
.grupo-header { display:flex; align-items:center; gap:10px; margin-bottom:6px; padding-bottom:6px; border-bottom:1px solid #1e1810; }
.grupo-label { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:#7a6a50; flex:1; }
.grupo-count { font-family:'Cinzel',serif; font-size:9px; color:#4a3a20; }
.grupo-items { display:flex; flex-direction:column; gap:3px; }

.result-item {
  display:flex; align-items:center; gap:12px;
  padding:8px 12px;
  background:#12100a; border:1px solid #1e1810; border-radius:2px;
  text-decoration:none; transition:border-color 0.2s, background 0.2s;
}
.result-item:hover { border-color:#c8a84b; background:#16120c; }
.result-img { width:28px; height:28px; border-radius:2px; object-fit:cover; object-position:top; border:1px solid #2a2010; flex-shrink:0; }
.result-img-ph { width:28px; height:28px; border-radius:2px; background:#1e1810; border:1px solid #2a2010; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif; font-size:0.75rem; color:#4a3a20; flex-shrink:0; }
.result-info { flex:1; display:flex; flex-direction:column; gap:1px; }
.result-nombre { font-family:'Crimson Pro',serif; font-size:0.95rem; color:#e8dfc8; }
.result-sub { font-family:'Crimson Pro',serif; font-size:0.8rem; color:#5a4a30; font-style:italic; }
.result-badge { font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.1em; padding:2px 7px; border:1px solid #2a2010; color:#4a8a40; border-radius:2px; }
.result-badge.hidden { color:#6a2020; border-color:#3a1a10; }
.result-arrow { color:#2a2010; font-size:0.85rem; transition:color 0.2s; }
.result-item:hover .result-arrow { color:#c8a84b; }
</style>
