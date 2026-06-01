<template>
  <div class="taller-wrap">

    <!-- ── Sidebar ── -->
    <aside class="tree-panel">
      <div class="tree-header">
        <span class="tree-title">Arcos & Hojas</span>
        <button class="btn-nuevo-arco" @click="abrirModalArco">+ Arco</button>
      </div>

      <div class="tree-scroll">
        <div v-if="loadingArbol" class="tree-loading">Cargando...</div>
        <template v-else>
          <p v-if="!arbol.length" class="tree-empty">Sin arcos. Crea el primero.</p>
          <div v-for="arco in arbol" :key="arco.id" class="arco-group">
            <div class="arco-header"
              :style="arco.color ? `border-left-color:${arco.color}` : ''"
              @click="toggleArco(arco.id)">
              <span class="arco-expand">{{ arcoExpandido === arco.id ? '▾' : '▸' }}</span>
              <span class="arco-nombre">{{ arco.nombre }}</span>
              <span class="arco-badge">{{ arco.hojas?.length || 0 }}</span>
            </div>
            <div v-if="arcoExpandido === arco.id" class="hojas-list">
              <div v-for="h in arco.hojas" :key="h.id"
                class="hoja-item"
                :class="{ active: hojaActual?.id === h.id, [`estado-${(h.estado||'').toLowerCase().replace('_','-')}`]: true }"
                @click="seleccionarHoja(h.id)">
                <span class="hoja-dot"></span>
                <span class="hoja-titulo">{{ h.titulo }}</span>
              </div>
              <button class="btn-nueva-hoja" @click.stop="crearHoja(arco.id)">+ Hoja</button>
            </div>
          </div>
        </template>
      </div>

      <div class="tree-footer">
        <button class="btn-footer" @click="verConsistencia">🔍 Consistencia</button>
        <button class="btn-footer" @click="verBorradores">📋 Borradores</button>
      </div>
    </aside>

    <!-- ── Panel principal ── -->
    <main class="taller-main">

      <!-- Vista: hoja -->
      <template v-if="vista === 'hoja' && hojaActual">
        <div class="hoja-toolbar">
          <h2 class="hoja-titulo-h">{{ hojaActual.titulo }}</h2>
          <div style="display:flex;gap:8px">
            <button class="btn-guardar" :disabled="savingHoja" @click="guardarHoja">
              {{ savingHoja ? 'Guardando...' : 'Guardar' }}
            </button>
            <button class="btn-eliminar" @click="eliminarHoja">Eliminar</button>
          </div>
        </div>
        <p v-if="hojaError" class="hoja-error">{{ hojaError }}</p>

        <div class="hoja-form">
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Título</label>
              <input class="f-inp" v-model="hojaForm.titulo" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Estado</label>
              <select class="f-inp" v-model="hojaForm.estado">
                <option v-for="e in ESTADOS_HOJA" :key="e" :value="e">{{ e }}</option>
              </select>
            </div>
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Capítulo vinculado</label>
              <select class="f-inp" v-model="hojaForm.capitulo_id">
                <option :value="null">—</option>
                <option v-for="c in cats.capitulos" :key="c.id" :value="c.id">Cap. {{ c.numero }} — {{ c.titulo }}</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Orden</label>
              <input class="f-inp" type="number" v-model.number="hojaForm.orden" />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Conflicto Central</label>
            <textarea class="f-area" v-model="hojaForm.conflicto_central" rows="3"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Giro Argumental</label>
            <textarea class="f-area" v-model="hojaForm.giro_argumental" rows="3"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Secretos Revelados</label>
            <textarea class="f-area" v-model="hojaForm.secretos_revelados" rows="3"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Consecuencias</label>
            <textarea class="f-area" v-model="hojaForm.consecuencias" rows="3"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Notas Privadas</label>
            <textarea class="f-area" v-model="hojaForm.notas_privadas" rows="3"></textarea>
          </div>

          <!-- Personajes -->
          <div class="sub-section">
            <div class="sub-title">👤 Personajes involucrados</div>
            <div v-if="!hojaPersonajes.length" class="sub-empty">Sin personajes asignados.</div>
            <div v-for="p in hojaPersonajes" :key="p.id" class="sub-row">
              <img v-if="p.personajes?.imagen_url" :src="p.personajes.imagen_url" class="sub-avatar" />
              <div v-else class="sub-avatar-ph">{{ (p.personajes?.nombre || '?')[0] }}</div>
              <div class="sub-info">
                <span class="sub-nombre">{{ p.personajes?.nombre }}</span>
                <span v-if="p.rol_en_trama" class="sub-meta">{{ p.rol_en_trama }}</span>
              </div>
              <button class="sub-remove" @click="quitarPersonajeHoja(p.id)">✕</button>
            </div>
            <div class="sub-add">
              <select v-model.number="nuevoPj.personaje_id" class="rel-select" style="flex:1">
                <option value="">— Personaje —</option>
                <option v-for="p in cats.personajes" :key="p.id" :value="p.id">
                  {{ p.nombre }}{{ p.surname ? ' ' + p.surname : '' }}
                </option>
              </select>
              <input v-model="nuevoPj.rol_en_trama" placeholder="Rol (opcional)" class="rel-input" style="width:140px" />
              <button class="btn-rel-add" :disabled="!nuevoPj.personaje_id" @click="agregarPersonajeHoja">+ Agregar</button>
            </div>
          </div>

          <!-- Canciones -->
          <div class="sub-section">
            <div class="sub-title">🎵 Canciones del momento</div>
            <div v-if="!hojaCanciones.length" class="sub-empty">Sin canciones asignadas.</div>
            <div v-for="c in hojaCanciones" :key="c.id" class="sub-row">
              <div class="sub-info">
                <span class="sub-nombre">{{ c.canciones?.titulo }}</span>
                <span v-if="c.canciones?.artista" class="sub-meta">{{ c.canciones.artista }}</span>
                <span v-if="c.nota" class="sub-meta" style="color:#c8a84b">{{ c.nota }}</span>
              </div>
              <button class="sub-remove" @click="quitarCancionHoja(c.id)">✕</button>
            </div>
            <div class="sub-add">
              <select v-model.number="nuevaCancion.cancion_id" class="rel-select" style="flex:1">
                <option value="">— Canción —</option>
                <option v-for="c in cats.canciones" :key="c.id" :value="c.id">
                  {{ c.titulo }}{{ c.artista ? ' — ' + c.artista : '' }}
                </option>
              </select>
              <input v-model="nuevaCancion.nota" placeholder="Nota (opcional)" class="rel-input" style="width:140px" />
              <button class="btn-rel-add" :disabled="!nuevaCancion.cancion_id" @click="agregarCancionHoja">+ Agregar</button>
            </div>
          </div>

          <!-- Dependencias -->
          <div class="sub-section">
            <div class="sub-title">🔗 Depende de (prerequisitos)</div>
            <div v-if="!hojaDepende.length" class="sub-empty">Sin dependencias.</div>
            <div v-for="d in hojaDepende" :key="d.id" class="sub-row">
              <div class="sub-info">
                <span class="sub-nombre">{{ nombreHoja(d.depende_de_id) }}</span>
                <span v-if="d.nota" class="sub-meta">{{ d.nota }}</span>
              </div>
              <button class="sub-remove" @click="quitarDependencia(d.id)">✕</button>
            </div>
            <div class="sub-add">
              <select v-model.number="nuevaDep.depende_de_id" class="rel-select" style="flex:1">
                <option value="">— Hoja prerequisito —</option>
                <template v-for="arco in arbol" :key="arco.id">
                  <option disabled>── {{ arco.nombre }} ──</option>
                  <option v-for="h in (arco.hojas || []).filter(h => h.id !== hojaActual.id)" :key="h.id" :value="h.id">
                    {{ h.titulo }}
                  </option>
                </template>
              </select>
              <input v-model="nuevaDep.nota" placeholder="Nota (opcional)" class="rel-input" style="width:140px" />
              <button class="btn-rel-add" :disabled="!nuevaDep.depende_de_id" @click="agregarDependencia">+ Agregar</button>
            </div>
          </div>
        </div>
      </template>

      <!-- Vista: consistencia -->
      <template v-else-if="vista === 'consistencia'">
        <h2 class="panel-title">🔍 Panel de Consistencia</h2>
        <div v-if="loadingCons" class="tree-loading">Analizando...</div>
        <template v-else>
          <div v-if="consistencia.bloqueos?.length" class="cons-section">
            <p class="cons-label">🚫 Hojas bloqueadas por prerequisitos incompletos ({{ consistencia.bloqueos.length }})</p>
            <div v-for="b in consistencia.bloqueos" :key="b.id" class="cons-item red">
              <span class="cons-nombre">{{ b.titulo }}</span>
              <span class="cons-sub">Bloqueo: {{ b.bloqueadoPor }}</span>
            </div>
          </div>
          <div v-if="consistencia.listosParaPublicar?.length" class="cons-section">
            <p class="cons-label">✅ Listos para publicar ({{ consistencia.listosParaPublicar.length }})</p>
            <div v-for="l in consistencia.listosParaPublicar" :key="l.id" class="cons-item green">
              <span class="cons-nombre">{{ l.titulo }}</span>
              <span class="cons-sub">{{ l.arcoNombre }}</span>
            </div>
          </div>
          <div v-if="consistencia.sinCapitulo?.length" class="cons-section">
            <p class="cons-label">⚠️ Hojas sin capítulo vinculado ({{ consistencia.sinCapitulo.length }})</p>
            <div v-for="h in consistencia.sinCapitulo" :key="h.id" class="cons-item yellow">
              <span class="cons-nombre" style="cursor:pointer;text-decoration:underline" @click="seleccionarHoja(h.id)">{{ h.titulo }}</span>
            </div>
          </div>
          <div v-if="consistencia.muertosSinHito?.length" class="cons-section">
            <p class="cons-label">⚠️ Personajes con estado Muerto sin hito de Muerte ({{ consistencia.muertosSinHito.length }})</p>
            <div v-for="p in consistencia.muertosSinHito" :key="p.id" class="cons-item yellow">
              <NuxtLink :to="`/admin/personajes/${p.id}`" class="cons-nombre" style="text-decoration:underline">{{ p.nombre }}</NuxtLink>
            </div>
          </div>
          <p v-if="!consistencia.bloqueos?.length && !consistencia.listosParaPublicar?.length && !consistencia.sinCapitulo?.length && !consistencia.muertosSinHito?.length"
            class="cons-ok">Sin alertas activas. ✓</p>
        </template>
      </template>

      <!-- Vista: borradores -->
      <template v-else-if="vista === 'borradores'">
        <h2 class="panel-title">📋 Borradores</h2>
        <div v-if="loadingBorr" class="tree-loading">Cargando...</div>
        <template v-else>
          <div v-if="borradores.capitulos?.length" class="cons-section">
            <p class="cons-label">Capítulos no visibles</p>
            <div v-for="c in borradores.capitulos" :key="c.id" class="borr-row">
              <span>Cap. {{ c.numero }} — {{ c.titulo }}</span>
              <button class="btn-pub" @click="publicarCapitulo(c.id)">Publicar</button>
            </div>
          </div>
          <div v-if="borradores.actos?.length" class="cons-section">
            <p class="cons-label">Actos con estado Pendiente</p>
            <div v-for="a in borradores.actos" :key="a.id" class="borr-row">
              <span>{{ a.nombre }} <span style="color:#4a3a20;font-size:0.85rem">({{ a.capitulos?.titulo || '—' }})</span></span>
              <button class="btn-pub" @click="publicarActo(a.id)">Marcar listo</button>
            </div>
          </div>
          <div v-if="borradores.hojas?.length" class="cons-section">
            <p class="cons-label">Hojas en borrador (Idea / En desarrollo)</p>
            <div v-for="h in borradores.hojas" :key="h.id" class="borr-row">
              <span class="borr-estado" :class="`estado-${(h.estado||'').toLowerCase().replace('_','-')}`">{{ h.estado }}</span>
              <span>{{ h.titulo }}</span>
              <button class="btn-pub" @click="seleccionarHoja(h.id)">Abrir</button>
            </div>
          </div>
          <p v-if="!borradores.capitulos?.length && !borradores.actos?.length && !borradores.hojas?.length"
            class="cons-ok">Sin borradores pendientes. ✓</p>
        </template>
      </template>

      <!-- Placeholder -->
      <template v-else>
        <div class="taller-empty">
          <span>◆</span>
          <p>Selecciona una hoja del árbol o crea una nueva.</p>
        </div>
      </template>
    </main>

    <!-- Modal nuevo arco -->
    <div v-if="modalArco" class="modal-overlay" @click.self="modalArco = null">
      <div class="modal-box">
        <h3 class="modal-title">Nuevo Arco</h3>
        <div class="f-group">
          <label class="f-lbl">Nombre *</label>
          <input class="f-inp" v-model="modalArco.nombre" />
        </div>
        <div class="f-group">
          <label class="f-lbl">Descripción</label>
          <textarea class="f-area" v-model="modalArco.descripcion" rows="2"></textarea>
        </div>
        <div class="row2">
          <div class="f-group">
            <label class="f-lbl">Libro</label>
            <select class="f-inp" v-model="modalArco.libro">
              <option value="Astralys">Astralys</option>
              <option value="Ishkoria">Ishkoria</option>
              <option value="Wonderland">Wonderland</option>
            </select>
          </div>
          <div class="f-group">
            <label class="f-lbl">Color</label>
            <input v-model="modalArco.color" type="color" class="color-pick" />
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn-guardar" @click="crearArco">Crear Arco</button>
          <button class="btn-eliminar" @click="modalArco = null">Cancelar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const supabase = useSupabaseClient()

