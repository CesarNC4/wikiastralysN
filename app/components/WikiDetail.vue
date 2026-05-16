<template>
  <div v-if="item">
    <div class="banner" :style="item.banner_url ? `background-image: url('${item.banner_url}')` : ''">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <div class="avatar" v-if="mostrarAvatar">
          <img v-if="item.imagen_url" :src="item.imagen_url" :alt="item.nombre" />
          <span v-else class="avatar-initial">{{ item.nombre[0] }}</span>
        </div>
        <div class="banner-info">
          <p v-if="item.subtitulo" class="subtitulo">{{ item.subtitulo }}</p>
          <h1 class="nombre">{{ item.nombre }}</h1>
          <div class="tags" v-if="tags.length">
            <span v-for="tag in tags" :key="tag.label" class="tag" :class="{ gold: tag.gold }">
              {{ tag.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <slot />
    </div>
  </div>

  <div v-else class="not-found">
    <p>No encontrado.</p>
    <NuxtLink :to="backUrl" class="back">← Volver</NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
  mostrarAvatar: { type: Boolean, default: true },
  tags: { type: Array, default: () => [] },
  backUrl: { type: String, default: '/' }
})
</script>

<style scoped>
.banner {
  position: relative;
  min-height: 260px;
  background: #12100a;
  background-size: cover;
  background-position: center top;
  display: flex;
  align-items: flex-end;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #0e0b07 0%, rgba(14,11,7,0.5) 60%, transparent 100%);
}

.banner-content {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  width: 100%;
}

.avatar {
  width: 90px;
  height: 120px;
  border: 1px solid #2a2010;
  border-radius: 4px;
  overflow: hidden;
  background: #16120c;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initial { font-family: 'Cinzel', serif; font-size: 2rem; color: #2a2010; font-weight: 700; }

.subtitulo { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.25em; color: #c8a84b; opacity: 0.8; margin-bottom: 0.25rem; }

.nombre {
  font-family: 'Cinzel', serif;
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  font-weight: 700;
  color: #f0e4c0;
  letter-spacing: 0.05em;
  line-height: 1.1;
}

.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.75rem; }
.tag { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.15em; padding: 3px 8px; border: 1px solid #2a2010; color: #5a4a30; border-radius: 2px; }
.tag.gold { border-color: #c8a84b44; color: #c8a84b; }

.content { padding: 2rem 1.5rem; }

.not-found { text-align: center; padding: 4rem 2rem; color: #4a3a20; font-style: italic; }
.back { color: #c8a84b; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.15em; }
</style>