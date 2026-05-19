<template>
  <div class="topbar">
    <NuxtLink to="/" class="logo">Astralys</NuxtLink>
    <NuxtLink to="/busqueda" class="search-link">🔍 Buscar</NuxtLink>
    <div class="menu-wrapper">
      <div class="menu-wrapper" ref="menuWrapper"></div>
      <button class="menu-btn" @click="toggleMenu"> 
        <span class="menu-icon">☰</span>
        Explorar
      </button>
      <div class="dropdown" :class="{ open: menuOpen }" v-if="menuOpen">
        <div class="dropdown-section">
          <div class="dropdown-label">Protagonistas</div>
          <NuxtLink to="/personajes" class="dropdown-item" @click="menuOpen = false">Personajes</NuxtLink>
          <NuxtLink to="/capitulos" class="dropdown-item" @click="menuOpen = false">Capítulos</NuxtLink>
        </div>
        <div class="dropdown-section">
          <div class="dropdown-label">El mundo</div>
          <NuxtLink to="/naciones" class="dropdown-item" @click="menuOpen = false">Naciones</NuxtLink>
          <NuxtLink to="/organizaciones" class="dropdown-item" @click="menuOpen = false">Organizaciones</NuxtLink>
          <NuxtLink to="/magia" class="dropdown-item" @click="menuOpen = false">Magia</NuxtLink>
          <NuxtLink to="/bestiario" class="dropdown-item" @click="menuOpen = false">Bestiario</NuxtLink>
        </div>
        <div class="dropdown-section">
          <div class="dropdown-label">Lore</div>
          <NuxtLink to="/familias" class="dropdown-item" @click="menuOpen = false">Familias</NuxtLink>
          <NuxtLink to="/armas" class="dropdown-item" @click="menuOpen = false">Armas</NuxtLink>
          <NuxtLink to="/timeline" class="dropdown-item" @click="menuOpen = false">Timeline</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const menuOpen = ref(false)
const menuWrapper = ref(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

onMounted(() => {
  document.addEventListener('click', handleOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutside)
})

function handleOutside(e) {
  if (menuWrapper.value && !menuWrapper.value.contains(e.target)) {
    menuOpen.value = false
  }
}
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  position: relative;
  z-index: 100;
}

.logo {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 0.25em;
  color: #c8a84b;
}

.menu-wrapper { position: relative; }

.menu-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #2a2010;
  color: #a89070;
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.2em;
  padding: 7px 14px;
  border-radius: 2px;
  transition: border-color 0.2s, color 0.2s;
}

.menu-btn:hover { border-color: #c8a84b; color: #c8a84b; }

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: #12100a;
  border: 1px solid #2a2010;
  border-radius: 4px;
  min-width: 200px;
  z-index: 200;
  animation: dropIn 0.15s ease both;
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dropdown-section {
  padding: 6px 0;
  border-bottom: 1px solid #1e1810;
}
.dropdown-section:last-child { border-bottom: none; }

.dropdown-label {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.25em;
  color: #4a3a20;
  padding: 6px 16px 4px;
  text-transform: uppercase;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  font-family: 'Crimson Pro', serif;
  font-size: 15px;
  color: #a89070;
  transition: background 0.15s, color 0.15s;
}

.dropdown-item:hover {
  background: #1e1810;
  color: #e8dfc8;
}

.search-link {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: #5a4a30;
  padding: 7px 12px;
  border: 1px solid #2a2010;
  border-radius: 2px;
  transition: color 0.2s, border-color 0.2s;
}
.search-link:hover { color: #c8a84b; border-color: #c8a84b; }
</style>