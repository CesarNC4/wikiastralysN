<template>
  <div class="section" v-if="contenido">
    <div class="section-header">
      <span class="section-title">{{ titulo }}</span>
      <div class="section-line"></div>
    </div>
    <p class="prose">{{ contenido }}</p>
  </div>
</template>

<script setup>
defineProps({
  titulo: String,
  contenido: String
})
</script>

<style scoped>
.section { margin-bottom: 2rem; }

.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.25em;
  color: #c8a84b;
  text-transform: uppercase;
  white-space: nowrap;
}

.section-line { flex: 1; height: 1px; background: linear-gradient(90deg, #2a2010, transparent); }

.prose { font-size: 1.05rem; line-height: 1.8; color: #c8b890; }
</style>