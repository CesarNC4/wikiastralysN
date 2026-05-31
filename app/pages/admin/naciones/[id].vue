<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/naciones" class="btn-back">← Naciones</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Nación' : 'Nueva Nación' }}</h1>
      <div style="display:flex;gap:8px;margin-left:auto">
        <NuxtLink v-if="isEdit" :to="`/naciones/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/naciones')">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <!-- Columna principal -->
      <div>
        <div class="section">
          <div class="sec-title">Identidad</div>
          <Field label="Nombre *"><input v-model="f.nombre" /></Field>
          <Field label="Subtítulo"><input v-model="f.subtitulo" placeholder="Ej: La Nación del Fuego Eterno" /></Field>
          <Field label="Descripción breve"><textarea v-model="f.descripcion" rows="3" /></Field>
        </div>

        <div class="section">
          <div class="sec-title">Lore Divino</div>
          <div class="row2">
            <Field label="Elemento Fundamental">
              <select v-model="f.elemento_fundamental">
                <option value="">— Sin asignar —</option>
                <option value="Pyro">🔥 Pyro</option>
                <option value="Hydro">💧 Hydro</option>
                <option value="Electro">⚡ Electro</option>
                <option value="Cryo">❄️ Cryo</option>
                <option value="Dendro">🌿 Dendro</option>
                <option value="Vento">🌪️ Vento</option>
                <option value="Geo">🪨 Geo</option>
              </select>
            </Field>
            <Field label="Concepto Divino"><input v-model="f.concepto_divino" placeholder="Ej: Contratos, Eternidad..." /></Field>
          </div>
          <Field label="Dios Fundador"><input v-model="f.dios_fundador" /></Field>
        </div>

        <div class="section">
          <div class="sec-title">Datos</div>
          <div class="row2">
            <Field label="Capital"><input v-model="f.capital" /></Field>
            <Field label="Gobierno"><input v-model="f.gobierno" /></Field>
          </div>
          <div class="row2">
            <Field label="Idioma"><input v-model="f.idioma" /></Field>
            <Field label="Población"><input v-model="f.poblacion" /></Field>
          </div>
        </div>

        <div class="section">
          <div class="sec-title">Historia y Sociedad</div>
          <Field label="Historia"><textarea v-model="f.historia" rows="6" /></Field>
          <Field label="Estructura y Sociedad"><textarea v-model="f.estructura" rows="5" /></Field>
          <Field label="Estado Actual"><textarea v-model="f.estado_actual" rows="4" /></Field>
        </div>

        <!-- Razas — solo si ya existe el registro -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Razas Presentes</div>
          <div v-if="!nacionRazas.length" class="rel-empty">Sin razas asignadas.</div>
          <div v-for="nr in nacionRazas" :key="nr.id" class="rel-row">
            <span class="rel-tag">{{ nr.tipo || 'Nativa' }}</span>
            <span class="rel-name">{{ nr.razaNombre }}</span>
            <button class="rel-remove" @click="quitarRaza(nr)">✕</button>
          </div>
          <div class="rel-add">
            <div class="autocomplete-wrap">
              <input v-model="razaBusqueda" placeholder="Buscar raza..." class="rel-input"
                @input="filtrarRazas" autocomplete="off" />
              <div v-if="razasFiltradas.length" class="autocomplete-list">
                <div v-for="r in razasFiltradas" :key="r.id" class="autocomplete-item"
                  @mousedown.prevent="seleccionarRaza(r)">{{ r.nombre }}</div>
              </div>
            </div>
            <select v-model="nuevaRaza.tipo" class="rel-select">
              <option value="Nativa">Nativa</option>
              <option value="Migrante">Migrante</option>
              <option value="Minoritaria">Minoritaria</option>
              <option value="Exiliada">Exiliada</option>
            </select>
            <button class="btn-rel-add" :disabled="!nuevaRaza.raza_id" @click="agregarRaza">+ Agregar</button>
          </div>
          <p v-if="relMsg" class="rel-msg" :class="relOk ? 'ok' : 'err'">{{ relMsg }}</p>
        </div>

        <!-- Organizaciones — solo si ya existe el registro -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Organizaciones Presentes</div>
          <div v-if="!nacionOrgs.length" class="rel-empty">Sin organizaciones asignadas.</div>
          <div v-for="no in nacionOrgs" :key="no.id" class="rel-row">
            <span class="rel-tag">{{ no.tipo || 'Opera_en' }}</span>
            <span class="rel-name">{{ no.orgNombre }}</span>
            <button class="rel-remove" @click="quitarOrg(no)">✕</button>
          </div>
          <div class="rel-add">
            <div class="autocomplete-wrap">
              <input v-model="orgBusqueda" placeholder="Buscar organización..." class="rel-input"
                @input="filtrarOrgs" autocomplete="off" />
              <div v-if="orgsFiltradas.length" class="autocomplete-list">
                <div v-for="o in orgsFiltradas" :key="o.id" class="autocomplete-item"
                  @mousedown.prevent="seleccionarOrg(o)">{{ o.nombre }}</div>
              </div>
            </div>
            <select v-model="nuevaOrg.tipo" class="rel-select">
              <option value="Opera_en">Opera en</option>
              <option value="Con_sede">Con sede</option>
              <option value="Aliada">Aliada</option>
              <option value="Rival">Rival</option>
              <option value="Enemiga">Enemiga</option>
            </select>
            <button class="btn-rel-add" :disabled="!nuevaOrg.organizacion_id" @click="agregarOrg">+ Agregar</button>
          </div>
          <p v-if="relMsg" class="rel-msg" :class="relOk ? 'ok' : 'err'">{{ relMsg }}</p>
        </div>

        <p v-if="!isEdit" class="hint">💡 Guarda la nación primero para poder asignar razas y organizaciones.</p>
      </div>

      <!-- Columna lateral -->
      <div>
        <div class="section">
          <div class="sec-title">Imágenes</div>
          <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/naciones" />
            </Field>
            <Field label="Banner">
              <CloudinaryUpload v-model="f.banner_url" label="Banner" icon="🖼" folder="wikiastralys/naciones/banners" />
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
  nombre: '', subtitulo: '', descripcion: '', historia: '',
  gobierno: '', capital: '', idioma: '', poblacion: '',
  elemento_fundamental: '', concepto_divino: '', dios_fundador: '',
  estado_actual: '', estructura: '', imagen_url: '', banner_url: '', visible: true,
})

