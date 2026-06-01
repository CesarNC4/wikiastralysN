<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/capitulos" class="btn-back">← Capítulos</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Acto' : 'Nuevo Acto' }}</h1>
      <div class="form-header-actions">
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/capitulos', 'nombre')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Identificación</div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Nombre *</label>
              <input class="f-inp" v-model="f.nombre" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Número de Orden</label>
              <input class="f-inp" type="number" v-model.number="f.numero_orden" placeholder="1" />
            </div>
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Estado</label>
              <select class="f-inp" v-model="f.estado">
                <option value="Borrador">Borrador</option>
                <option value="En_revision">En revisión</option>
                <option value="Publicado">Publicado</option>
                <option value="Archivado">Archivado</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Capítulo</label>
              <select class="f-inp" v-model="f.capitulo_id">
                <option :value="null">— Sin capítulo —</option>
                <option v-for="c in todosCapitulos" :key="c.id" :value="c.id">
                  Cap. {{ c.numero }} — {{ c.titulo }}
                </option>
              </select>
            </div>
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Fecha Inicio Lore</label>
              <input class="f-inp" v-model="f.fecha_inicio_lore" placeholder="Ej: Año 340, Día 1..." />
            </div>
            <div class="f-group">
              <label class="f-lbl">Fecha Fin Lore</label>
              <input class="f-inp" v-model="f.fecha_fin_lore" placeholder="Ej: Año 340, Día 7..." />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción</label>
            <textarea class="f-area" v-model="f.descripcion" rows="6"></textarea>
          </div>
        </div>

        <!-- Canciones del acto -->
        <div class="section" v-if="isEdit">
          <div class="sec-title">Canciones del Acto</div>
          <div v-for="ac in actoCanciones" :key="ac.id" class="rel-row">
            <span class="rel-name">{{ ac.cancionTitulo }}</span>
            <span v-if="ac.contexto" class="rel-tag">{{ ac.contexto }}</span>
            <button class="rel-remove" @click="quitarCancion(ac)">✕</button>
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
            <input v-model="nuevaActoCancion.contexto" placeholder="Contexto (opcional)" class="rel-input" style="flex:1" />
            <button class="btn-rel-add" :disabled="!nuevaActoCancion.cancion_id" @click="agregarCancion">+ Agregar</button>
          </div>
        </div>

        <p v-if="!isEdit" class="hint">💡 Guarda el acto primero para gestionar sus canciones.</p>
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
  nombre: '', numero_orden: 1, estado: 'Borrador', capitulo_id: null,
  fecha_inicio_lore: '', fecha_fin_lore: '', descripcion: '', visible: true,
})

const { id, isEdit, loading, saving, error, cargar, guardar } = useAdminForm('actos', f)

const todosCapitulos  = ref([])
const todasCanciones  = ref([])
const actoCanciones   = ref([])

onMounted(async () => {
  await cargar()
  const [{ data: caps }, { data: cans }] = await Promise.all([
    supabase.from('capitulos').select('id, numero, titulo').order('numero'),
    supabase.from('canciones').select('id, titulo').order('titulo'),
  ])
  todosCapitulos.value = caps ?? []
  todasCanciones.value = cans ?? []
  if (isEdit.value) await cargarSubtablas()
})

async function cargarSubtablas() {
  const { data } = await supabase
    .from('acto_cancion')
    .select('id, contexto, cancion_id, canciones(titulo)')
    .eq('acto_id', id.value)
  actoCanciones.value = (data ?? []).map(x => ({ ...x, cancionTitulo: x.canciones?.titulo }))
}

// ── Canciones ──
const cancionBusqueda    = ref('')
const cancionesFiltradas = ref([])
const nuevaActoCancion   = ref({ cancion_id: null, contexto: '' })

function filtrarCanciones() {
  const q = cancionBusqueda.value.toLowerCase()
  cancionesFiltradas.value = todasCanciones.value.filter(c => c.titulo.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarCancion(c) {
  nuevaActoCancion.value.cancion_id = c.id
  cancionBusqueda.value = c.titulo
  cancionesFiltradas.value = []
}
async function agregarCancion() {
  if (!nuevaActoCancion.value.cancion_id) return
  await supabase.from('acto_cancion').insert({ acto_id: id.value, ...nuevaActoCancion.value })
  nuevaActoCancion.value = { cancion_id: null, contexto: '' }
  cancionBusqueda.value = ''
  await cargarSubtablas()
}
async function quitarCancion(ac) {
  await supabase.from('acto_cancion').delete().eq('id', ac.id)
  await cargarSubtablas()
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
