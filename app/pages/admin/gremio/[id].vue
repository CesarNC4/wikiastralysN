<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/gremio" class="btn-back">← Gremio</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Gremio' : 'Crear Gremio' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/gremio', 'nombre')">
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else>
      <!-- Tabs -->
      <div class="tabs-wrap">
        <button class="tabs-arrow" @click="scrollTabs(-1)">‹</button>
        <div class="inner-tabs" ref="tabsEl">
          <button v-for="t in TABS" :key="t.key" class="inner-tab"
            :class="{ active: tab === t.key }" @click="tab = t.key">{{ t.label }}</button>
        </div>
        <button class="tabs-arrow" @click="scrollTabs(1)">›</button>
      </div>

      <!-- Tab: General -->
      <div v-if="tab === 'general'" class="form-grid">
        <div>
          <div class="section">
            <div class="sec-title">Identidad</div>
            <div class="f-group">
              <label class="f-lbl">Nombre *</label>
              <input class="f-inp" v-model="f.nombre" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Subtítulo</label>
              <input class="f-inp" v-model="f.subtitulo" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Lema</label>
              <input class="f-inp" v-model="f.lema" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Sede</label>
              <input class="f-inp" v-model="f.sede" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Descripción</label>
              <textarea class="f-area" v-model="f.descripcion" rows="5"></textarea>
            </div>
            <div class="f-group">
              <label class="f-lbl">Historia</label>
              <RichEditor v-model="f.historia" placeholder="Historia del gremio..." />
            </div>
          </div>
          <div class="section">
            <div class="sec-title">Estructura</div>
            <div class="f-group">
              <label class="f-lbl">Estructura Global</label>
              <RichEditor v-model="f.estructura_global" placeholder="Organización interna..." />
            </div>
            <div class="f-group">
              <label class="f-lbl">Jerarquía de Rangos</label>
              <textarea class="f-area" v-model="f.jerarquia_rangos" rows="5"></textarea>
            </div>
            <div class="f-group">
              <label class="f-lbl">Sistema de Misiones</label>
              <textarea class="f-area" v-model="f.sistema_misiones" rows="5"></textarea>
            </div>
            <div class="f-group">
              <label class="f-lbl">Recompensas</label>
              <textarea class="f-area" v-model="f.recompensas" rows="4"></textarea>
            </div>
          </div>
        </div>
        <div>
          <div class="section">
            <div class="sec-title">Imágenes</div>
            <div class="f-group">
              <label class="f-lbl">Imagen</label>
              <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/gremio" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Banner</label>
              <CloudinaryUpload v-model="f.banner_url" folder="wikiastralys/gremio/banners" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Código de Honor -->
      <div v-if="tab === 'codigo'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Principios y Normas</div>
          <div class="f-group">
            <label class="f-lbl">Principios Generales</label>
            <textarea class="f-area" v-model="f.principios_generales" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Normas y Contratos</label>
            <textarea class="f-area" v-model="f.normas_contratos" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Conducta Aceptable</label>
            <textarea class="f-area" v-model="f.conducta_aceptable" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Conducta Intolerable</label>
            <textarea class="f-area" v-model="f.conducta_intolerable" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Uso de la Fuerza</label>
            <textarea class="f-area" v-model="f.uso_fuerza" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Lealtad y Discreción</label>
            <textarea class="f-area" v-model="f.lealtad_discrecion" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Principio de la Espada Neutral</label>
            <textarea class="f-area" v-model="f.principio_espada_neutral" rows="4"></textarea>
          </div>
        </div>
      </div>

      <!-- Tab: Rangos -->
      <div v-if="tab === 'rangos'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Rangos del Gremio</div>
          <div v-for="r in rangos" :key="r.id" class="rel-row">
            <span class="rel-tag">peso {{ r.peso }}</span>
            <span class="rel-name">{{ r.nombre }}</span>
            <button class="rel-remove" @click="quitarRango(r)">✕</button>
          </div>
          <div class="rel-add">
            <input v-model="nuevoRango.nombre" placeholder="Nombre del rango" class="rel-input" style="flex:1" />
            <input v-model.number="nuevoRango.peso" type="number" placeholder="Peso" class="rel-input" style="width:70px" />
            <button class="btn-rel-add" @click="agregarRango">+ Rango</button>
          </div>
        </div>
      </div>

      <!-- Tab: Facciones -->
      <div v-if="tab === 'facciones'" class="form-grid-single">
        <div class="section">
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
      </div>

      <!-- Tab: Jerarquía -->
      <div v-if="tab === 'jerarquia'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Miembros Actuales</div>
          <div v-for="j in jerarquia" :key="j.id" class="rel-row">
            <span class="rel-tag">{{ j.rangoNombre || '—' }}</span>
            <span class="rel-name">{{ j.pjNombre }}</span>
            <span v-if="j.titulo_apodo" class="rel-tag" style="color:#c8a84b">{{ j.titulo_apodo }}</span>
            <span v-if="j.faccionNombre" class="rel-tag">{{ j.faccionNombre }}</span>
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
            <select v-model="nuevaJerarquia.rango_id" class="rel-select">
              <option :value="null">Sin rango</option>
              <option v-for="r in rangos" :key="r.id" :value="r.id">{{ r.nombre }}</option>
            </select>
            <input v-model="nuevaJerarquia.titulo_apodo" placeholder="Apodo / Título" class="rel-input" style="width:120px" />
            <select v-model="nuevaJerarquia.faccion_id" class="rel-select">
              <option :value="null">Sin facción</option>
              <option v-for="fac in facciones" :key="fac.id" :value="fac.id">{{ fac.nombre }}</option>
            </select>
            <button class="btn-rel-add" :disabled="!nuevaJerarquia.personaje_id" @click="agregarJerarquia">+ Agregar</button>
          </div>
        </div>
      </div>

      <!-- Tab: Historial -->
      <div v-if="tab === 'historial'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Historial de Miembros</div>
          <div v-for="h in historial" :key="h.id" class="rel-row">
            <span class="rel-tag" :class="h.estado === 'Activo' ? 'tag-green' : ''">{{ h.estado }}</span>
            <span class="rel-name">{{ h.nombre }}</span>
            <span class="rel-tag">{{ h.rol || '—' }}</span>
            <span v-if="h.periodo" class="rel-tag">{{ h.periodo }}</span>
            <button class="rel-remove" @click="quitarHistorial(h)">✕</button>
          </div>
          <div class="rel-add">
            <div class="autocomplete-wrap">
              <input v-model="histBusqueda" placeholder="Buscar personaje..." class="rel-input"
                @input="filtrarHistPjs" autocomplete="off" />
              <div v-if="histPjsFiltrados.length" class="autocomplete-list">
                <div v-for="p in histPjsFiltrados" :key="p.id" class="autocomplete-item"
                  @mousedown.prevent="seleccionarHistPj(p)">{{ p.nombre }}</div>
              </div>
            </div>
            <select v-model="nuevoHistorial.estado" class="rel-select">
              <option>Activo</option><option>Inactivo</option><option>Expulsado</option><option>Fallecido</option>
            </select>
            <input v-model="nuevoHistorial.rol" placeholder="Rol" class="rel-input" style="width:100px" />
            <input v-model="nuevoHistorial.periodo" placeholder="Período" class="rel-input" style="width:100px" />
            <button class="btn-rel-add" :disabled="!nuevoHistorial.personaje_id" @click="agregarHistorial">+ Agregar</button>
          </div>
        </div>
      </div>

      <p v-if="!isEdit" class="hint" style="margin-top:12px">💡 Guarda el gremio primero para gestionar rangos, facciones y miembros.</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const supabase = useSupabaseClient()

