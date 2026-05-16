<template>
  <WikiList titulo="Sistema Monetario" :items="monedas" :campos-busqueda="['nombre', 'denominacion']">
    <template #default="{ items }">
      <div class="grid">
        <div v-for="m in items" :key="m.id" class="card">
          <div class="card-img">
            <img v-if="m.imagen_url" :src="m.imagen_url" :alt="m.nombre" />
            <span v-else class="initial">₢</span>
          </div>
          <div class="card-info">
            <span class="nombre">{{ m.nombre }}</span>
            <span class="denom" v-if="m.denominacion">{{ m.denominacion }}</span>
            <p class="desc" v-if="m.descripcion">{{ m.descripcion }}</p>
            <span class="valor" v-if="m.valor_relativo">{{ m.valor_relativo }}</span>
          </div>
        </div>
      </div>
    </template>
  </WikiList>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: monedas } = await useAsyncData('economia', async () => {
  const { data } = await supabase
    .from('sistema_monetario')
    .select('*')
    .eq('visible', true)
    .order('id')
  return data ?? []
})
</script>

<style scoped>
.grid { display: flex; flex-direction: column; gap: 12px; }

.card {
  background: #16120c;
  border: 1px solid #2a2010;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: border-color 0.2s;
}
.card:hover { border-color: #c8a84b; }

.card-img {
  width: 56px;
  height: 56px;
  background: linear-gradient(160deg, #1e1810, #0e0c08);
  border: 1px solid #2a2010;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  font-size: 1.5rem;
  color: #2a2010;
}
.card-img img { width: 100%; height: 100%; object-fit: cover; }

.card-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.nombre { font-family: 'Cinzel', serif; font-size: 13px; color: #e8dfc8; letter-spacing: 0.08em; }
.denom { font-family: 'Cinzel', serif; font-size: 10px; color: #c8a84b; letter-spacing: 0.15em; opacity: 0.8; }
.desc { font-size: 0.95rem; color: #7a6a50; line-height: 1.6; margin-top: 4px; }
.valor { font-size: 11px; color: #4a3a20; font-style: italic; margin-top: 4px; border-top: 1px solid #1e1810; padding-top: 6px; }
</style>