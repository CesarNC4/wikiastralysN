<template>
  <div>
    <div class="page-header">
      <p class="eyebrow">Panel de control</p>
      <h1 class="page-title">Astralys Admin</h1>
      <div class="divider"><div class="line"></div><div class="gem"></div><div class="line right"></div></div>
      <p class="welcome">{{ userEmail }}</p>
    </div>

    <!-- Contadores -->
    <div class="stats-bar">
      <div v-for="s in stats" :key="s.key" class="stat-chip">
        <div class="stat-num" :class="{ loading: loadingStats }">{{ conteos[s.key] ?? '—' }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>

    <!-- Accesos rápidos especiales -->
    <div class="special-grid">
      <NuxtLink to="/admin/taller" class="special-card">
        <span class="special-icon">🔨</span>
        <div>
          <div class="special-title">Taller de Tramas</div>
          <div class="special-sub">Arcos, hojas y consistencia narrativa</div>
        </div>
        <span class="special-arrow">→</span>
      </NuxtLink>
      <NuxtLink to="/admin/notas" class="special-card">
        <span class="special-icon">📝</span>
        <div>
          <div class="special-title">Notas Privadas</div>
          <div class="special-sub">Apuntes del autor por entidad</div>
        </div>
        <span class="special-arrow">→</span>
      </NuxtLink>
      <NuxtLink to="/admin/gremio" class="special-card">
        <span class="special-icon">⚔</span>
        <div>
          <div class="special-title">Gremio de Aventureros</div>
          <div class="special-sub">Estructura y miembros del gremio</div>
        </div>
        <span class="special-arrow">→</span>
      </NuxtLink>
      <NuxtLink to="/busqueda" target="_blank" class="special-card">
        <span class="special-icon">🔍</span>
        <div>
          <div class="special-title">Búsqueda Global</div>
          <div class="special-sub">Buscar en toda la wiki</div>
        </div>
        <span class="special-arrow">→</span>
      </NuxtLink>
    </div>

    <!-- Grid de secciones -->
    <div class="sections-grid">
      <NuxtLink v-for="s in SECCIONES" :key="s.to" :to="s.to" class="section-card">
        <span class="section-icon">{{ s.icon }}</span>
        <span class="section-label">{{ s.label }}</span>
        <span class="section-count">{{ conteos[s.countKey] ?? '' }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const supabase  = useSupabaseClient()
const user      = useSupabaseUser()
const userEmail = computed(() => user.value?.email ?? '')

const loadingStats = ref(true)
const conteos = ref({})

const STATS_TABLAS = [
  { key: 'personajes',     tabla: 'personajes' },
  { key: 'capitulos',      tabla: 'capitulos' },
  { key: 'naciones',       tabla: 'naciones' },
  { key: 'razas',          tabla: 'razas' },
  { key: 'organizaciones', tabla: 'organizaciones' },
  { key: 'familias',       tabla: 'familias' },
  { key: 'bestias',        tabla: 'bestias' },
  { key: 'lord_demonio',   tabla: 'lord_demonio' },
  { key: 'armas',          tabla: 'armas_artefactos' },
  { key: 'magia',          tabla: 'magia_fundamentos' },
  { key: 'minerales',      tabla: 'minerales' },
  { key: 'misiones',       tabla: 'misiones' },
  { key: 'conceptos',      tabla: 'conceptos' },
  { key: 'canciones',      tabla: 'canciones' },
]

const stats = [
  { key: 'personajes',     label: 'Personajes' },
  { key: 'capitulos',      label: 'Capítulos' },
  { key: 'naciones',       label: 'Naciones' },
  { key: 'organizaciones', label: 'Orgs' },
  { key: 'familias',       label: 'Familias' },
  { key: 'bestias',        label: 'Bestias' },
  { key: 'magia',          label: 'Magias' },
  { key: 'armas',          label: 'Armas' },
  { key: 'misiones',       label: 'Misiones' },
  { key: 'canciones',      label: 'Canciones' },
]

const SECCIONES = [
  { label: 'Personajes',     to: '/admin/personajes',     icon: '⚔',  countKey: 'personajes' },
  { label: 'Capítulos',      to: '/admin/capitulos',      icon: '📖', countKey: 'capitulos' },
  { label: 'Naciones',       to: '/admin/naciones',       icon: '🏰', countKey: 'naciones' },
  { label: 'Razas',          to: '/admin/razas',          icon: '🌿', countKey: 'razas' },
  { label: 'Organizaciones', to: '/admin/organizaciones', icon: '⚖',  countKey: 'organizaciones' },
  { label: 'Familias',       to: '/admin/familias',       icon: '🌳', countKey: 'familias' },
  { label: 'Bestiario',      to: '/admin/bestiario',      icon: '🐉', countKey: 'bestias' },
  { label: 'Lords Demonio',  to: '/admin/lord-demonio',   icon: '👁',  countKey: 'lord_demonio' },
  { label: 'Armas',          to: '/admin/armas',          icon: '🗡',  countKey: 'armas' },
  { label: 'Magia',          to: '/admin/magia',          icon: '✦',  countKey: 'magia' },
  { label: 'Minerales',      to: '/admin/minerales',      icon: '💎', countKey: 'minerales' },
  { label: 'Misiones',       to: '/admin/misiones',       icon: '📜', countKey: 'misiones' },
  { label: 'Conceptos',      to: '/admin/conceptos',      icon: '🔮', countKey: 'conceptos' },
  { label: 'Lore',           to: '/admin/lore',           icon: '📚', countKey: null },
  { label: 'Canciones',      to: '/admin/canciones',      icon: '♪',  countKey: 'canciones' },
  { label: 'Monedas',        to: '/admin/monedas',        icon: '🪙', countKey: null },
  { label: 'Timeline',       to: '/admin/timeline',       icon: '⏳', countKey: null },
  { label: 'Notas',          to: '/admin/notas',          icon: '🗒',  countKey: null },
]

onMounted(async () => {
  const resultados = await Promise.all(
    STATS_TABLAS.map(s =>
      supabase.from(s.tabla).select('*', { count: 'exact', head: true })
        .then(({ count }) => [s.key, count ?? 0])
    )
  )
  conteos.value = Object.fromEntries(resultados)
  loadingStats.value = false
})
</script>

<style scoped>
.page-header {
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid var(--bd);
  margin-bottom: 1.5rem;
}
.eyebrow {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.35em;
  color: var(--t3);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  display: block;
}
.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 300;
  color: var(--t1);
  letter-spacing: -0.01em;
}
.divider { display: none; }
.welcome {
  margin-top: 0.5rem;
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--t3);
  opacity: 0.6;
}

