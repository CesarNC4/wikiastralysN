<template>
  <div>
    <div class="list-header">
      <div>
        <p class="eyebrow">Admin</p>
        <h1 class="list-title">{{ title }}</h1>
      </div>
      <NuxtLink :to="`${basePath}/nuevo`" class="btn-new">+ Nuevo</NuxtLink>
    </div>

    <div class="list-toolbar">
      <input
        v-model="busqueda"
        class="search"
        :placeholder="`Buscar ${title.toLowerCase()}...`"
        type="text"
      />
      <span class="count">{{ total > 0 ? `${total} registros` : `${filtered.length} registros` }}</span>
    </div>

    <div v-if="loading" class="loading-msg">Cargando...</div>
    <p v-else-if="!filtered.length" class="empty">No hay resultados.</p>

    <div v-else class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key"
              :class="col.type !== 'img' ? 'th-sortable' : ''"
              @click="col.type !== 'img' && toggleSort(col.key)">
              {{ col.label }}
              <span v-if="col.type !== 'img'" class="sort-icon">
                {{ sortKey === col.key ? (sortDir === 1 ? '↑' : '↓') : '↕' }}
              </span>
            </th>
            <th class="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in sorted" :key="row.id">
            <td v-for="col in columns" :key="col.key">
              <template v-if="col.type === 'img'">
                <img v-if="row[col.key]" :src="row[col.key]" class="thumb" />
                <span v-else class="thumb-ph">—</span>
              </template>
              <span v-else-if="col.type === 'badge'" class="badge">{{ row[col.key] || '—' }}</span>
              <span v-else-if="col.type === 'bool'">
                <span :class="row[col.key] ? 'dot green' : 'dot red'"></span>
              </span>
              <span v-else>{{ row[col.key] || '—' }}</span>
            </td>
            <td class="td-actions">
              <NuxtLink :to="`${basePath}/${row.id}`" class="btn-edit">Editar</NuxtLink>
              <button v-if="onDuplicate" class="btn-dup" @click="onDuplicate(row)">Dup.</button>
              <button class="btn-del" @click="$emit('delete', row)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="pagination">
      <button class="pag-btn" :disabled="page <= 1" @click="onPageChange(page - 1)">←</button>
      <template v-for="n in paginationRange" :key="n">
        <span v-if="n === '...'" class="pag-ellipsis">…</span>
        <button v-else class="pag-btn" :class="{ active: n === page }" @click="onPageChange(n)">{{ n }}</button>
      </template>
      <button class="pag-btn" :disabled="page >= totalPages" @click="onPageChange(page + 1)">→</button>
    </div>

    <p v-if="deleteError" class="delete-error">{{ deleteError }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title:        { type: String, required: true },
  basePath:     { type: String, required: true },
  items:        { type: Array,  default: () => [] },
  columns:      { type: Array,  required: true },
  loading:      { type: Boolean, default: false },
  deleteError:  { type: String, default: '' },
  searchKeys:   { type: Array, default: () => ['nombre'] },
  page:         { type: Number, default: 1 },
  totalPages:   { type: Number, default: 1 },
  total:        { type: Number, default: 0 },
  onPageChange: { type: Function, default: null },
  onDuplicate:  { type: Function, default: null },
})

defineEmits(['delete'])

const busqueda = ref('')
const sortKey  = ref('')
const sortDir  = ref(1)

function toggleSort(key) {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
}

const filtered = computed(() => {
  if (!busqueda.value.trim()) return props.items
  const q = busqueda.value.toLowerCase()
  return props.items.filter(row =>
    props.searchKeys.some(k => row[k]?.toString().toLowerCase().includes(q))
  )
})

const sorted = computed(() => {
  if (!sortKey.value) return filtered.value
  return [...filtered.value].sort((a, b) => {
    const av = a[sortKey.value] ?? ''
    const bv = b[sortKey.value] ?? ''
    return String(av).localeCompare(String(bv), undefined, { numeric: true }) * sortDir.value
  })
})

