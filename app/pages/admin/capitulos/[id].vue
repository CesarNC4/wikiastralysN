<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/capitulos" class="btn-back">← Capítulos</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Capítulo' : 'Nuevo Capítulo' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/capitulos/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/capitulos', 'titulo')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <div>
        <!-- Info principal -->
        <div class="section">
          <div class="sec-title">Identificación</div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Número *</label>
              <input class="f-inp" v-model="f.numero" placeholder="Ej: 1, 2A, Prólogo..." />
            </div>
            <div class="f-group">
              <label class="f-lbl">Libro</label>
              <select class="f-inp" v-model="f.libro">
                <option>Astralys</option>
                <option>Ishkoria</option>
                <option>Wonderland</option>
              </select>
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Título *</label>
            <input class="f-inp" v-model="f.titulo" />
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Tipo</label>
              <select class="f-inp" v-model="f.tipo">
                <option>Principal</option><option>Secundario</option><option>Flashback</option>
                <option>Prólogo</option><option>Epílogo</option><option>Interludio</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Tipo Temporal</label>
              <select class="f-inp" v-model="f.tipo_temporal">
                <option>Presente</option><option>Pasado</option><option>Futuro</option><option>Atemporal</option>
              </select>
            </div>
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Marco Narrativo</label>
              <input class="f-inp" v-model="f.marco_narrativo" placeholder="Ej: Batalla de Ishkoria" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Narrador</label>
              <input class="f-inp" v-model="f.narrador" placeholder="Ej: Omnisciente, Kael..." />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Fecha Lore</label>
            <input class="f-inp" v-model="f.fecha_lore" placeholder="Ej: Año 340, Día del Solsticio..." />
          </div>
          <div class="f-group">
            <label class="f-lbl">URL Discord</label>
            <input class="f-inp" v-model="f.discord_url" placeholder="https://discord.com/..." />
          </div>
        </div>

        <div class="section">
          <div class="sec-title">Sinopsis</div>
          <div class="f-group">
            <label class="f-lbl">Descripción (pública)</label>
            <textarea class="f-area" v-model="f.descripcion" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Notas privadas (solo admin)</label>
            <textarea class="f-area" v-model="f.notas_privadas" rows="4"></textarea>
          </div>
        </div>

        <div class="section" v-if="isEdit">
          <div class="sec-title">Paralelo a Capítulo</div>
          <div class="autocomplete-wrap" style="width:100%">
            <input v-model="paralBusqueda" placeholder="Buscar capítulo paralelo..." class="rel-input"
              @input="filtrarParalelos" autocomplete="off" />
            <div v-if="paralelosFiltrados.length" class="autocomplete-list">
              <div v-for="c in paralelosFiltrados" :key="c.id" class="autocomplete-item"
                @mousedown.prevent="seleccionarParalelo(c)">
                Cap. {{ c.numero }} — {{ c.titulo }}
              </div>
            </div>
          </div>
          <p v-if="f.paralelo_a_capitulo_id" class="hint">
            Paralelo a: {{ paraleloNombre }}
            <button style="font-size:0.75rem;margin-left:8px;background:transparent;border:none;color:#e24b4a;cursor:pointer"
              @click="f.paralelo_a_capitulo_id = null; paralBusqueda = ''">✕ Quitar</button>
          </p>
        </div>

        <!-- Actos -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Actos</div>
          <div v-for="a in actos" :key="a.id" class="rel-row">
            <span class="rel-tag">Acto {{ a.numero_orden }}</span>
            <span class="rel-name">{{ a.nombre }}</span>
            <span class="rel-tag" :class="a.estado === 'Completado' ? 'tag-green' : ''">{{ a.estado }}</span>
            <NuxtLink :to="`/admin/actos/${a.id}`" class="btn-edit" style="font-size:9px;padding:4px 10px">Editar</NuxtLink>
            <button class="rel-remove" @click="quitarActo(a)">✕</button>
          </div>
          <div class="rel-add">
            <input v-model="nuevoActo.nombre" placeholder="Nombre del acto" class="rel-input" style="flex:1" />
            <input v-model.number="nuevoActo.numero_orden" type="number" placeholder="Orden" class="rel-input" style="width:60px" />
            <button class="btn-rel-add" @click="agregarActo">+ Acto</button>
          </div>
        </div>

        <!-- Personajes del capítulo -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Personajes Presentes</div>
          <div v-for="cp in capPersonajes" :key="cp.id" class="rel-row">
            <span class="rel-name">{{ cp.pjNombre }}</span>
            <span class="rel-tag">{{ cp.rol_en_capitulo || '—' }}</span>
            <button class="rel-remove" @click="quitarCapPersonaje(cp)">✕</button>
          </div>
          <div class="rel-add">
            <div class="autocomplete-wrap">
              <input v-model="pjBusqueda" placeholder="Buscar personaje..." class="rel-input"
                @input="filtrarPjs" autocomplete="off" />
              <div v-if="pjsFiltrados.length" class="autocomplete-list">
                <div v-for="p in pjsFiltrados" :key="p.id" class="autocomplete-item"
                  @mousedown.prevent="seleccionarPj(p)">{{ p.nombre }}</div>
              </div>
            </div>
            <input v-model="nuevaCapPj.rol_en_capitulo" placeholder="Rol (opcional)" class="rel-input" style="width:130px" />
            <button class="btn-rel-add" :disabled="!nuevaCapPj.personaje_id" @click="agregarCapPersonaje">+ Agregar</button>
          </div>
        </div>

        <!-- Canciones del capítulo -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Canciones del Capítulo</div>
          <div v-for="cc in capCanciones" :key="cc.id" class="rel-row">
            <span class="rel-name">{{ cc.cancionTitulo }}</span>
            <button class="rel-remove" @click="quitarCapCancion(cc)">✕</button>
          </div>
          <div class="rel-add">
            <div class="autocomplete-wrap">
              <input v-model="cancionBusqueda" placeholder="Buscar canción..." class="rel-input"
                @input="filtrarCanciones" autocomplete="off" />
              <div v-if="cancionesFiltradas.length" class="autocomplete-list">
                <div v-for="c in cancionesFiltradas" :key="c.id" class="autocomplete-item"
                  @mousedown.prevent="seleccionarCancion(c)">{{ c.titulo }}</div>
              </div>
            </div>
            <button class="btn-rel-add" :disabled="!nuevaCapCancion.cancion_id" @click="agregarCapCancion">+ Agregar</button>
          </div>
        </div>

        <p v-if="!isEdit" class="hint">💡 Guarda el capítulo primero para gestionar actos, personajes y canciones.</p>
      </div>

      <div>
        <div class="section">
          <div class="sec-title">Visibilidad</div>
          <label class="check-label"><input type="checkbox" v-model="f.visible" /> Visible al público</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const supabase = useSupabaseClient()

