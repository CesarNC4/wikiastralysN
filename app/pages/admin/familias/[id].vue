<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/familias" class="btn-back">← Familias</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Familia' : 'Nueva Familia' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/familias')">
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <!-- Columna principal -->
      <div>
        <div class="section">
          <div class="sec-title">Identidad</div>
          <div class="row2">
            <Field label="Nombre *"><input v-model="f.nombre" /></Field>
            <Field label="Apellido"><input v-model="f.apellido" /></Field>
          </div>
          <Field label="Subtítulo"><input v-model="f.subtitulo" placeholder="Ej: La Casa del Fuego Eterno" /></Field>
          <Field label="Origen">
            <select v-model="f.origen">
              <option>Otro</option><option>Noble</option><option>Real</option>
              <option>Mercantil</option><option>Militar</option><option>Mágica</option>
              <option>Demoníaca</option><option>Divina</option><option>Plebeya</option>
            </select>
          </Field>
          <Field label="Descripción"><textarea v-model="f.descripcion" rows="4" /></Field>
        </div>

        <div class="section">
          <div class="sec-title">Poder e Influencia</div>
          <Field label="Poder Económico"><textarea v-model="f.poder_economico" rows="3" /></Field>
          <Field label="Poder Político"><textarea v-model="f.poder_politico" rows="3" /></Field>
          <Field label="Poder Militar"><textarea v-model="f.poder_militar" rows="3" /></Field>
        </div>

        <div class="section">
          <div class="sec-title">Historia y Estructura</div>
          <Field label="Historia"><textarea v-model="f.historia" rows="6" /></Field>
          <Field label="Núcleo Familiar"><textarea v-model="f.estructura_nucleo" rows="3" /></Field>
          <Field label="Círculo Extendido"><textarea v-model="f.circulo_extendido" rows="3" /></Field>
          <Field label="Liderazgo"><textarea v-model="f.liderazgo" rows="3" /></Field>
        </div>

        <!-- Facciones internas -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Facciones Internas</div>
          <div v-for="fac in facciones" :key="fac.id" class="rel-row">
            <span class="rel-color" :style="`background:${fac.color || '#2a2010'}`"></span>
            <span class="rel-name">{{ fac.nombre }}</span>
            <button class="rel-remove" @click="quitarFaccion(fac)">✕</button>
          </div>
          <div class="rel-add">
            <input v-model="nuevaFaccion.nombre" placeholder="Nombre de la facción" class="rel-input" style="flex:1" />
            <input v-model="nuevaFaccion.color" type="color" class="color-pick" title="Color" />
            <button class="btn-rel-add" @click="agregarFaccion">+ Facción</button>
          </div>
        </div>

        <!-- Jerarquía -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Jerarquía</div>
          <div v-for="j in jerarquia" :key="j.id" class="rel-row">
            <span class="rel-tag">{{ j.titulo_nobiliario || '—' }}</span>
            <span class="rel-name">{{ j.pjNombre }}</span>
            <span class="rel-tag" v-if="j.faccionNombre" style="color:#c8a84b">{{ j.faccionNombre }}</span>
            <button class="rel-remove" @click="quitarJerarquia(j)">✕</button>
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
            <input v-model="nuevaJerarquia.titulo_nobiliario" placeholder="Título nobiliario" class="rel-input" style="width:130px" />
            <input v-model="nuevaJerarquia.titulo_familia" placeholder="Título familia" class="rel-input" style="width:120px" />
            <select v-model="nuevaJerarquia.faccion_id" class="rel-select">
              <option :value="null">Sin facción</option>
              <option v-for="fac in facciones" :key="fac.id" :value="fac.id">{{ fac.nombre }}</option>
            </select>
            <button class="btn-rel-add" :disabled="!nuevaJerarquia.personaje_id" @click="agregarJerarquia">+ Agregar</button>
          </div>
        </div>

        <!-- Árbol familiar -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Árbol Familiar</div>
          <p class="hint">Cada entrada representa un nodo del árbol. Vincula padre/madre por su ID de nodo (no de personaje).</p>

          <div v-for="nodo in arbol" :key="nodo.id" class="arbol-nodo">
            <div class="arbol-nodo-header">
              <span class="rel-tag">Gen. {{ nodo.generacion }}</span>
              <span class="rel-name">{{ nodo.nombre }}</span>
              <span class="rel-tag" v-if="nodo.pjNombre" style="color:#c8a84b">🔗 {{ nodo.pjNombre }}</span>
              <span class="rel-tag" :class="nodo.estado === 'Activo' ? 'tag-green' : ''">{{ nodo.estado }}</span>
              <button class="rel-remove" @click="quitarNodoArbol(nodo)">✕</button>
            </div>
            <div class="arbol-nodo-detail">
              <span v-if="nodo.padre_id" class="arbol-ref">↑ Padre: {{ nombreNodo(nodo.padre_id) }}</span>
              <span v-if="nodo.madre_id" class="arbol-ref">↑ Madre: {{ nombreNodo(nodo.madre_id) }}</span>
            </div>
          </div>

          <!-- Formulario nuevo nodo -->
          <div class="arbol-form">
            <div class="row2">
              <Field label="Nombre en el árbol">
                <input v-model="nuevoNodo.nombre" placeholder="Nombre (si no es personaje)" />
              </Field>
              <Field label="Vincular personaje">
                <div class="autocomplete-wrap">
                  <input v-model="nodoPjBusqueda" placeholder="Buscar personaje..." class="rel-input"
                    @input="filtrarNodoPjs" autocomplete="off" />
                  <div v-if="nodoPjsFiltrados.length" class="autocomplete-list">
                    <div v-for="p in nodoPjsFiltrados" :key="p.id" class="autocomplete-item"
                      @mousedown.prevent="seleccionarNodoPj(p)">{{ p.nombre }}</div>
                  </div>
                </div>
              </Field>
            </div>
            <div class="row3">
              <Field label="Generación"><input type="number" v-model.number="nuevoNodo.generacion" /></Field>
              <Field label="ID Padre (nodo)">
                <select v-model="nuevoNodo.padre_id">
                  <option :value="null">— Ninguno —</option>
                  <option v-for="n in arbol" :key="n.id" :value="n.id">{{ n.nombre }} (Gen {{ n.generacion }})</option>
                </select>
              </Field>
              <Field label="ID Madre (nodo)">
                <select v-model="nuevoNodo.madre_id">
                  <option :value="null">— Ninguno —</option>
                  <option v-for="n in arbol" :key="n.id" :value="n.id">{{ n.nombre }} (Gen {{ n.generacion }})</option>
                </select>
              </Field>
            </div>
            <div class="row2">
              <Field label="Estado">
                <select v-model="nuevoNodo.estado">
                  <option>Activo</option><option>Fallecido</option><option>Desaparecido</option><option>Desconocido</option>
                </select>
              </Field>
              <Field label="Notas"><input v-model="nuevoNodo.notas" /></Field>
            </div>
            <div style="display:flex;gap:12px;align-items:center">
              <label class="check-label"><input type="checkbox" v-model="nuevoNodo.destacado" /> Destacado</label>
              <input v-if="nuevoNodo.destacado" v-model="nuevoNodo.motivo_destacado" placeholder="Motivo" class="rel-input" style="flex:1" />
              <button class="btn-rel-add" @click="agregarNodoArbol">+ Agregar nodo</button>
            </div>
          </div>
          <p v-if="arbolMsg" class="rel-msg" :class="arbolOk ? 'ok' : 'err'">{{ arbolMsg }}</p>
        </div>

        <p v-if="!isEdit" class="hint">💡 Guarda la familia primero para gestionar facciones, jerarquía y árbol.</p>
      </div>

      <!-- Lateral -->
      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/familias" />
            </Field>
            <Field label="Banner">
              <CloudinaryUpload v-model="f.banner_url" label="Banner" icon="🖼" folder="wikiastralys/familias/banners" />
            </Field>
        </div>
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
  nombre: '', apellido: '', subtitulo: '', origen: 'Otro',
  descripcion: '', historia: '', poder_economico: '', poder_politico: '', poder_militar: '',
  estructura_nucleo: '', circulo_extendido: '', liderazgo: '',
  imagen_url: '', banner_url: '', visible: true,
})

