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
            <span v-for="tag in tags" :key="tag.label" class="tag" :class="{ accent: tag.gold }">
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
  min-height: 280px;
  background: var(--s1);
  background-size: cover;
  background-position: center top;
  display: flex;
  align-items: flex-end;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--bg) 0%, rgba(6,4,15,0.55) 55%, transparent 100%);
}

.banner-content {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  padding: 2rem max(1.5rem, 5vw);
  width: 100%;
}

.avatar {
  width: 90px;
  height: 120px;
  border: 1px solid var(--bd);
  border-radius: 2px;
  overflow: hidden;
  background: var(--s2);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initial {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 300;
  color: var(--bd-strong);
}

.subtitulo {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--t3);
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.nombre {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  font-weight: 300;
  color: var(--t1);
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.75rem; }
.tag {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  padding: 3px 8px;
  border: 1px solid var(--bd);
  color: var(--t3);
  border-radius: 2px;
  text-transform: uppercase;
}
.tag.accent { border-color: rgba(196,32,64,0.3); color: var(--accent); }

.content { padding: 2rem max(1.5rem, 5vw); }

.not-found { text-align: center; padding: 4rem 2rem; color: var(--t3); font-style: italic; }
.back {
  color: var(--accent);
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.15em;
}
</style>
