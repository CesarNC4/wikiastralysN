<template>
  <div>
    <div class="form-header">
      <h1 class="form-title">Gremio de Aventureros</h1>
      <NuxtLink v-if="gremioId" :to="`/admin/gremio/${gremioId}`" class="btn-save">Editar</NuxtLink>
      <NuxtLink v-else to="/admin/gremio/nuevo" class="btn-save">Crear Gremio</NuxtLink>
    </div>
    <div v-if="loading" class="loading-msg">Cargando...</div>
    <div v-else-if="gremioId" class="section">
      <div class="sec-title">Registro existente</div>
      <p style="color:#a89070;font-family:'Crimson Pro',serif">
        El Gremio es un registro único. Haz clic en "Editar" para modificarlo.
      </p>
    </div>
    <div v-else class="section">
      <p style="color:#5a4a30;font-family:'Crimson Pro',serif;font-style:italic">
        No existe aún. Haz clic en "Crear Gremio" para comenzar.
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const supabase = useSupabaseClient()
const loading  = ref(true)
const gremioId = ref(null)

onMounted(async () => {
  const { data } = await supabase.from('gremio').select('id').limit(1).maybeSingle()
  gremioId.value = data?.id ?? null
  loading.value  = false
})
</script>

<style scoped src="~/assets/css/admin-form.css" />
