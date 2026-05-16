<template>
  <div>
    <p>{{ test }}</p>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { data, error } = await supabase
  .from('personajes')
  .select('nombre')
  .limit(3)

const test = error
  ? 'Error conectando a Supabase: ' + error.message
  : 'Conectado. Personajes: ' + data.map(p => p.nombre).join(', ')
</script>