const ESTADOS_HOJA = ['Idea','En_desarrollo','En_revision','Listo','Publicado','Archivado']

// ── Estado ──
const arbol         = ref([])
const loadingArbol  = ref(true)
const arcoExpandido = ref(null)
const hojaActual    = ref(null)
const hojaForm      = ref({})
const hojaPersonajes = ref([])
const hojaCanciones  = ref([])
const hojaDepende    = ref([])
const savingHoja    = ref(false)
const hojaError     = ref('')
const vista         = ref('none')
const modalArco     = ref(null)

const consistencia  = ref({ bloqueos:[], listosParaPublicar:[], sinCapitulo:[], muertosSinHito:[] })
const borradores    = ref({ capitulos:[], actos:[], hojas:[] })
const loadingCons   = ref(false)
const loadingBorr   = ref(false)

const cats = ref({ capitulos:[], personajes:[], canciones:[] })

const nuevoPj    = ref({ personaje_id:'', rol_en_trama:'' })
const nuevaCancion = ref({ cancion_id:'', nota:'' })
const nuevaDep   = ref({ depende_de_id:'', nota:'' })

// ── Carga inicial ──
onMounted(async () => {
  await cargarArbol()
  const [{ data: caps }, { data: pjs }, { data: cans }] = await Promise.all([
    supabase.from('capitulos').select('id, numero, titulo').order('numero'),
    supabase.from('personajes').select('id, nombre, surname').order('nombre'),
    supabase.from('canciones').select('id, titulo, artista').order('titulo'),
  ])
  cats.value = { capitulos: caps ?? [], personajes: pjs ?? [], canciones: cans ?? [] }
})

