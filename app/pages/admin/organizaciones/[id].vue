<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/organizaciones" class="btn-back">← Organizaciones</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Organización' : 'Nueva Organización' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardar('/admin/organizaciones')">
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <div>
        <!-- Info general -->
        <div class="section">
          <div class="sec-title">Información General</div>
          <Field label="Nombre *"><input v-model="f.nombre" /></Field>
          <Field label="Subtítulo"><input v-model="f.subtitulo" /></Field>
          <div class="row2">
            <Field label="Tipo">
              <select v-model="f.tipo">
                <option>Otro</option><option>Gremio</option><option>Facción Política</option>
                <option>Orden Militar</option><option>Culto</option><option>Red Criminal</option>
                <option>Mercantil</option><option>Académica</option><option>Religiosa</option>
              </select>
            </Field>
            <Field label="Estado">
              <select v-model="f.estado">
                <option>Activa</option><option>Inactiva</option><option>Disuelta</option>
                <option>Clandestina</option><option>Legendaria</option>
              </select>
            </Field>
          </div>
          <Field label="Sede"><input v-model="f.sede" /></Field>
          <Field label="Descripción"><textarea v-model="f.descripcion" rows="4" /></Field>
        </div>

        <div class="section">
          <div class="sec-title">Lore</div>
          <Field label="Historia"><textarea v-model="f.historia" rows="5" /></Field>
          <Field label="Objetivo"><textarea v-model="f.objetivo" rows="3" /></Field>
          <Field label="Ideología"><textarea v-model="f.ideologia" rows="3" /></Field>
          <Field label="Fundación"><textarea v-model="f.fundacion" rows="3" /></Field>
          <Field label="Estructura interna"><textarea v-model="f.estructura_interna" rows="4" /></Field>
          <Field label="Relación con facciones"><textarea v-model="f.relacion_facciones" rows="3" /></Field>
          <Field label="Notas adicionales"><textarea v-model="f.notas_adicionales" rows="3" /></Field>
        </div>

        <!-- Rangos -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Rangos</div>
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

        <!-- Facciones internas -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Facciones Internas</div>
          <div v-for="fac in facciones" :key="fac.id" class="rel-row">
            <span class="rel-color" :style="`background:${fac.color||'#2a2010'}`"></span>
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
          <div class="sec-title">Jerarquía Actual</div>
          <div v-for="j in jerarquia" :key="j.id" class="rel-row">
            <span class="rel-tag">{{ j.rangoNombre || '—' }}</span>
            <span class="rel-name">{{ j.pjNombre }}</span>
            <span class="rel-tag" style="color:#c8a84b">{{ j.titulo_apodo || '' }}</span>
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
            <input v-model="nuevaJerarquia.titulo_apodo" placeholder="Apodo/Título" class="rel-input" style="width:110px" />
            <button class="btn-rel-add" :disabled="!nuevaJerarquia.personaje_id" @click="agregarJerarquia">+ Agregar</button>
          </div>
        </div>

        <!-- Historial -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Historial de Miembros</div>
          <div v-for="h in historial" :key="h.id" class="rel-row">
            <span class="rel-tag" :class="h.estado === 'Activo' ? 'tag-green' : ''">{{ h.estado }}</span>
            <span class="rel-name">{{ h.nombre }}</span>
            <span class="rel-tag">{{ h.rol || '—' }}</span>
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
            <input v-model="nuevoHistorial.rol" placeholder="Rol" class="rel-input" style="width:110px" />
            <button class="btn-rel-add" :disabled="!nuevoHistorial.personaje_id" @click="agregarHistorial">+ Agregar</button>
          </div>
        </div>

        <p v-if="!isEdit" class="hint">💡 Guarda la organización primero para gestionar rangos, facciones y miembros.</p>
      </div>

      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/organizaciones" />
            </Field>
            <Field label="Banner">
              <CloudinaryUpload v-model="f.banner_url" label="Banner" icon="🖼" folder="wikiastralys/organizaciones/banners" />
            </Field>
        </div>
        <div class="section">
          <div class="sec-title">Visibilidad</div>
          <label class="check-label"><input type="checkbox" v-model="f.visible" /> Visible al público</label>
        </div>
        <div class="section" v-if="isEdit">
          <div class="sec-title">Liderazgo y Miembros (texto)</div>
          <Field label="Liderazgo"><textarea v-model="f.liderazgo" rows="3" /></Field>
          <Field label="Miembros destacados"><textarea v-model="f.miembros_destacados" rows="3" /></Field>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const supabase = useSupabaseClient()

const f = ref({
  nombre: '', subtitulo: '', tipo: 'Otro', estado: 'Activa', sede: '',
  descripcion: '', historia: '', objetivo: '', ideologia: '', fundacion: '',
  estructura_interna: '', relacion_facciones: '', notas_adicionales: '',
  liderazgo: '', miembros_destacados: '', imagen_url: '', banner_url: '', visible: true,
})

