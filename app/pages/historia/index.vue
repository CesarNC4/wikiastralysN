<template>
  <div class="historia-page">
    <div class="page-header">
      <p class="eyebrow">Astralys</p>
      <h1 class="page-title">Historia del Mundo</h1>
      <div class="divider"><div class="line"></div><div class="gem"></div><div class="line right"></div></div>
    </div>

    <div class="eras">
      <div v-for="era in ERAS" :key="era.nombre" class="era-bloque">
        <div class="era-header">
          <span class="era-icon">{{ era.icon }}</span>
          <h2 class="era-titulo">{{ era.nombre }}</h2>
          <span class="era-rango">{{ era.rango }}</span>
        </div>
        <p class="era-desc">{{ era.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({ title: 'Historia del Mundo — Astralys' })

const ERAS = [
  {
    icon: '◈',
    nombre: 'Era Primordial',
    rango: 'Antes del tiempo',
    descripcion: 'El inicio de todo. Los primeros seres y las fuerzas que dieron forma al mundo de Astralys.',
  },
  {
    icon: '◉',
    nombre: 'Era Pre-Ishkoria',
    rango: 'Años 0 – 899',
    descripcion: 'Las civilizaciones antiguas florecen antes del ascenso del Imperio. Guerras, alianzas y el despertar del maná.',
  },
  {
    icon: '⚔',
    nombre: 'Era de Ishkoria',
    rango: 'Años 900 – 1299',
    descripcion: 'El Imperio de Ishkoria domina el mundo conocido. Su auge y su caída marcan el antes y el después de la historia.',
  },
  {
    icon: '◌',
    nombre: 'Era de la Fragmentación',
    rango: 'Años 1300 – 1599',
    descripcion: 'La caída del Imperio deja un vacío de poder. Las naciones luchan por reconstruirse entre las ruinas del viejo orden.',
  },
  {
    icon: '✦',
    nombre: 'Era Presente',
    rango: 'Año 1600 en adelante',
    descripcion: 'El mundo actual. Nuevas potencias, viejas cicatrices y el Gremio como fuerza estabilizadora en tiempos inciertos.',
  },
]
</script>

<style scoped>
.historia-page {
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

.eras { display: flex; flex-direction: column; gap: 1px; }

.era-bloque {
  padding: 1.5rem 2rem;
  border: 1px solid var(--bd);
  border-radius: 3px;
  background: var(--s1);
  transition: border-color 200ms ease;
}
.era-bloque:hover { border-color: var(--bd-strong); }

.era-header {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 0.6rem;
}
.era-icon { font-size: 0.9rem; color: var(--accent); opacity: 0.8; }
.era-titulo {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--t1);
  flex: 1;
}
.era-rango {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--t3);
}
.era-desc {
  font-family: 'Crimson Pro', serif;
  font-size: 1rem;
  color: var(--t2);
  line-height: 1.7;
}
</style>