async function cargarArbol() {
  loadingArbol.value = true
  const { data: arcos } = await supabase.from('trama_arcos').select('id, nombre, color, tipo, orden').order('orden')
  if (!arcos) { loadingArbol.value = false; return }
  const { data: hojas } = await supabase.from('trama_hojas').select('id, arco_id, titulo, estado, orden').order('orden')
  arbol.value = arcos.map(a => ({ ...a, hojas: (hojas ?? []).filter(h => h.arco_id === a.id) }))
  loadingArbol.value = false
}

function toggleArco(id) {
  arcoExpandido.value = arcoExpandido.value === id ? null : id
}

function nombreHoja(id) {
  for (const arco of arbol.value) {
    const h = (arco.hojas || []).find(h => h.id === id)
    if (h) return h.titulo
  }
  return `#${id}`
}

// ── Seleccionar hoja ──
async function seleccionarHoja(id) {
  vista.value = 'hoja'; hojaError.value = ''
  const { data } = await supabase.from('trama_hojas').select('*').eq('id', id).single()
  if (!data) return
  hojaActual.value = data
  hojaForm.value = {
    titulo:            data.titulo,
    estado:            data.estado,
    orden:             data.orden,
    capitulo_id:       data.capitulo_id,
    conflicto_central: data.conflicto_central || '',
    giro_argumental:   data.giro_argumental || '',
    secretos_revelados:data.secretos_revelados || '',
    consecuencias:     data.consecuencias || '',
    notas_privadas:    data.notas_privadas || '',
  }
  await cargarRelacionesHoja(id)
}

