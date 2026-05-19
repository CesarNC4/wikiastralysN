/**
 * useAdminForm — composable compartido para todos los formularios admin simples.
 * Maneja: carga al editar, guardar (insert/update), eliminar desde lista.
 *
 * @param {string} table  — nombre de la tabla en Supabase
 * @param {object} fields — valores iniciales del formulario (ref de fuera)
 */
export function useAdminForm(table, fields) {
  const supabase = useSupabaseClient()
  const router   = useRouter()
  const route    = useRoute()

  const id      = computed(() => route.params.id === 'nuevo' ? null : route.params.id)
  const isEdit  = computed(() => !!id.value)
  const loading = ref(false)
  const saving  = ref(false)
  const error   = ref('')

  async function cargar() {
    if (!isEdit.value) return
    loading.value = true
    error.value   = ''
    try {
      const { data, error: err } = await supabase
        .from(table)
        .select('*')
        .eq('id', id.value)
        .single()
      if (err) throw err
      Object.keys(fields.value).forEach(k => {
        if (data[k] !== undefined && data[k] !== null) fields.value[k] = data[k]
      })
    } catch (e) {
      error.value = e.message || 'Error al cargar.'
    } finally {
      loading.value = false
    }
  }

  async function guardar(backPath, required = 'nombre') {
    const reqVal = fields.value[required]
    if (typeof reqVal === 'string' && !reqVal.trim()) {
      error.value = `El campo "${required}" es obligatorio.`
      return
    }
    saving.value = true
    error.value  = ''
    try {
      if (isEdit.value) {
        const { error: err } = await supabase
          .from(table)
          .update(fields.value)
          .eq('id', id.value)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from(table)
          .insert(fields.value)
        if (err) throw err
      }
      router.push(backPath)
    } catch (e) {
      error.value = e.message || 'Error al guardar.'
    } finally {
      saving.value = false
    }
  }

  return { id, isEdit, loading, saving, error, cargar, guardar }
}

/**
 * useAdminList — composable para páginas de lista con eliminar.
 * @param {string} table   — tabla Supabase
 * @param {string} select  — columnas a seleccionar
 * @param {string} orderBy — columna de orden (default 'nombre')
 */
export function useAdminList(table, select = 'id, nombre', orderBy = 'nombre') {
  const supabase    = useSupabaseClient()
  const loading     = ref(false)
  const deleteError = ref('')
  const items       = ref([])

  async function cargarLista() {
    loading.value = true
    const { data } = await supabase
      .from(table)
      .select(select)
      .order(orderBy)
    items.value   = data ?? []
    loading.value = false
  }

  async function eliminar(row, nombreCampo = 'nombre') {
    const nombre = row[nombreCampo] || row.titulo || `#${row.id}`
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return
    deleteError.value = ''
    const { error } = await supabase.from(table).delete().eq('id', row.id)
    if (error) {
      deleteError.value = error.message
    } else {
      items.value = items.value.filter(x => x.id !== row.id)
    }
  }

  onMounted(cargarLista)

  return { items, loading, deleteError, eliminar, cargarLista }
}
