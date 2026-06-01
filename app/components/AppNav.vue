<template>
  <nav class="topbar">
    <NuxtLink to="/" class="logo">Astralys</NuxtLink>

    <div class="nav-right">
      <NuxtLink to="/busqueda" class="search-btn">Buscar</NuxtLink>

      <div class="menu-wrap" ref="menuWrapper">
        <button class="menu-btn" @click="toggleMenu" :aria-expanded="menuOpen">
          <span class="hamburger" :class="{ open: menuOpen }">
            <span></span><span></span><span></span>
          </span>
          Explorar
        </button>

        <div class="dropdown" v-if="menuOpen">
          <div class="dropdown-section">
            <p class="dropdown-label">Protagonistas</p>
            <NuxtLink to="/personajes" class="dropdown-item" @click="menuOpen = false">Personajes</NuxtLink>
            <NuxtLink to="/capitulos" class="dropdown-item" @click="menuOpen = false">Capítulos</NuxtLink>
          </div>
          <div class="dropdown-section">
            <p class="dropdown-label">El mundo</p>
            <NuxtLink to="/naciones" class="dropdown-item" @click="menuOpen = false">Naciones</NuxtLink>
            <NuxtLink to="/razas" class="dropdown-item" @click="menuOpen = false">Razas</NuxtLink>
            <NuxtLink to="/organizaciones" class="dropdown-item" @click="menuOpen = false">Organizaciones</NuxtLink>
            <NuxtLink to="/gremio" class="dropdown-item" @click="menuOpen = false">El Gremio</NuxtLink>
            <NuxtLink to="/magia" class="dropdown-item" @click="menuOpen = false">Magia</NuxtLink>
            <NuxtLink to="/bestiario" class="dropdown-item" @click="menuOpen = false">Bestiario</NuxtLink>
            <NuxtLink to="/lord-demonio" class="dropdown-item" @click="menuOpen = false">Lords Demonio</NuxtLink>
          </div>
          <div class="dropdown-section">
            <p class="dropdown-label">Lore</p>
            <NuxtLink to="/historia" class="dropdown-item" @click="menuOpen = false">Historia</NuxtLink>
            <NuxtLink to="/cosmos" class="dropdown-item" @click="menuOpen = false">El Cosmos</NuxtLink>
            <NuxtLink to="/familias" class="dropdown-item" @click="menuOpen = false">Familias</NuxtLink>
            <NuxtLink to="/armas" class="dropdown-item" @click="menuOpen = false">Armas</NuxtLink>
            <NuxtLink to="/misiones" class="dropdown-item" @click="menuOpen = false">Misiones</NuxtLink>
            <NuxtLink to="/conceptos" class="dropdown-item" @click="menuOpen = false">Conceptos</NuxtLink>
            <NuxtLink to="/minerales" class="dropdown-item" @click="menuOpen = false">Minerales</NuxtLink>
            <NuxtLink to="/economia" class="dropdown-item" @click="menuOpen = false">Economía</NuxtLink>
            <NuxtLink to="/timeline" class="dropdown-item" @click="menuOpen = false">Timeline</NuxtLink>
            <NuxtLink to="/banda-sonora" class="dropdown-item" @click="menuOpen = false">Banda Sonora</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
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
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem max(1.5rem, 6vw);
  background: rgba(6, 4, 15, 0.80);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--bd);
}

.logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--t1);
  transition: color 180ms var(--ease-out);
}
.logo:hover { color: var(--accent); }

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-btn {
  padding: 6px 14px;
  border: 1px solid var(--bd);
  border-radius: 2px;
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.22em;
  color: var(--t3);
  transition: border-color 180ms var(--ease-out), color 180ms var(--ease-out);
}
.search-btn:hover { border-color: var(--bd-strong); color: var(--t2); }

.menu-wrap { position: relative; }

.menu-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 1px solid var(--bd);
  border-radius: 2px;
  color: var(--t3);
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.22em;
  padding: 6px 14px;
  transition: border-color 180ms var(--ease-out), color 180ms var(--ease-out), background 180ms ease;
}
.menu-btn:hover { border-color: var(--bd-strong); color: var(--t2); background: var(--s1); }
.menu-btn:active { transform: scale(0.97); }

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 3.5px;
  width: 14px;
  flex-shrink: 0;
}
.hamburger span {
  display: block;
  height: 1px;
  width: 100%;
  background: currentColor;
  transition: transform 200ms var(--ease-out), opacity 200ms ease, width 200ms var(--ease-out);
}
.hamburger.open span:nth-child(1) { transform: translateY(4.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-4.5px) rotate(-45deg); }

.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--s1);
  border: 1px solid var(--bd);
  border-radius: 3px;
  min-width: 200px;
  z-index: 200;
  overflow: hidden;
  transform-origin: top right;
  animation: dropIn 160ms var(--ease-out) both;
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.dropdown-section {
  padding: 6px 0;
  border-bottom: 1px solid var(--bd);
}
.dropdown-section:last-child { border-bottom: none; }

.dropdown-label {
  font-family: 'Cinzel', serif;
  font-size: 8.5px;
  letter-spacing: 0.3em;
  color: var(--t3);
  padding: 6px 16px 4px;
  text-transform: uppercase;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  font-family: 'Crimson Pro', serif;
  font-size: 15px;
  color: var(--t2);
  transition: background 150ms ease, color 150ms ease, padding-left 200ms var(--ease-out);
}
.dropdown-item:hover {
  background: var(--s2);
  color: var(--t1);
  padding-left: 22px;
}
</style>