const { id, isEdit, loading, saving, error, cargar, guardar } = useAdminForm('familias', f)

const todosPersonajes = ref([])
const facciones  = ref([])
const jerarquia  = ref([])
const arbol      = ref([])

onMounted(async () => {
  await cargar()
  const { data } = await supabase.from('personajes').select('id, nombre').order('nombre')
  todosPersonajes.value = data ?? []
  if (isEdit.value) await cargarSubtablas()
})

async function cargarSubtablas() {
  const [{ data: fc }, { data: jr }, { data: ar }] = await Promise.all([
    supabase.from('familia_facciones').select('*').eq('familia_id', id.value),
    supabase.from('familia_jerarquia')
      .select('id, orden, titulo_nobiliario, titulo_familia, personaje_id, faccion_id, personajes(nombre), familia_facciones(nombre)')
      .eq('familia_id', id.value).order('orden'),
    supabase.from('familia_arbol')
      .select('id, nombre, generacion, estado, destacado, motivo_destacado, notas, padre_id, madre_id, personaje_id, personajes(nombre)')
      .eq('familia_id', id.value).order('generacion'),
  ])
  facciones.value = fc ?? []
  jerarquia.value = (jr ?? []).map(j => ({ ...j, pjNombre: j.personajes?.nombre, faccionNombre: j.familia_facciones?.nombre }))
  arbol.value     = (ar ?? []).map(n => ({ ...n, pjNombre: n.personajes?.nombre }))
}