const { id, isEdit, loading, saving, error, cargar, guardar } = useAdminForm('naciones', f)
onMounted(async () => {
  await cargar()
  await Promise.all([cargarCatalogos(), cargarRelaciones()])
})

// ── Catálogos ──
const todasRazas = ref([])
const todasOrgs  = ref([])

async function cargarCatalogos() {
  const [{ data: r }, { data: o }] = await Promise.all([
    supabase.from('razas').select('id, nombre').order('nombre'),
    supabase.from('organizaciones').select('id, nombre').order('nombre'),
  ])
  todasRazas.value = r ?? []
  todasOrgs.value  = o ?? []
}

// ── Relaciones actuales ──
const nacionRazas = ref([])
const nacionOrgs  = ref([])

async function cargarRelaciones() {
  if (!isEdit.value) return
  const [{ data: nr }, { data: no }] = await Promise.all([
    supabase.from('nacion_raza')
      .select('id, tipo, raza_id, razas(nombre)')
      .eq('nacion_id', id.value),
    supabase.from('nacion_organizacion')
      .select('id, tipo, organizacion_id, organizaciones(nombre)')
      .eq('nacion_id', id.value),
  ])
  nacionRazas.value = (nr ?? []).map(x => ({ ...x, razaNombre: x.razas?.nombre }))
  nacionOrgs.value  = (no ?? []).map(x => ({ ...x, orgNombre: x.organizaciones?.nombre }))
}

// ── Autocomplete razas ──
const razaBusqueda  = ref('')
const razasFiltradas = ref([])
const nuevaRaza = ref({ raza_id: null, tipo: 'Nativa' })

function filtrarRazas() {
  const q = razaBusqueda.value.toLowerCase()
  razasFiltradas.value = q.length < 1
    ? todasRazas.value.slice(0, 8)
    : todasRazas.value.filter(r => r.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarRaza(r) {
  nuevaRaza.value.raza_id = r.id
  razaBusqueda.value = r.nombre
  razasFiltradas.value = []
}

// ── Autocomplete orgs ──
const orgBusqueda  = ref('')
const orgsFiltradas = ref([])
const nuevaOrg = ref({ organizacion_id: null, tipo: 'Opera_en' })

function filtrarOrgs() {
  const q = orgBusqueda.value.toLowerCase()
  orgsFiltradas.value = q.length < 1
    ? todasOrgs.value.slice(0, 8)
    : todasOrgs.value.filter(o => o.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarOrg(o) {
  nuevaOrg.value.organizacion_id = o.id
  orgBusqueda.value = o.nombre
  orgsFiltradas.value = []
}

// ── CRUD relaciones ──
const relMsg = ref('')
const relOk  = ref(true)
function showMsg(msg, ok = true) {
  relMsg.value = msg; relOk.value = ok
  setTimeout(() => relMsg.value = '', 3000)
}

async function agregarRaza() {
  if (!nuevaRaza.value.raza_id) return
  const { error } = await supabase.from('nacion_raza').insert({
    nacion_id: id.value, raza_id: nuevaRaza.value.raza_id, tipo: nuevaRaza.value.tipo,
  })
  if (error) { showMsg(error.message, false); return }
  nuevaRaza.value = { raza_id: null, tipo: 'Nativa' }; razaBusqueda.value = ''
  await cargarRelaciones(); showMsg('Raza agregada.')
}

async function quitarRaza(nr) {
  if (!confirm(`¿Quitar ${nr.razaNombre}?`)) return
  await supabase.from('nacion_raza').delete().eq('id', nr.id)
  await cargarRelaciones(); showMsg('Raza eliminada.')
}

async function agregarOrg() {
  if (!nuevaOrg.value.organizacion_id) return
  const { error } = await supabase.from('nacion_organizacion').insert({
    nacion_id: id.value, organizacion_id: nuevaOrg.value.organizacion_id, tipo: nuevaOrg.value.tipo,
  })
  if (error) { showMsg(error.message, false); return }
  nuevaOrg.value = { organizacion_id: null, tipo: 'Opera_en' }; orgBusqueda.value = ''
  await cargarRelaciones(); showMsg('Organización agregada.')
}

async function quitarOrg(no) {
  if (!confirm(`¿Quitar ${no.orgNombre}?`)) return
  await supabase.from('nacion_organizacion').delete().eq('id', no.id)
  await cargarRelaciones(); showMsg('Organización eliminada.')
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
