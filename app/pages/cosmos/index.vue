<template>
  <div class="cosmos-page">
    <div class="page-header">
      <p class="eyebrow">Astralys</p>
      <h1 class="page-title">El Cosmos</h1>
      <div class="divider"><div class="line"></div><div class="gem"></div><div class="line right"></div></div>
      <p class="page-sub">La estructura del mundo y los planos de existencia</p>
    </div>

    <div class="planos">
      <div v-for="plano in PLANOS" :key="plano.nombre" class="plano-card">
        <div class="plano-top">
          <span class="plano-symbol">{{ plano.symbol }}</span>
          <div>
            <h2 class="plano-nombre">{{ plano.nombre }}</h2>
            <span class="plano-tipo">{{ plano.tipo }}</span>
          </div>
        </div>
        <p class="plano-desc">{{ plano.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({ title: 'El Cosmos — Astralys' })

const PLANOS = [
  {
    symbol: '☀',
    nombre: 'Plano Material',
    tipo: 'Plano primario',
    descripcion: 'El mundo físico donde transcurre la historia. Astralys, sus naciones, sus mares y sus montañas.',
  },
  {
    symbol: '✦',
    nombre: 'El Vacío',
    tipo: 'Plano del maná',
    descripcion: 'La fuente de toda magia. Un espacio entre planos donde el maná fluye puro y sin forma, inaccesible para los mortales comunes.',
  },
  {
    symbol: '◈',
    nombre: 'Plano Espiritual',
    tipo: 'Plano intermedio',
    descripcion: 'El reino de los espíritus, los ancestros y las entidades que habitan entre la vida y la muerte.',
  },
  {
    symbol: '◉',
    nombre: 'Plano Demoníaco',
    tipo: 'Plano inferior',
    descripcion: 'El dominio de los Lords Demonio. Un reflejo distorsionado del mundo material, corrompido por siglos de conflicto.',
  },
  {
    symbol: '◌',
    nombre: 'Plano Divino',
    tipo: 'Plano superior',
    descripcion: 'Las esferas más elevadas de existencia, habitadas por entidades de poder incomprensible para los mortales.',
  },
]
</script>

<style scoped>
.cosmos-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem 1.5rem 6rem;
}

.page-header { text-align: center; margin-bottom: 3rem; }
.eyebrow {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.35em;
  color: var(--accent);
  opacity: 0.7;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}
.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--t1);
  letter-spacing: 0.05em;
}
.divider { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 1rem; }
.line { height: 1px; width: 60px; background: linear-gradient(90deg, transparent, var(--accent)); }
.line.right { background: linear-gradient(90deg, var(--accent), transparent); }
.gem { width: 6px; height: 6px; background: var(--accent); transform: rotate(45deg); }
.page-sub {
  font-family: 'Crimson Pro', serif;
  font-size: 1rem;
  color: var(--t3);
  font-style: italic;
  margin-top: 0.75rem;
}

.planos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1px;
}

.plano-card {
  padding: 1.5rem;
  border: 1px solid var(--bd);
  background: var(--s1);
  transition: border-color 200ms ease, background 200ms ease;
}
.plano-card:hover { border-color: var(--bd-strong); background: var(--s2); }

.plano-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 0.75rem;
}
.plano-symbol {
  font-size: 1.4rem;
  color: var(--accent);
  opacity: 0.6;
  line-height: 1;
  margin-top: 2px;
}
.plano-nombre {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--t1);
  margin-bottom: 3px;
}
.plano-tipo {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--accent);
  opacity: 0.7;
}
.plano-desc {
  font-family: 'Crimson Pro', serif;
  font-size: 0.97rem;
  color: var(--t2);
  line-height: 1.65;
}
</style>