// ── Facciones ──
const nuevaFaccion = ref({ nombre: '', color: '#c8a84b' })
async function agregarFaccion() {
  if (!nuevaFaccion.value.nombre.trim()) return
  await supabase.from('familia_facciones').insert({ familia_id: id.value, ...nuevaFaccion.value })
  nuevaFaccion.value = { nombre: '', color: '#c8a84b' }
  await cargarSubtablas()
}
async function quitarFaccion(fac) {
  if (!confirm(`¿Eliminar facción "${fac.nombre}"?`)) return
  await supabase.from('familia_facciones').delete().eq('id', fac.id)
  await cargarSubtablas()
}

// ── Jerarquía ──
const pjBusqueda   = ref('')
const pjsFiltrados = ref([])
const nuevaJerarquia = ref({ personaje_id: null, titulo_nobiliario: '', titulo_familia: '', faccion_id: null, orden: 0 })

function filtrarPjs() {
  const q = pjBusqueda.value.toLowerCase()
  pjsFiltrados.value = todosPersonajes.value.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarPj(p) {
  nuevaJerarquia.value.personaje_id = p.id; pjBusqueda.value = p.nombre; pjsFiltrados.value = []
}
async function agregarJerarquia() {
  if (!nuevaJerarquia.value.personaje_id) return
  await supabase.from('familia_jerarquia').insert({ familia_id: id.value, ...nuevaJerarquia.value })
  nuevaJerarquia.value = { personaje_id: null, titulo_nobiliario: '', titulo_familia: '', faccion_id: null, orden: 0 }
  pjBusqueda.value = ''
  await cargarSubtablas()
}
async function quitarJerarquia(j) {
  if (!confirm(`¿Quitar ${j.pjNombre} de la jerarquía?`)) return
  await supabase.from('familia_jerarquia').delete().eq('id', j.id)
  await cargarSubtablas()
}

// ── Árbol familiar ──
const nodoPjBusqueda  = ref('')
const nodoPjsFiltrados = ref([])
const nuevoNodo = ref({
  nombre: '', personaje_id: null, generacion: 0,
  padre_id: null, madre_id: null, estado: 'Activo',
  destacado: false, motivo_destacado: '', notas: '',
})
const arbolMsg = ref('')
const arbolOk  = ref(true)

function nombreNodo(nodoId) {
  return arbol.value.find(n => n.id === nodoId)?.nombre || `#${nodoId}`
}
function filtrarNodoPjs() {
  const q = nodoPjBusqueda.value.toLowerCase()
  nodoPjsFiltrados.value = todosPersonajes.value.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarNodoPj(p) {
  nuevoNodo.value.personaje_id = p.id
  if (!nuevoNodo.value.nombre) nuevoNodo.value.nombre = p.nombre
  nodoPjBusqueda.value = p.nombre
  nodoPjsFiltrados.value = []
}
async function agregarNodoArbol() {
  if (!nuevoNodo.value.nombre.trim()) { arbolMsg.value = 'El nombre es obligatorio.'; arbolOk.value = false; return }
  const { error } = await supabase.from('familia_arbol').insert({ familia_id: id.value, ...nuevoNodo.value })
  if (error) { arbolMsg.value = error.message; arbolOk.value = false; return }
  nuevoNodo.value = { nombre: '', personaje_id: null, generacion: 0, padre_id: null, madre_id: null, estado: 'Activo', destacado: false, motivo_destacado: '', notas: '' }
  nodoPjBusqueda.value = ''
  await cargarSubtablas()
  arbolMsg.value = 'Nodo agregado.'; arbolOk.value = true
  setTimeout(() => arbolMsg.value = '', 3000)
}
async function quitarNodoArbol(nodo) {
  if (!confirm(`¿Eliminar nodo "${nodo.nombre}"?`)) return
  await supabase.from('familia_arbol').delete().eq('id', nodo.id)
  await cargarSubtablas()
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
<style scoped>
.rel-color  { width:12px; height:12px; border-radius:2px; flex-shrink:0; }
.color-pick { width:36px; height:34px; padding:2px; border:1px solid #2a2010; background:#0e0b07; border-radius:2px; cursor:pointer; }
.tag-green  { border-color:#4a8a40; color:#4a8a40; }

.arbol-nodo { background:#0e0b07; border:1px solid #2a2010; border-radius:4px; padding:10px 12px; margin-bottom:8px; }
.arbol-nodo-header { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.arbol-nodo-detail { display:flex; gap:16px; margin-top:6px; flex-wrap:wrap; }
.arbol-ref { font-size:0.8rem; color:#4a3a20; font-style:italic; }
.arbol-form { background:#12100a; border:1px dashed #2a2010; border-radius:4px; padding:14px; margin-top:12px; }
</style>