const { id, isEdit, loading, saving, error, cargar, guardar } = useAdminForm('organizaciones', f)

// Catálogos
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
  const [
    { data: rg }, { data: fc }, { data: jr }, { data: hs }
  ] = await Promise.all([
    supabase.from('org_rangos').select('*').eq('organizacion_id', id.value).order('peso'),
    supabase.from('org_facciones').select('*').eq('organizacion_id', id.value),
    supabase.from('org_jerarquia')
      .select('id, orden, titulo_apodo, personaje_id, rango_id, personajes(nombre), org_rangos(nombre)')
      .eq('organizacion_id', id.value).order('orden'),
    supabase.from('org_historial')
      .select('id, nombre, estado, rol, periodo, personaje_id, destacado, motivo_destacado, notas')
      .eq('organizacion_id', id.value),
  ])
  rangos.value   = rg ?? []
  facciones.value = fc ?? []
  jerarquia.value = (jr ?? []).map(j => ({ ...j, pjNombre: j.personajes?.nombre, rangoNombre: j.org_rangos?.nombre }))
  historial.value = hs ?? []
}

// ── Rangos ──
const nuevoRango = ref({ nombre: '', peso: 0 })
async function agregarRango() {
  if (!nuevoRango.value.nombre.trim()) return
  await supabase.from('org_rangos').insert({ organizacion_id: id.value, ...nuevoRango.value })
  nuevoRango.value = { nombre: '', peso: 0 }
  await cargarSubtablas()
}
async function quitarRango(r) {
  if (!confirm(`¿Eliminar rango "${r.nombre}"?`)) return
  await supabase.from('org_rangos').delete().eq('id', r.id)
  await cargarSubtablas()
}

// ── Facciones ──
const nuevaFaccion = ref({ nombre: '', color: '#c8a84b' })
async function agregarFaccion() {
  if (!nuevaFaccion.value.nombre.trim()) return
  await supabase.from('org_facciones').insert({ organizacion_id: id.value, ...nuevaFaccion.value })
  nuevaFaccion.value = { nombre: '', color: '#c8a84b' }
  await cargarSubtablas()
}
async function quitarFaccion(fac) {
  if (!confirm(`¿Eliminar facción "${fac.nombre}"?`)) return
  await supabase.from('org_facciones').delete().eq('id', fac.id)
  await cargarSubtablas()
}

// ── Jerarquía — autocomplete personajes ──
const pjBusqueda = ref('')
const pjsFiltrados = ref([])
const nuevaJerarquia = ref({ personaje_id: null, rango_id: null, titulo_apodo: '', orden: 0 })

function filtrarPjs() {
  const q = pjBusqueda.value.toLowerCase()
  pjsFiltrados.value = todosPersonajes.value.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarPj(p) {
  nuevaJerarquia.value.personaje_id = p.id; pjBusqueda.value = p.nombre; pjsFiltrados.value = []
}
async function agregarJerarquia() {
  if (!nuevaJerarquia.value.personaje_id) return
  await supabase.from('org_jerarquia').insert({ organizacion_id: id.value, ...nuevaJerarquia.value })
  nuevaJerarquia.value = { personaje_id: null, rango_id: null, titulo_apodo: '', orden: 0 }
  pjBusqueda.value = ''
  await cargarSubtablas()
}
async function quitarJerarquia(j) {
  if (!confirm(`¿Quitar ${j.pjNombre} de la jerarquía?`)) return
  await supabase.from('org_jerarquia').delete().eq('id', j.id)
  await cargarSubtablas()
}

// ── Historial ──
const histBusqueda = ref('')
const histPjsFiltrados = ref([])
const nuevoHistorial = ref({ personaje_id: null, nombre: '', estado: 'Activo', rol: '', periodo: '', destacado: false, notas: '' })

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
  await supabase.from('org_historial').insert({ organizacion_id: id.value, ...nuevoHistorial.value })
  nuevoHistorial.value = { personaje_id: null, nombre: '', estado: 'Activo', rol: '', periodo: '', destacado: false, notas: '' }
  histBusqueda.value = ''
  await cargarSubtablas()
}
async function quitarHistorial(h) {
  if (!confirm(`¿Eliminar registro de ${h.nombre}?`)) return
  await supabase.from('org_historial').delete().eq('id', h.id)
  await cargarSubtablas()
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
<style scoped>
.rel-color { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.color-pick { width: 36px; height: 34px; padding: 2px; border: 1px solid #2a2010; background: #0e0b07; border-radius: 2px; cursor: pointer; }
.tag-green { border-color: #4a8a40; color: #4a8a40; }
</style>