const TABS = [
  { key: 'general',   label: 'General' },
  { key: 'codigo',    label: 'Código de Honor' },
  { key: 'rangos',    label: 'Rangos' },
  { key: 'facciones', label: 'Facciones' },
  { key: 'jerarquia', label: 'Jerarquía' },
  { key: 'historial', label: 'Historial' },
]
const tab = ref('general')
const tabsEl = ref(null)
function scrollTabs(dir) { tabsEl.value?.scrollBy({ left: dir * 220, behavior: 'smooth' }) }

const f = ref({
  nombre: 'Gremio de Aventureros', subtitulo: '', lema: '', sede: '',
  descripcion: '', historia: '', estructura_global: '', jerarquia_rangos: '',
  sistema_misiones: '', principios_generales: '', normas_contratos: '',
  conducta_aceptable: '', conducta_intolerable: '', uso_fuerza: '',
  lealtad_discrecion: '', principio_espada_neutral: '', recompensas: '',
  imagen_url: '', banner_url: '',
})

const { id, isEdit, loading, saving, error, cargar, guardar } = useAdminForm('gremio', f)

const todosPersonajes = ref([])
const rangos   = ref([])
const facciones = ref([])
const jerarquia = ref([])
const historial = ref([])

onMounted(async () => {
  await cargar()
  const { data } = await supabase.from('personajes').select('id, nombre').order('nombre')
  todosPersonajes.value = data ?? []
  if (isEdit.value) await cargarSubtablas()
})

async function cargarSubtablas() {
  const [{ data: rg }, { data: fc }, { data: jr }, { data: hs }] = await Promise.all([
    supabase.from('gremio_rangos').select('*').eq('gremio_id', id.value).order('peso'),
    supabase.from('gremio_facciones').select('*').eq('gremio_id', id.value),
    supabase.from('gremio_jerarquia')
      .select('id, orden, titulo_apodo, personaje_id, rango_id, faccion_id, personajes(nombre), gremio_rangos(nombre), gremio_facciones(nombre)')
      .eq('gremio_id', id.value).order('orden'),
    supabase.from('gremio_historial')
      .select('id, nombre, estado, rol, periodo, personaje_id, destacado, notas')
      .eq('gremio_id', id.value),
  ])
  rangos.value   = rg ?? []
  facciones.value = fc ?? []
  jerarquia.value = (jr ?? []).map(j => ({
    ...j,
    pjNombre:     j.personajes?.nombre,
    rangoNombre:  j.gremio_rangos?.nombre,
    faccionNombre: j.gremio_facciones?.nombre,
  }))
  historial.value = hs ?? []
}

