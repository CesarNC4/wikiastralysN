<template>
  <div class="field">
    <label class="field-label">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup>
defineProps({ label: { type: String, required: true } })
</script>

<style scoped>
/* Estilos propios del componente — independientes de admin-form.css */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.field-label {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--t2);
  display: block;
}
</style>
