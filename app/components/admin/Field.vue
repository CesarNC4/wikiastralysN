<template>
  <div class="field">
    <label class="field-label">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup>
defineProps({ label: { type: String, required: true } })
</script>
