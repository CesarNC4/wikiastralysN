<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/notas" class="btn-back">← Notas</NuxtLink>
      <h1 class="form-title">{{ isEdit ? 'Editar Nota Privada' : 'Nueva Nota Privada' }}</h1>
      <button class="btn-save" :disabled="saving" @click="guardarNota">
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div v-if="loading" class="loading-msg">Cargando...</div>

    <div v-else class="form-grid-single">
      <div class="section">
        <div class="sec-title">Referencia</div>
        <div class="row2">
          <Field label="Tipo de Entidad">
            <select v-model="f.entidad_tipo">
              <option>personaje</option><option>capitulo</option><option>nacion</option>
              <option>raza</option><option>organizacion</option><option>familia</option>
              <option>bestia</option><option>lord_demonio</option><option>arma</option>
              <option>magia</option><option>mineral</option><option>mision</option>
              <option>concepto</option><option>lore</option><option>general</option>
            </select>
          </Field>
          <Field label="ID de la Entidad">
            <input type="number" v-model.number="f.entidad_id" placeholder="ID del registro" />
          </Field>
        </div>
        <p class="hint">Esta nota solo es visible en el panel admin. Sirve para apuntes del autor.</p>
      </div>

      <div class="section">
        <div class="sec-title">Contenido</div>
        <Field label="Nota *">
          <textarea v-model="f.contenido" rows="16"
            placeholder="Apuntes privados, spoilers, decisiones narrativas pendientes..." />
        </Field>
      </div>

      <div v-if="isEdit" class="section">
        <div class="sec-title">Metadatos</div>
        <p class="hint">
          Creado: {{ formatDate(meta.creado_en) }} |
          Actualizado: {{ formatDate(meta.actualizado_en) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const supabase = useSupabaseClient()
const router   = useRouter()
const route    = useRoute()

const id     = computed(() => route.params.id === 'nueva' ? null : route.params.id)
const isEdit = computed(() => !!id.value)

const loading = ref(false)
const saving  = ref(false)
const error   = ref('')

const f = ref({ entidad_tipo: 'general', entidad_id: null, contenido: '' })
const meta = ref({ creado_en: null, actualizado_en: null })

onMounted(async () => {
  if (!isEdit.value) return
  loading.value = true
  const { data } = await supabase.from('nota_privada').select('*').eq('id', id.value).single()
  if (data) {
    f.value.entidad_tipo = data.entidad_tipo
    f.value.entidad_id   = data.entidad_id
    f.value.contenido    = data.contenido
    meta.value = { creado_en: data.creado_en, actualizado_en: data.actualizado_en }
  }
  loading.value = false
})

async function guardarNota() {
  if (!f.value.contenido.trim()) { error.value = 'El contenido es obligatorio.'; return }
  saving.value = true; error.value = ''
  try {
    if (isEdit.value) {
      const { error: err } = await supabase.from('nota_privada')
        .update({ entidad_tipo: f.value.entidad_tipo, entidad_id: f.value.entidad_id, contenido: f.value.contenido, actualizado_en: new Date().toISOString() })
        .eq('id', id.value)
      if (err) throw err
    } else {
      const { error: err } = await supabase.from('nota_privada').insert(f.value)
      if (err) throw err
    }
    router.push('/admin/notas')
  } catch (e) {
    error.value = e.message || 'Error al guardar.'
  } finally {
    saving.value = false
  }
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('es', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
