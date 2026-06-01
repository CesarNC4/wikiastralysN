<template>
  <div class="page">
    <div class="page-header">
      <span class="page-eyebrow">Archivo del mundo</span>
      <h1 class="page-title">Personajes</h1>
    </div>

    <div class="filters">
      <input
        v-model="busqueda"
        class="search"
        placeholder="Buscar personaje..."
        type="text"
      />
    </div>

    <div class="grid">
      <NuxtLink
        v-for="p in personajesFiltrados"
        :key="p.id"
        :to="`/personajes/${p.id}`"
        class="card"
      >
        <div class="card-img">
          <img v-if="p.imagen_url" :src="p.imagen_url" :alt="p.nombre" />
          <span v-else class="initial">{{ p.nombre[0] }}</span>
        </div>
        <div class="card-info">
          <span class="name">{{ p.nombre }} <span v-if="p.surname" class="surname">{{ p.surname }}</span></span>
          <span v-if="p.titulo" class="titulo">{{ p.titulo }}</span>
          <span class="role">{{ p.ocupacion || '' }}</span>
        </div>
      </NuxtLink>
    </div>

    <p v-if="personajesFiltrados.length === 0" class="empty">
      No se encontraron personajes.
    </p>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const busqueda = ref('')

const { data: personajes } = await useAsyncData('personajes', async () => {
  const { data } = await supabase
    .from('personajes')
    .select('id, nombre, surname, titulo, ocupacion, imagen_url')
    .eq('visible', true)
    .order('nombre')
  return data ?? []
})

const personajesFiltrados = computed(() => {
  if (!busqueda.value) return personajes.value
  const q = busqueda.value.toLowerCase()
  return personajes.value.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.surname?.toLowerCase().includes(q) ||
    p.ocupacion?.toLowerCase().includes(q)
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.card {
  background: var(--s1);
  border: 1px solid var(--bd);
  border-radius: 2px;
  overflow: hidden;
  transition: border-color 220ms var(--ease-out), transform 220ms var(--ease-out), box-shadow 260ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .card:hover {
    border-color: var(--accent);
    transform: translateY(-3px);
    box-shadow: 0 0 0 1px var(--accent), 0 12px 40px rgba(0,0,0,0.5), 0 0 60px var(--accent-dim);
  }
  .card:hover .card-img img { transform: scale(1.04); }
  .card:active { transform: translateY(-1px) scale(0.99); }
}

.card-img {
  width: 100%;
  aspect-ratio: 3/4;
  background: var(--s2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.card-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 400ms var(--ease-out);
}

.initial {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 300;
  color: var(--bd-strong);
}

.card-info {
  padding: 10px 12px;
  background: var(--s1);
  border-top: 1px solid var(--bd);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  color: var(--t1);
  letter-spacing: 0.06em;
  display: block;
}
.surname { color: var(--t2); }

.titulo {
  font-family: 'Crimson Pro', serif;
  font-size: 12px;
  color: var(--accent);
  font-style: italic;
}

.role {
  font-family: 'Crimson Pro', serif;
  font-size: 12px;
  color: var(--t3);
  font-style: italic;
}

.empty {
  text-align: center;
  color: var(--t3);
  font-style: italic;
  padding: 3rem 0;
}
</style>