/* Stats */
.stats-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem; }
.stat-chip {
  background: var(--s1);
  border: 1px solid var(--bd);
  border-radius: 2px;
  padding: 12px 16px;
  text-align: center;
  min-width: 90px;
  flex: 1;
}
.stat-num {
  font-family: 'Cinzel', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--accent);
  transition: opacity 0.3s;
}
.stat-num.loading { opacity: 0.2; }
.stat-label {
  font-family: 'Cinzel', serif;
  font-size: 8px;
  letter-spacing: 0.15em;
  color: var(--t3);
  text-transform: uppercase;
  margin-top: 4px;
}

/* Special cards */
.special-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
  margin-bottom: 1.5rem;
}
.special-card {
  background: var(--s1);
  border: 1px solid var(--bd);
  border-radius: 2px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: border-color 180ms var(--ease-out), background 180ms ease;
}
.special-card:hover { border-color: var(--accent); background: var(--s2); }
.special-icon { font-size: 1.3rem; flex-shrink: 0; }
.special-title {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--t1);
  text-transform: uppercase;
}
.special-sub {
  font-family: 'Crimson Pro', serif;
  font-size: 0.82rem;
  color: var(--t3);
  margin-top: 2px;
}
.special-arrow {
  color: var(--t3);
  margin-left: auto;
  transition: color 180ms ease, transform 220ms var(--ease-out);
}
.special-card:hover .special-arrow { color: var(--accent); transform: translateX(3px); }

/* Sections grid */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
}
.section-card {
  background: var(--s1);
  border: 1px solid var(--bd);
  border-radius: 2px;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: border-color 180ms var(--ease-out), background 180ms ease, transform 220ms var(--ease-out);
}
.section-card:hover { border-color: var(--accent); background: var(--s2); transform: translateY(-2px); }
.section-icon { font-size: 1.3rem; }
.section-label {
  font-family: 'Cinzel', serif;
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--t3);
  text-align: center;
}
.section-count {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  color: var(--t3);
  opacity: 0.6;
}
</style>