// ── Rangos ──
const nuevoRango = ref({ nombre: '', peso: 0 })
async function agregarRango() {
  if (!nuevoRango.value.nombre.trim()) return
  await supabase.from('gremio_rangos').insert({ gremio_id: id.value, ...nuevoRango.value })
  nuevoRango.value = { nombre: '', peso: 0 }
  await cargarSubtablas()
}
async function quitarRango(r) {
  if (!confirm(`¿Eliminar rango "${r.nombre}"?`)) return
  await supabase.from('gremio_rangos').delete().eq('id', r.id)
  await cargarSubtablas()
}

// ── Facciones ──
const nuevaFaccion = ref({ nombre: '', color: '#c8a84b' })
async function agregarFaccion() {
  if (!nuevaFaccion.value.nombre.trim()) return
  await supabase.from('gremio_facciones').insert({ gremio_id: id.value, ...nuevaFaccion.value })
  nuevaFaccion.value = { nombre: '', color: '#c8a84b' }
  await cargarSubtablas()
}
async function quitarFaccion(fac) {
  if (!confirm(`¿Eliminar facción "${fac.nombre}"?`)) return
  await supabase.from('gremio_facciones').delete().eq('id', fac.id)
  await cargarSubtablas()
}

// ── Jerarquía ──
const pjBusqueda     = ref('')
const pjsFiltrados   = ref([])
const nuevaJerarquia = ref({ personaje_id: null, rango_id: null, titulo_apodo: '', faccion_id: null, orden: 0 })

function filtrarPjs() {
  const q = pjBusqueda.value.toLowerCase()
  pjsFiltrados.value = todosPersonajes.value.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarPj(p) { nuevaJerarquia.value.personaje_id = p.id; pjBusqueda.value = p.nombre; pjsFiltrados.value = [] }
async function agregarJerarquia() {
  if (!nuevaJerarquia.value.personaje_id) return
  await supabase.from('gremio_jerarquia').insert({ gremio_id: id.value, ...nuevaJerarquia.value })
  nuevaJerarquia.value = { personaje_id: null, rango_id: null, titulo_apodo: '', faccion_id: null, orden: 0 }
  pjBusqueda.value = ''
  await cargarSubtablas()
}
async function quitarJerarquia(j) {
  if (!confirm(`¿Quitar ${j.pjNombre} de la jerarquía?`)) return
  await supabase.from('gremio_jerarquia').delete().eq('id', j.id)
  await cargarSubtablas()
}

// ── Historial ──
const histBusqueda     = ref('')
const histPjsFiltrados = ref([])
const nuevoHistorial   = ref({ personaje_id: null, nombre: '', estado: 'Activo', rol: '', periodo: '', destacado: false, notas: '' })

function filtrarHistPjs() {
  const q = histBusqueda.value.toLowerCase()
  histPjsFiltrados.value = todosPersonajes.value.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarHistPj(p) {
  nuevoHistorial.value.personaje_id = p.id; nuevoHistorial.value.nombre = p.nombre
  histBusqueda.value = p.nombre; histPjsFiltrados.value = []
}
async function agregarHistorial() {
  if (!nuevoHistorial.value.personaje_id) return
  await supabase.from('gremio_historial').insert({ gremio_id: id.value, ...nuevoHistorial.value })
  nuevoHistorial.value = { personaje_id: null, nombre: '', estado: 'Activo', rol: '', periodo: '', destacado: false, notas: '' }
  histBusqueda.value = ''
  await cargarSubtablas()
}
async function quitarHistorial(h) {
  if (!confirm(`¿Eliminar registro de ${h.nombre}?`)) return
  await supabase.from('gremio_historial').delete().eq('id', h.id)
  await cargarSubtablas()
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
<style scoped>
.tabs-wrap {
  display: flex;
  align-items: stretch;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--bd-strong);
}
.tabs-arrow {
  background: transparent;
  border: none;
  border-bottom: 1px solid transparent;
  color: var(--t3);
  font-size: 1.1rem;
  padding: 6px 10px;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 160ms;
  margin-bottom: -1px;
}
.tabs-arrow:hover { color: var(--accent); }
.inner-tabs {
  display: flex;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
  flex: 1;
}
.inner-tabs::-webkit-scrollbar { display: none; }
.inner-tab {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 10px 14px;
  background: transparent;
  border: none;
  color: #4a3a20;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
}
.inner-tab:hover { color: #a89070; }
.inner-tab.active { color: #c8a84b; border-bottom-color: #c8a84b; }
.rel-color  { width:12px; height:12px; border-radius:2px; flex-shrink:0; }
.color-pick { width:36px; height:34px; padding:2px; border:1px solid #2a2010; background:#0e0b07; border-radius:2px; cursor:pointer; }
.tag-green  { border-color:#4a8a40; color:#4a8a40; }
</style>
