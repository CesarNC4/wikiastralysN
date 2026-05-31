import { useToast } from './useToast'

// ── Validación de campos ────────────────────────────────────────────────────

type FieldRule =
  | { type: 'required' }
  | { type: 'number'; min?: number; max?: number }
  | { type: 'url' }

interface FieldDef {
  key: string
  label: string
  rules: FieldRule[]
}

function validateFields(fields: Record<string, any>, defs: FieldDef[]): string {
  for (const def of defs) {
    const val = fields[def.key]
    for (const rule of def.rules) {
      if (rule.type === 'required') {
        if (val === null || val === undefined || String(val).trim() === '') {
          return `El campo "${def.label}" es obligatorio.`
        }
      }
      if (rule.type === 'number' && val !== null && val !== undefined && val !== '') {
        const n = Number(val)
        if (isNaN(n)) {
          return `"${def.label}" debe ser un número.`
        }
        if (rule.min !== undefined && n < rule.min) {
          return `"${def.label}" debe ser mayor o igual a ${rule.min}.`
        }
        if (rule.max !== undefined && n > rule.max) {
          return `"${def.label}" debe ser menor o igual a ${rule.max}.`
        }
      }
      if (rule.type === 'url' && val) {
        try { new URL(val) } catch {
          return `"${def.label}" debe ser una URL válida (ej: https://...).`
        }
      }
    }
  }
  return ''
}

// ── useAdminForm ────────────────────────────────────────────────────────────

/**
 * @param table        Nombre de la tabla en Supabase
 * @param fields       ref con los valores del formulario
 * @param validations  Opcional: array de FieldDef para validación extendida
 */
export function useAdminForm(
  table: string,
  fields: any,
  validations: FieldDef[] = []
) {
  const supabase = useSupabaseClient()
  const router   = useRouter()
  const route    = useRoute()
  const toast    = useToast()

  const id      = computed(() => route.params.id === 'nuevo' ? null : route.params.id)
  const isEdit  = computed(() => !!id.value)
  const loading = ref(false)
  const saving  = ref(false)
  const error   = ref('')

  const _snapshot = ref('')
  const isDirty   = computed(() => _snapshot.value !== '' && JSON.stringify(fields.value) !== _snapshot.value)

  function _snap() { _snapshot.value = JSON.stringify(fields.value) }

  onBeforeRouteLeave(() => {
    if (isDirty.value && !saving.value) {
      return confirm('Tienes cambios sin guardar. ¿Salir de todas formas?')
    }
  })

  async function cargar() {
    if (!isEdit.value) { _snap(); return }
    loading.value = true
    error.value   = ''
    try {
      const { data, error: err } = await supabase
        .from(table)
        .select('*')
        .eq('id', id.value as string)
        .single()
      if (err) throw err
      Object.keys(fields.value).forEach(k => {
        if (data[k] !== undefined && data[k] !== null) fields.value[k] = data[k]
      })
      _snap()
    } catch (e: any) {
      error.value = e.message || 'Error al cargar.'
    } finally {
      loading.value = false
    }
  }

  async function guardar(backPath: string, required = 'nombre') {
    error.value = ''

    const reqVal = fields.value[required]
    if (typeof reqVal === 'string' && !reqVal.trim()) {
      error.value = `El campo "${required}" es obligatorio.`
      return
    }

    if (validations.length) {
      const validationError = validateFields(fields.value, validations)
      if (validationError) { error.value = validationError; return }
    }

    saving.value = true
    try {
      if (isEdit.value) {
        const { error: err } = await supabase
          .from(table)
          .update(fields.value)
          .eq('id', id.value as string)
        if (err) throw err
        _snap()
        toast.show('Guardado correctamente.')
      } else {
        const { error: err } = await supabase
          .from(table)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(fields.value as any)
        if (err) throw err
        _snap()
        router.push(backPath)
      }
    } catch (e: any) {
      error.value = e.message || 'Error al guardar.'
    } finally {
      saving.value = false
    }
  }

  return { id, isEdit, loading, saving, error, isDirty, cargar, guardar }
}

// ── useAdminList ────────────────────────────────────────────────────────────

export function useAdminList(
  table: string,
  select = 'id, nombre',
  orderBy = 'nombre'
) {
  const supabase    = useSupabaseClient()
  const loading     = ref(false)
  const deleteError = ref('')
  const items       = ref<any[]>([])
  const total       = ref(0)
  const page        = ref(1)
  const pageSize    = 20

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

  async function cargarLista() {
    loading.value = true
    const from = (page.value - 1) * pageSize
    const to   = from + pageSize - 1
    const { data, count, error } = await supabase
      .from(table)
      .select(select, { count: 'exact' })
      .order(orderBy)
      .range(from, to)
    if (error) console.error(`[useAdminList] ${table}:`, error)
    items.value   = data ?? []
    total.value   = count ?? 0
    loading.value = false
  }

  async function irAPagina(n: number) {
    page.value = Math.min(Math.max(1, n), totalPages.value)
    await cargarLista()
  }

  async function eliminar(row: any, nombreCampo = 'nombre') {
    const nombre = row[nombreCampo] || row.titulo || `#${row.id}`
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return
    deleteError.value = ''
    const { error } = await supabase.from(table).delete().eq('id', row.id)
    if (error) {
      deleteError.value = error.message
    } else {
      if (items.value.length === 1 && page.value > 1) page.value--
      await cargarLista()
    }
  }

  async function duplicar(row: any, nombreCampo = 'nombre') {
    const { id: _id, ...rest } = row
    const campoNombre = nombreCampo === 'titulo' ? 'titulo' : 'nombre'
    if (rest[campoNombre] !== undefined) rest[campoNombre] = (rest[campoNombre] || '') + ' — Copia'
    const { error } = await supabase.from(table).insert(rest as any)
    if (error) { deleteError.value = error.message } else { await cargarLista() }
  }

  onMounted(cargarLista)

  return { items, loading, deleteError, eliminar, duplicar, cargarLista, page, total, totalPages, pageSize, irAPagina }
}