async function cargarRelacionesHoja(id) {
  const [{ data: pjs }, { data: cans }, { data: deps }] = await Promise.all([
    supabase.from('hoja_personaje').select('id, rol_en_trama, personaje_id, personajes(nombre, surname, imagen_url)').eq('hoja_id', id),
    supabase.from('hoja_cancion').select('id, nota, cancion_id, canciones(titulo, artista)').eq('hoja_id', id),
    supabase.from('hoja_dependencia').select('id, nota, depende_de_id').eq('hoja_id', id),
  ])
  hojaPersonajes.value = pjs ?? []
  hojaCanciones.value  = cans ?? []
  hojaDepende.value    = deps ?? []
}

// ── Guardar hoja ──
async function guardarHoja() {
  savingHoja.value = true; hojaError.value = ''
  const { error } = await supabase.from('trama_hojas').update(hojaForm.value).eq('id', hojaActual.value.id)
  savingHoja.value = false
  if (error) { hojaError.value = error.message; return }
  // Actualizar título en árbol local
  for (const arco of arbol.value) {
    const h = arco.hojas?.find(h => h.id === hojaActual.value.id)
    if (h) { h.titulo = hojaForm.value.titulo; h.estado = hojaForm.value.estado }
  }
  hojaActual.value = { ...hojaActual.value, ...hojaForm.value }
}

