<template>
  <div class="page">
    <div class="page-header">
      <p class="eyebrow">Archivo del mundo</p>
      <h1 class="page-title">{{ titulo }}</h1>
      <p v-if="subtitulo" class="page-subtitulo">{{ subtitulo }}</p>
      <div class="divider">
        <div class="line"></div>
        <div class="gem"></div>
        <div class="line right"></div>
      </div>
    </div>

    <div class="filters" v-if="buscable">
      <input v-model="busqueda" class="search" :placeholder="`Buscar ${titulo.toLowerCase()}...`" type="text" />
    </div>

    <slot :items="itemsFiltrados" />

    <p v-if="itemsFiltrados.length === 0" class="empty">No se encontraron resultados.</p>
  </div>
</template>

<script setup>
const props = defineProps({
  titulo: String,
  subtitulo: String,
  items: { type: Array, default: () => [] },
  camposBusqueda: { type: Array, default: () => ['nombre'] },
  buscable: { type: Boolean, default: true }
})

const busqueda = ref('')

const itemsFiltrados = computed(() => {
  if (!busqueda.value) return props.items
  const q = busqueda.value.toLowerCase()
  return props.items.filter(item =>
    props.camposBusqueda.some(campo => item[campo]?.toLowerCase().includes(q))
  )
})
</script>

<style scoped>
.page { padding: 2rem 1.5rem; }

.page-header {
  text-align: center;
  padding: 2rem 0 2.5rem;
  border-bottom: 1px solid #1e1810;
  margin-bottom: 2rem;
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

.page-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #f0e4c0;
  letter-spacing: 0.08em;
}

.page-subtitulo {
  font-style: italic;
  color: #7a6a50;
  font-size: 1rem;
  margin-top: 0.5rem;
  max-width: 500px;
  margin-inline: auto;
  line-height: 1.6;
}

.divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 1.25rem; }
.line { height: 1px; width: 60px; background: linear-gradient(90deg, transparent, #c8a84b); }
.line.right { background: linear-gradient(90deg, #c8a84b, transparent); }
.gem { width: 6px; height: 6px; background: #c8a84b; transform: rotate(45deg); }

.filters { margin-bottom: 1.5rem; }

.search {
  width: 100%;
  background: #12100a;
  border: 1px solid #2a2010;
  border-radius: 4px;
  padding: 10px 16px;
  color: #e8dfc8;
  font-family: 'Crimson Pro', serif;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
.search::placeholder { color: #4a3a20; }
.search:focus { border-color: #c8a84b; }

.empty {
  text-align: center;
  color: #4a3a20;
  font-style: italic;
  padding: 3rem 0;
}
</style>