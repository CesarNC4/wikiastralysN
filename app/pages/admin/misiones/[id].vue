<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/misiones" class="btn-back">← Misiones</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Misión' : 'Nueva Misión' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/misiones/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/misiones')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Información General</div>
          <div class="f-group">
            <label class="f-lbl">Nombre *</label>
            <input class="f-inp" v-model="f.nombre" />
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Tipo</label>
              <select class="f-inp" v-model="f.tipo">
                <option>Abierta</option><option>Historia</option><option>Gremio</option>
                <option>Personal</option><option>Urgente</option><option>Secreta</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Estado</label>
              <select class="f-inp" v-model="f.estado">
                <option>Disponible</option><option>En_Progreso</option><option>Completada</option>
                <option>Fallida</option><option>Cancelada</option>
              </select>
            </div>
          </div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Nivel de Riesgo</label>
              <select class="f-inp" v-model="f.nivel_riesgo">
                <option v-for="n in ['F','E','D','C','B','A','S']" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-lbl">Rango Mínimo</label>
              <input class="f-inp" v-model="f.rango_minimo" placeholder="Ej: D, C, B..." />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción</label>
            <textarea class="f-area" v-model="f.descripcion" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Objetivo</label>
            <textarea class="f-area" v-model="f.objetivo" rows="4"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Recompensa</label>
            <textarea class="f-area" v-model="f.recompensa" rows="3"></textarea>
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Detalles</div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Ubicación</label>
              <input class="f-inp" v-model="f.ubicacion" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Fecha Lore</label>
              <input class="f-inp" v-model="f.fecha_lore" placeholder="Ej: Año 342" />
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Personaje Asociado</label>
            <div class="autocomplete-wrap">
              <input v-model="pjBusqueda" placeholder="Buscar personaje..." class="f-inp"
                @input="filtrarPjs" autocomplete="off" />
              <div v-if="pjsFiltrados.length" class="autocomplete-list">
                <div v-for="p in pjsFiltrados" :key="p.id" class="autocomplete-item"
                  @mousedown.prevent="seleccionarPj(p)">{{ p.nombre }}</div>
              </div>
            </div>
            <p v-if="f.personaje_id" class="hint">Vinculado: {{ pjNombre }}
              <button style="font-size:0.75rem;margin-left:8px;background:transparent;border:none;color:#e24b4a;cursor:pointer"
                @click="f.personaje_id = null; pjBusqueda = ''">✕ Quitar</button>
            </p>
          </div>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imagen</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/misiones" />
          </div>
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
  nombre: '', tipo: 'Abierta', estado: 'Disponible', nivel_riesgo: 'D',
  rango_minimo: '', descripcion: '', objetivo: '', recompensa: '',
  ubicacion: '', fecha_lore: '', personaje_id: null, imagen_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('misiones', f)

const todosPersonajes = ref([])
onMounted(async () => {
  await cargar()
  const { data } = await supabase.from('personajes').select('id, nombre').order('nombre')
  todosPersonajes.value = data ?? []
})

const pjBusqueda   = ref('')
const pjsFiltrados = ref([])
const pjNombre     = computed(() => todosPersonajes.value.find(p => p.id === f.value.personaje_id)?.nombre ?? '')

function filtrarPjs() {
  const q = pjBusqueda.value.toLowerCase()
  pjsFiltrados.value = todosPersonajes.value.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarPj(p) {
  f.value.personaje_id = p.id; pjBusqueda.value = p.nombre; pjsFiltrados.value = []
}
</script>
<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
