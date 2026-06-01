<template>
  <div class="page">
    <div class="page-header">
      <span class="page-eyebrow">Archivo del mundo</span>
      <h1 class="page-title">{{ titulo }}</h1>
      <p v-if="subtitulo" class="page-subtitulo">{{ subtitulo }}</p>
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
.page { padding: 2rem max(1.5rem, 5vw); }

.page-header {
  padding: 2.5rem 0 2rem;
  border-bottom: 1px solid var(--bd);
  margin-bottom: 2rem;
}

.page-eyebrow {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.4em;
  color: var(--t3);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 300;
  color: var(--t1);
  letter-spacing: -0.01em;
  line-height: 1;
}

.page-subtitulo {
  font-family: 'Crimson Pro', serif;
  font-style: italic;
  color: var(--t3);
  font-size: 1rem;
  margin-top: 0.75rem;
  max-width: 500px;
  line-height: 1.6;
}

.filters { margin-bottom: 1.5rem; }

.search {
  width: 100%;
  background: var(--s1);
  border: 1px solid var(--bd);
  border-radius: 2px;
  padding: 10px 16px;
  color: var(--t1);
  font-family: 'Crimson Pro', serif;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s var(--ease-out);
}
.search::placeholder { color: var(--t3); }
.search:focus { border-color: var(--accent); }

.empty {
  text-align: center;
  color: var(--t3);
  font-style: italic;
  padding: 3rem 0;
}
</style>