// ── Eliminar hoja ──
async function eliminarHoja() {
  if (!confirm(`¿Eliminar "${hojaActual.value.titulo}"?`)) return
  await supabase.from('trama_hojas').delete().eq('id', hojaActual.value.id)
  hojaActual.value = null; vista.value = 'none'
  await cargarArbol()
}

// ── Crear hoja ──
async function crearHoja(arcoId) {
  const { data } = await supabase.from('trama_hojas')
    .insert({ arco_id: arcoId, titulo: 'Nueva hoja', estado: 'Idea', orden: 0 })
    .select('id').single()
  await cargarArbol()
  arcoExpandido.value = arcoId
  if (data) seleccionarHoja(data.id)
}

// ── Crear arco ──
function abrirModalArco() {
  modalArco.value = { nombre: '', descripcion: '', libro: 'Astralys', color: '#c8a84b', orden: arbol.value.length }
}
async function crearArco() {
  if (!modalArco.value.nombre.trim()) return
  await supabase.from('trama_arcos').insert(modalArco.value)
  modalArco.value = null
  await cargarArbol()
}

// ── Personajes de hoja ──
async function agregarPersonajeHoja() {
  if (!nuevoPj.value.personaje_id) return
  await supabase.from('hoja_personaje').insert({ hoja_id: hojaActual.value.id, ...nuevoPj.value })
  nuevoPj.value = { personaje_id:'', rol_en_trama:'' }
  await cargarRelacionesHoja(hojaActual.value.id)
}
async function quitarPersonajeHoja(id) {
  await supabase.from('hoja_personaje').delete().eq('id', id)
  await cargarRelacionesHoja(hojaActual.value.id)
}

// ── Canciones de hoja ──
async function agregarCancionHoja() {
  if (!nuevaCancion.value.cancion_id) return
  await supabase.from('hoja_cancion').insert({ hoja_id: hojaActual.value.id, ...nuevaCancion.value })
  nuevaCancion.value = { cancion_id:'', nota:'' }
  await cargarRelacionesHoja(hojaActual.value.id)
}
async function quitarCancionHoja(id) {
  await supabase.from('hoja_cancion').delete().eq('id', id)
  await cargarRelacionesHoja(hojaActual.value.id)
}