const f = ref({
  numero: '', libro: 'Astralys', titulo: '', tipo: 'Principal',
  tipo_temporal: 'Presente', marco_narrativo: '', narrador: '',
  paralelo_a_capitulo_id: null, notas_privadas: '', descripcion: '',
  discord_url: '', fecha_lore: '', visible: true,
})

const { id, isEdit, loading, saving, error, cargar, guardar } = useAdminForm('capitulos', f)

const todosPersonajes = ref([])
const todasCanciones  = ref([])
const todosCapitulos  = ref([])
const actos          = ref([])
const capPersonajes  = ref([])
const capCanciones   = ref([])

onMounted(async () => {
  await cargar()
  const [{ data: pjs }, { data: cans }, { data: caps }] = await Promise.all([
    supabase.from('personajes').select('id, nombre').order('nombre'),
    supabase.from('canciones').select('id, titulo').order('titulo'),
    supabase.from('capitulos').select('id, numero, titulo').order('numero'),
  ])
  todosPersonajes.value = pjs ?? []
  todasCanciones.value  = cans ?? []
  todosCapitulos.value  = caps ?? []
  if (isEdit.value) await cargarSubtablas()
})

async function cargarSubtablas() {
  const [{ data: a }, { data: cp }, { data: cc }] = await Promise.all([
    supabase.from('actos').select('id, nombre, numero_orden, estado').eq('capitulo_id', id.value).order('numero_orden'),
    supabase.from('capitulo_personaje').select('id, rol_en_capitulo, personaje_id, personajes(nombre)').eq('capitulo_id', id.value),
    supabase.from('capitulo_cancion').select('id, cancion_id, canciones(titulo)').eq('capitulo_id', id.value),
  ])
  actos.value        = a ?? []
  capPersonajes.value = (cp ?? []).map(x => ({ ...x, pjNombre: x.personajes?.nombre }))
  capCanciones.value  = (cc ?? []).map(x => ({ ...x, cancionTitulo: x.canciones?.titulo }))
}

