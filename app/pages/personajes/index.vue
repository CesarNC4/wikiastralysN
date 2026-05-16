<template>
  <div class="page">
    <div class="page-header">
      <p class="eyebrow">Archivo del mundo</p>
      <h1 class="page-title">Personajes</h1>
      <div class="divider">
        <div class="line"></div>
        <div class="gem"></div>
        <div class="line right"></div>
      </div>
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
          <span class="role">{{ p.ocupacion || '—' }}</span>
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

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 1.25rem;
}
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.card {
  background: #16120c;
  border: 1px solid #2a2010;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}
.card:hover { border-color: #c8a84b; transform: translateY(-2px); }

.card-img {
  width: 100%;
  aspect-ratio: 3/4;
  background: linear-gradient(160deg, #1e1810 0%, #0e0c08 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.card-img img { width: 100%; height: 100%; object-fit: cover; }

.initial {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: #2a2010;
  font-weight: 700;
}

.card-info {
  padding: 10px 12px;
  background: #12100a;
  border-top: 1px solid #1e1810;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  color: #e8dfc8;
  letter-spacing: 0.08em;
}
.surname { color: #a89070; }
.titulo {
  font-size: 11px;
  color: #c8a84b;
  font-style: italic;
  opacity: 0.8;
}
.role { font-size: 11px; color: #5a4a30; font-style: italic; }

.empty {
  text-align: center;
  color: #4a3a20;
  font-style: italic;
  padding: 3rem 0;
}
</style>