// ── Dependencias ──
async function agregarDependencia() {
  if (!nuevaDep.value.depende_de_id) return
  await supabase.from('hoja_dependencia').insert({ hoja_id: hojaActual.value.id, ...nuevaDep.value })
  nuevaDep.value = { depende_de_id:'', nota:'' }
  await cargarRelacionesHoja(hojaActual.value.id)
}
async function quitarDependencia(id) {
  await supabase.from('hoja_dependencia').delete().eq('id', id)
  await cargarRelacionesHoja(hojaActual.value.id)
}

// ── Consistencia ──
async function verConsistencia() {
  vista.value = 'consistencia'; loadingCons.value = true; hojaActual.value = null
  try {
    const [{ data: todasHojas }, { data: deps }, { data: muertos }, { data: hitosM }] = await Promise.all([
      supabase.from('trama_hojas').select('id, titulo, estado, capitulo_id, arco_id, trama_arcos(nombre)'),
      supabase.from('hoja_dependencia').select('hoja_id, depende_de_id'),
      supabase.from('personaje_narrativa').select('personaje_id, estado_narrativo, personajes(nombre)').eq('estado_narrativo', 'Muerto'),
      supabase.from('personaje_narrativa_hito').select('narrativa_id').eq('tipo_hito', 'Muerte'),
    ])

    // Bloqueos — hojas Listo cuyo prerequisito no está Publicado
    const estadoMap = Object.fromEntries((todasHojas || []).map(h => [h.id, h.estado]))
    const bloqueos = []
    for (const dep of (deps || [])) {
      const hoja = (todasHojas || []).find(h => h.id === dep.hoja_id)
      const prereq = (todasHojas || []).find(h => h.id === dep.depende_de_id)
      if (hoja && prereq && estadoMap[prereq.id] !== 'Publicado' && estadoMap[prereq.id] !== 'Listo') {
        bloqueos.push({ id: hoja.id, titulo: hoja.titulo, bloqueadoPor: prereq.titulo })
      }
    }

    // Listos para publicar
    const listosParaPublicar = (todasHojas || []).filter(h => h.estado === 'Listo').map(h => ({
      id: h.id, titulo: h.titulo, arcoNombre: h.trama_arcos?.nombre,
    }))

    // Sin capítulo
    const sinCapitulo = (todasHojas || []).filter(h => !h.capitulo_id && h.estado !== 'Idea')
      .map(h => ({ id: h.id, titulo: h.titulo }))

    // Muertos sin hito
    const narrativaConHitoMuerte = new Set((hitosM || []).map(h => h.narrativa_id))
    const muertosSinHito = (muertos || []).filter(m => !narrativaConHitoMuerte.has(m.personaje_id))
      .map(m => ({ id: m.personaje_id, nombre: m.personajes?.nombre }))

    consistencia.value = { bloqueos, listosParaPublicar, sinCapitulo, muertosSinHito }
  } finally {
    loadingCons.value = false
  }
}

// ── Borradores ──
async function verBorradores() {
  vista.value = 'borradores'; loadingBorr.value = true; hojaActual.value = null
  try {
    const [{ data: caps }, { data: actos }, { data: hojasBorr }] = await Promise.all([
      supabase.from('capitulos').select('id, numero, titulo').eq('visible', false).order('numero'),
      supabase.from('actos').select('id, nombre, estado, capitulo_id, capitulos(titulo)').eq('estado', 'Pendiente').order('nombre'),
      supabase.from('trama_hojas').select('id, titulo, estado').in('estado', ['Idea', 'En_desarrollo']).order('estado'),
    ])
    borradores.value = { capitulos: caps ?? [], actos: actos ?? [], hojas: hojasBorr ?? [] }
  } finally {
    loadingBorr.value = false
  }
}

