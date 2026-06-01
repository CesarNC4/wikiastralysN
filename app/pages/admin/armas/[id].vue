<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/armas" class="btn-back">← Armas</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Arma / Artefacto' : 'Nueva Arma / Artefacto' }}</h1>
      <div class="form-header-actions">
        <NuxtLink v-if="isEdit" :to="`/armas/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardar('/admin/armas')">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else class="form-grid">
      <div>
        <div class="section">
          <div class="sec-title">Información General</div>
          <div class="row2">
            <div class="f-group">
              <label class="f-lbl">Nombre *</label>
              <input class="f-inp" v-model="f.nombre" />
            </div>
            <div class="f-group">
              <label class="f-lbl">Tipo</label>
              <select class="f-inp" v-model="f.tipo">
                <option value="">—</option>
                <optgroup label="Armas de Combate">
                  <option value="Composicion">Composición</option>
                  <option value="Activacion">Activación</option>
                  <option value="Sincronizacion">Sincronización</option>
                  <option value="Amplificacion">Amplificación</option>
                  <option value="Ignicion">Ignición</option>
                </optgroup>
                <optgroup label="Objetos y Reliquias">
                  <option value="Artefacto">Artefacto</option>
                  <option value="Reliquia">Reliquia</option>
                  <option value="Objeto_magico">Objeto Mágico</option>
                  <option value="Familiares">Familiar / Compañero</option>
                </optgroup>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          <div class="f-group">
            <label class="f-lbl">Descripción</label>
            <textarea class="f-area" v-model="f.descripcion" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Historia</label>
            <textarea class="f-area" v-model="f.historia" rows="5"></textarea>
          </div>
          <div class="f-group">
            <label class="f-lbl">Poder Especial</label>
            <textarea class="f-area" v-model="f.poder_especial" rows="4"></textarea>
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Propietario</div>
          <div class="f-group">
            <label class="f-lbl">Portador actual (texto)</label>
            <input class="f-inp" v-model="f.propietario_actual" placeholder="Nombre del portador" />
          </div>
          <div class="f-group">
            <label class="f-lbl">Propietario (personaje vinculado)</label>
            <div class="autocomplete-wrap">
              <input v-model="pjBusqueda" placeholder="Buscar personaje..." class="f-inp"
                @input="filtrarPjs" autocomplete="off" />
              <div v-if="pjsFiltrados.length" class="autocomplete-list">
                <div v-for="p in pjsFiltrados" :key="p.id" class="autocomplete-item"
                  @mousedown.prevent="seleccionarPj(p)">{{ p.nombre }}</div>
              </div>
            </div>
            <p v-if="f.propietario_id" class="hint">Vinculado: {{ pjNombre }}
              <button style="font-size:0.75rem;margin-left:8px;background:transparent;border:none;color:#e24b4a;cursor:pointer"
                @click="f.propietario_id = null; pjBusqueda = ''">✕ Quitar</button>
            </p>
          </div>
        </div>
      </div>
      <div>
        <div class="section">
          <div class="sec-title">Imagen</div>
          <div class="f-group">
            <label class="f-lbl">Imagen</label>
            <CloudinaryUpload v-model="f.imagen_url" folder="wikiastralys/armas" />
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
  nombre: '', tipo: 'Otro', descripcion: '', historia: '',
  poder_especial: '', propietario_actual: '', propietario_id: null, imagen_url: '', visible: true,
})
const { isEdit, loading, saving, error, cargar, guardar } = useAdminForm('armas_artefactos', f)

const todosPersonajes = ref([])
onMounted(async () => {
  await cargar()
  const { data } = await supabase.from('personajes').select('id, nombre').order('nombre')
  todosPersonajes.value = data ?? []
})

const pjBusqueda   = ref('')
const pjsFiltrados = ref([])
const pjNombre     = computed(() => todosPersonajes.value.find(p => p.id === f.value.propietario_id)?.nombre ?? '')

function filtrarPjs() {
  const q = pjBusqueda.value.toLowerCase()
  pjsFiltrados.value = todosPersonajes.value.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarPj(p) {
  f.value.propietario_id = p.id; pjBusqueda.value = p.nombre; pjsFiltrados.value = []
}
</script>
<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