// ── Paralelo ──
const paralBusqueda    = ref('')
const paralelosFiltrados = ref([])
const paraleloNombre   = computed(() => {
  if (!f.value.paralelo_a_capitulo_id) return ''
  const c = todosCapitulos.value.find(x => x.id === f.value.paralelo_a_capitulo_id)
  return c ? `Cap. ${c.numero} — ${c.titulo}` : ''
})
function filtrarParalelos() {
  const q = paralBusqueda.value.toLowerCase()
  paralelosFiltrados.value = todosCapitulos.value
    .filter(c => c.id !== id.value && (c.titulo.toLowerCase().includes(q) || c.numero.toString().includes(q)))
    .slice(0, 8)
}
function seleccionarParalelo(c) {
  f.value.paralelo_a_capitulo_id = c.id
  paralBusqueda.value = `Cap. ${c.numero} — ${c.titulo}`
  paralelosFiltrados.value = []
}

// ── Actos ──
const nuevoActo = ref({ nombre: '', numero_orden: 1 })
async function agregarActo() {
  if (!nuevoActo.value.nombre.trim()) return
  await supabase.from('actos').insert({ capitulo_id: id.value, ...nuevoActo.value })
  nuevoActo.value = { nombre: '', numero_orden: actos.value.length + 2 }
  await cargarSubtablas()
}
async function quitarActo(a) {
  if (!confirm(`¿Eliminar acto "${a.nombre}"?`)) return
  await supabase.from('actos').delete().eq('id', a.id)
  await cargarSubtablas()
}

// ── Personajes ──
const pjBusqueda   = ref('')
const pjsFiltrados = ref([])
const nuevaCapPj   = ref({ personaje_id: null, rol_en_capitulo: '' })
function filtrarPjs() {
  const q = pjBusqueda.value.toLowerCase()
  pjsFiltrados.value = todosPersonajes.value.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarPj(p) { nuevaCapPj.value.personaje_id = p.id; pjBusqueda.value = p.nombre; pjsFiltrados.value = [] }
async function agregarCapPersonaje() {
  if (!nuevaCapPj.value.personaje_id) return
  await supabase.from('capitulo_personaje').insert({ capitulo_id: id.value, ...nuevaCapPj.value })
  nuevaCapPj.value = { personaje_id: null, rol_en_capitulo: '' }; pjBusqueda.value = ''
  await cargarSubtablas()
}
async function quitarCapPersonaje(cp) {
  await supabase.from('capitulo_personaje').delete().eq('id', cp.id)
  await cargarSubtablas()
}

// ── Canciones ──
const cancionBusqueda  = ref('')
const cancionesFiltradas = ref([])
const nuevaCapCancion  = ref({ cancion_id: null })
function filtrarCanciones() {
  const q = cancionBusqueda.value.toLowerCase()
  cancionesFiltradas.value = todasCanciones.value.filter(c => c.titulo.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarCancion(c) { nuevaCapCancion.value.cancion_id = c.id; cancionBusqueda.value = c.titulo; cancionesFiltradas.value = [] }
async function agregarCapCancion() {
  if (!nuevaCapCancion.value.cancion_id) return
  await supabase.from('capitulo_cancion').insert({ capitulo_id: id.value, ...nuevaCapCancion.value })
  nuevaCapCancion.value = { cancion_id: null }; cancionBusqueda.value = ''
  await cargarSubtablas()
}
async function quitarCapCancion(cc) {
  await supabase.from('capitulo_cancion').delete().eq('id', cc.id)
  await cargarSubtablas()
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
<style scoped>
.btn-edit {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border: 1px solid #2a2010;
  color: #7a6a50;
  text-decoration: none;
  border-radius: 2px;
  transition: border-color 0.2s, color 0.2s;
}
.btn-edit:hover { border-color: #c8a84b; color: #c8a84b; }
.tag-green { border-color: #4a8a40; color: #4a8a40; }
</style>