const paginationRange = computed(() => {
  const { page, totalPages } = props
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const range = new Set([1, totalPages, page, page - 1, page + 1, page - 2, page + 2])
  const sorted = [...range].filter(n => n >= 1 && n <= totalPages).sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
})
</script>

<style scoped>
.list-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 12px;
  flex-wrap: wrap;
}
.eyebrow {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.3em;
  color: #c8a84b;
  opacity: 0.7;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.list-title {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f0e4c0;
  letter-spacing: 0.06em;
}
.btn-new {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  padding: 10px 18px;
  background: #c8a84b;
  color: #0e0b07;
  border-radius: 2px;
  text-decoration: none;
  transition: background 0.2s;
  white-space: nowrap;
  align-self: center;
}
.btn-new:hover { background: #e0c060; }
.list-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}
.search {
  flex: 1;
  background: #12100a;
  border: 1px solid #2a2010;
  border-radius: 2px;
  padding: 8px 14px;
  color: #e8dfc8;
  font-family: 'Crimson Pro', serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.search::placeholder { color: #3a2a10; }
.search:focus { border-color: #c8a84b; }
.count {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  color: #4a3a20;
  letter-spacing: 0.1em;
  white-space: nowrap;
}
.loading-msg {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #4a3a20;
  padding: 2rem 0;
  text-align: center;
}
.empty {
  text-align: center;
  color: #4a3a20;
  font-style: italic;
  padding: 3rem 0;
}
.table-wrap { overflow-x: auto; }
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Crimson Pro', serif;
  font-size: 0.95rem;
}
.admin-table th {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #5a4a30;
  padding: 10px 14px;
  border-bottom: 1px solid #2a2010;
  text-align: left;
  white-space: nowrap;
}
.th-actions { width: 160px; }
.th-sortable { cursor: pointer; user-select: none; }
.th-sortable:hover { color: #a89070; }
.sort-icon { margin-left: 4px; opacity: 0.4; font-size: 8px; }
.admin-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #1a1408;
  color: #c8b890;
  vertical-align: middle;
}
.admin-table tr:hover td { background: #16120c; }
.badge {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.12em;
  border: 1px solid #2a2010;
  padding: 2px 8px;
  color: #7a6a50;
  border-radius: 2px;
}
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
.dot.green { background: #4a8a40; }
.dot.red   { background: #6a2020; }
.td-actions { white-space: nowrap; }
.btn-edit {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  padding: 5px 12px;
  border: 1px solid #2a2010;
  color: #7a6a50;
  text-decoration: none;
  border-radius: 2px;
  margin-right: 6px;
  transition: border-color 0.2s, color 0.2s;
}
.btn-edit:hover { border-color: #c8a84b; color: #c8a84b; }
.thumb {
  width: 32px;
  height: 32px;
  border-radius: 2px;
  object-fit: cover;
  object-position: top;
  border: 1px solid #2a2010;
  vertical-align: middle;
}
.thumb-ph { color: #3a2a10; }
.btn-dup {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  padding: 5px 10px;
  border: 1px solid #2a2010;
  background: transparent;
  color: #5a4a30;
  border-radius: 2px;
  cursor: pointer;
  margin-right: 6px;
  transition: border-color 0.2s, color 0.2s;
}
.btn-dup:hover { border-color: #a89070; color: #a89070; }
.btn-del {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  padding: 5px 12px;
  border: 1px solid #3a1a10;
  background: transparent;
  color: #6a3030;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-del:hover { background: #e24b4a; border-color: #e24b4a; color: #fff; }
.delete-error {
  margin-top: 10px;
  color: #e24b4a;
  font-size: 0.9rem;
  font-style: italic;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}
.pag-btn {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  background: transparent;
  border: 1px solid #2a2010;
  color: #5a4a30;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.pag-btn:hover:not(:disabled) { border-color: #c8a84b; color: #c8a84b; }
.pag-btn.active { background: #c8a84b; border-color: #c8a84b; color: #0e0b07; cursor: default; }
.pag-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.pag-ellipsis {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  color: #3a2a10;
  padding: 0 4px;
}
</style>