async function publicarCapitulo(id) {
  await supabase.from('capitulos').update({ visible: true }).eq('id', id)
  await verBorradores()
}
async function publicarActo(id) {
  await supabase.from('actos').update({ estado: 'Completado' }).eq('id', id)
  await verBorradores()
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
<style scoped>
.taller-wrap {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 0;
  height: calc(100vh - 110px);
  margin: -2rem -1.5rem -6rem;
}
@media (max-width:900px) {
  .taller-wrap { grid-template-columns:1fr; height:auto; margin:0; }
}

/* Tree */
.tree-panel { background:#0e0b07; border-right:1px solid #2a2010; display:flex; flex-direction:column; overflow:hidden; }
.tree-header { padding:12px 14px; border-bottom:1px solid #2a2010; display:flex; justify-content:space-between; align-items:center; }
.tree-title  { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.2em; color:#c8a84b; text-transform:uppercase; }
.btn-nuevo-arco { font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.1em; background:transparent; border:1px solid #2a2010; color:#5a4a30; padding:4px 10px; cursor:pointer; border-radius:2px; transition:all 0.2s; }
.btn-nuevo-arco:hover { border-color:#c8a84b; color:#c8a84b; }

.tree-scroll { flex:1; overflow-y:auto; padding:8px 0; scrollbar-width:thin; scrollbar-color:#2a2010 transparent; }
.tree-loading { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; color:#3a2a10; padding:20px 16px; }
.tree-empty   { color:#3a2a10; font-style:italic; font-size:0.85rem; padding:16px; font-family:'Crimson Pro',serif; }

.arco-group  { margin-bottom:2px; }
.arco-header { display:flex; align-items:center; gap:8px; padding:8px 14px; cursor:pointer; border-left:3px solid transparent; transition:background 0.15s; }
.arco-header:hover { background:#16120c; }
.arco-expand { font-size:0.65rem; color:#4a3a20; flex-shrink:0; }
.arco-nombre { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.08em; color:#a89070; flex:1; }
.arco-badge  { font-family:'Cinzel',serif; font-size:8px; color:#3a2a10; }

.hojas-list { padding-left:16px; }
.hoja-item  { display:flex; align-items:center; gap:8px; padding:6px 12px; cursor:pointer; font-family:'Crimson Pro',serif; font-size:0.88rem; color:#5a4a30; transition:background 0.15s; border-radius:2px; }
.hoja-item:hover, .hoja-item.active { background:#16120c; color:#c8b890; }
.hoja-dot { width:7px; height:7px; border-radius:50%; background:#2a2010; flex-shrink:0; }
.hoja-item.estado-listo .hoja-dot { background:#4a8a40; }
.hoja-item.estado-publicado .hoja-dot { background:#c8a84b; }
.hoja-item.estado-en-revision .hoja-dot { background:#4a60a0; }
.hoja-item.estado-idea .hoja-dot { background:#2a2010; }
.hoja-titulo { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

.btn-nueva-hoja { width:100%; text-align:left; padding:5px 12px; font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.1em; color:#3a2a10; background:none; border:none; cursor:pointer; transition:color 0.2s; }
.btn-nueva-hoja:hover { color:#c8a84b; }

.tree-footer { border-top:1px solid #2a2010; display:flex; gap:2px; padding:6px; }
.btn-footer { flex:1; background:transparent; border:1px solid #2a2010; color:#4a3a20; font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.08em; padding:7px 4px; cursor:pointer; border-radius:2px; transition:all 0.2s; text-align:center; }
.btn-footer:hover { border-color:#c8a84b; color:#c8a84b; }

/* Main */
.taller-main { background:#0e0b07; padding:24px 28px; overflow-y:auto; }

.hoja-toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #1e1810; flex-wrap:wrap; gap:8px; }
.hoja-titulo-h { font-family:'Cinzel',serif; font-size:1rem; color:#f0e4c0; letter-spacing:0.06em; }
.hoja-error    { color:#e24b4a; font-size:0.85rem; font-style:italic; margin-bottom:10px; }
.hoja-form { display:flex; flex-direction:column; gap:10px; }

.btn-guardar  { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; padding:8px 16px; background:#c8a84b; color:#0e0b07; border:none; border-radius:2px; cursor:pointer; transition:background 0.2s; }
.btn-guardar:hover:not(:disabled) { background:#e0c060; }
.btn-guardar:disabled { opacity:0.4; cursor:not-allowed; }
.btn-eliminar { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; padding:8px 16px; background:transparent; border:1px solid #3a1a10; color:#6a3030; border-radius:2px; cursor:pointer; transition:all 0.2s; }
.btn-eliminar:hover { background:#e24b4a; border-color:#e24b4a; color:#fff; }

/* Sub-sections */
.sub-section { background:#12100a; border:1px solid #2a2010; border-left:2px solid #c8a84b40; border-radius:3px; padding:14px 16px; margin-top:4px; }
.sub-title { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; text-transform:uppercase; color:#c8a84b; opacity:0.7; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #2a2010; }
.sub-empty { color:#3a2a10; font-style:italic; font-size:0.85rem; font-family:'Crimson Pro',serif; margin-bottom:8px; }
.sub-row { display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px solid #1a1408; }
.sub-row:last-of-type { border-bottom:none; }
.sub-avatar    { width:28px; height:28px; border-radius:2px; object-fit:cover; object-position:top; border:1px solid #2a2010; flex-shrink:0; }
.sub-avatar-ph { width:28px; height:28px; border-radius:2px; background:#1e1810; border:1px solid #2a2010; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif; font-size:0.75rem; color:#4a3a20; flex-shrink:0; }
.sub-info { flex:1; display:flex; flex-direction:column; gap:2px; }
.sub-nombre { font-family:'Crimson Pro',serif; font-size:0.95rem; color:#c8b890; }
.sub-meta   { font-family:'Crimson Pro',serif; font-size:0.78rem; color:#4a3a20; font-style:italic; }
.sub-remove { background:transparent; border:1px solid #3a1a10; color:#4a3030; font-size:0.7rem; padding:3px 7px; border-radius:2px; cursor:pointer; transition:all 0.2s; margin-left:auto; }
.sub-remove:hover { background:#e24b4a; border-color:#e24b4a; color:#fff; }
.sub-add { display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:10px; padding-top:10px; border-top:1px dashed #2a2010; }

.taller-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; height:60%; gap:16px; color:#2a2010; }
.taller-empty span { font-size:1.5rem; }
.taller-empty p { font-family:'Crimson Pro',serif; font-style:italic; font-size:0.95rem; }

/* Panel title */
.panel-title { font-family:'Cinzel',serif; font-size:1rem; color:#c8a84b; letter-spacing:0.06em; margin-bottom:1.5rem; }

/* Consistencia */
.cons-section { margin-bottom:1.5rem; }
.cons-label   { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; text-transform:uppercase; color:#5a4a30; margin-bottom:8px; }
.cons-item    { background:#12100a; border-left:3px solid #2a2010; padding:8px 12px; margin-bottom:4px; border-radius:0 2px 2px 0; }
.cons-item.red    { border-left-color:#e24b4a; }
.cons-item.green  { border-left-color:#4a8a40; }
.cons-item.yellow { border-left-color:#c8a84b; }
.cons-nombre { font-family:'Crimson Pro',serif; font-size:0.95rem; color:#c8b890; display:block; }
.cons-sub    { font-family:'Crimson Pro',serif; font-size:0.82rem; color:#4a3a20; font-style:italic; }
.cons-ok { color:#4a8a40; font-style:italic; font-family:'Crimson Pro',serif; padding:1rem 0; }

/* Borradores */
.borr-row    { display:flex; align-items:center; gap:12px; padding:8px 12px; background:#12100a; border:1px solid #1e1810; margin-bottom:4px; border-radius:2px; font-family:'Crimson Pro',serif; font-size:0.95rem; color:#c8b890; flex-wrap:wrap; }
.borr-estado { font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.1em; border:1px solid #2a2010; padding:2px 7px; color:#5a4a30; border-radius:2px; }
.btn-pub     { font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.1em; background:#c8a84b; border:none; color:#0e0b07; padding:5px 12px; cursor:pointer; border-radius:2px; margin-left:auto; transition:background 0.2s; }
.btn-pub:hover { background:#e0c060; }

/* Modal */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:999; }
.modal-box     { background:#12100a; border:1px solid #2a2010; border-top:2px solid #c8a84b; padding:24px; width:100%; max-width:400px; display:flex; flex-direction:column; gap:12px; border-radius:2px; }
.modal-title   { font-family:'Cinzel',serif; font-size:0.9rem; color:#f0e4c0; letter-spacing:0.06em; }
.color-pick    { width:100%; height:36px; border:1px solid #2a2010; background:#0e0b07; border-radius:2px; cursor:pointer; padding:2px; }
</style>
