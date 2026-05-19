<template>
  <div>
    <div class="list-header">
      <div>
        <p class="eyebrow">Admin</p>
        <h1 class="list-title">Notas Privadas</h1>
      </div>
      <NuxtLink to="/admin/notas/nueva" class="btn-new">+ Nueva</NuxtLink>
    </div>

    <div class="list-toolbar">
      <input v-model="busqueda" class="search" placeholder="Buscar por entidad o contenido..." type="text" />
      <select v-model="filtroTipo" class="search" style="flex:0 0 160px">
        <option value="">Todos los tipos</option>
        <option v-for="t in tiposUnicos" :key="t" :value="t">{{ t }}</option>
      </select>
      <span class="count">{{ filtradas.length }} notas</span>
    </div>

    <div v-if="loading" class="loading-msg">Cargando...</div>
    <p v-else-if="!filtradas.length" class="empty">No hay notas.</p>

    <div v-else class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Tipo Entidad</th>
            <th>ID Entidad</th>
            <th>Contenido (preview)</th>
            <th>Actualizado</th>
            <th class="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nota in filtradas" :key="nota.id">
            <td><span class="badge">{{ nota.entidad_tipo }}</span></td>
            <td>{{ nota.entidad_id }}</td>
            <td class="preview-cell">{{ nota.contenido?.slice(0, 80) }}{{ nota.contenido?.length > 80 ? '…' : '' }}</td>
            <td style="white-space:nowrap;font-size:0.85rem">{{ formatDate(nota.actualizado_en) }}</td>
            <td class="td-actions">
              <NuxtLink :to="`/admin/notas/${nota.id}`" class="btn-edit">Editar</NuxtLink>
              <button class="btn-del" @click="eliminar(nota)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="deleteError" class="delete-error">{{ deleteError }}</p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList(
  'nota_privada', 'id, entidad_tipo, entidad_id, contenido, actualizado_en', 'actualizado_en'
)

const busqueda   = ref('')
const filtroTipo = ref('')

const tiposUnicos = computed(() => [...new Set(items.value.map(n => n.entidad_tipo))].sort())

const filtradas = computed(() => {
  let res = items.value
  if (filtroTipo.value) res = res.filter(n => n.entidad_tipo === filtroTipo.value)
  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    res = res.filter(n =>
      n.contenido?.toLowerCase().includes(q) ||
      n.entidad_tipo?.toLowerCase().includes(q) ||
      String(n.entidad_id).includes(q)
    )
  }
  return res
})

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped>
.list-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; gap:12px; flex-wrap:wrap; }
.eyebrow { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.3em; color:#c8a84b; opacity:0.7; text-transform:uppercase; margin-bottom:4px; }
.list-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:700; color:#f0e4c0; letter-spacing:0.06em; }
.btn-new { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; padding:10px 18px; background:#c8a84b; color:#0e0b07; border-radius:2px; text-decoration:none; transition:background 0.2s; white-space:nowrap; align-self:center; }
.btn-new:hover { background:#e0c060; }
.list-toolbar { display:flex; align-items:center; gap:12px; margin-bottom:1rem; flex-wrap:wrap; }
.search { flex:1; min-width:140px; background:#12100a; border:1px solid #2a2010; border-radius:2px; padding:8px 14px; color:#e8dfc8; font-family:'Crimson Pro',serif; font-size:0.95rem; outline:none; transition:border-color 0.2s; }
.search:focus { border-color:#c8a84b; }
.count { font-family:'Cinzel',serif; font-size:9px; color:#4a3a20; letter-spacing:0.1em; white-space:nowrap; }
.loading-msg { font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.2em; color:#4a3a20; padding:2rem 0; text-align:center; }
.empty { text-align:center; color:#4a3a20; font-style:italic; padding:3rem 0; }
.table-wrap { overflow-x:auto; }
.admin-table { width:100%; border-collapse:collapse; font-family:'Crimson Pro',serif; font-size:0.95rem; }
.admin-table th { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; text-transform:uppercase; color:#5a4a30; padding:10px 14px; border-bottom:1px solid #2a2010; text-align:left; white-space:nowrap; }
.th-actions { width:130px; }
.admin-table td { padding:10px 14px; border-bottom:1px solid #1a1408; color:#c8b890; vertical-align:middle; }
.admin-table tr:hover td { background:#16120c; }
.badge { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.12em; border:1px solid #2a2010; padding:2px 8px; color:#7a6a50; border-radius:2px; }
.preview-cell { max-width:320px; color:#7a6a50; font-style:italic; }
.td-actions { white-space:nowrap; }
.btn-edit { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.1em; padding:5px 12px; border:1px solid #2a2010; color:#7a6a50; text-decoration:none; border-radius:2px; margin-right:6px; transition:border-color 0.2s, color 0.2s; }
.btn-edit:hover { border-color:#c8a84b; color:#c8a84b; }
.btn-del { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.1em; padding:5px 12px; border:1px solid #3a1a10; background:transparent; color:#6a3030; border-radius:2px; cursor:pointer; transition:background 0.2s, color 0.2s; }
.btn-del:hover { background:#e24b4a; border-color:#e24b4a; color:#fff; }
.delete-error { margin-top:10px; color:#e24b4a; font-size:0.9rem; font-style:italic; }
</style>
