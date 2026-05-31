<template>
  <div class="admin-layout">

    <nav class="admin-nav">
      <NuxtLink to="/admin" class="admin-logo">
        <span class="logo-gem">◆</span>
        <span class="logo-text">Astralys <em>Admin</em></span>
      </NuxtLink>
      <div class="admin-nav-right">
        <NuxtLink to="/" target="_blank" class="admin-nav-link">Ver wiki ↗</NuxtLink>
        <button class="btn-logout" @click="logout">Salir</button>
      </div>
    </nav>

    <div class="admin-tabs">
      <NuxtLink
        v-for="tab in TABS"
        :key="tab.to"
        :to="tab.to"
        class="admin-tab"
        :class="{ active: $route.path.startsWith(tab.to) }"
      >
        {{ tab.label }}
      </NuxtLink>
    </div>

    <main class="admin-main">
      <slot />
    </main>

    <Transition name="toast">
      <div v-if="toast.msg.value" class="admin-toast" :class="toast.type.value">
        {{ toast.msg.value }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const router   = useRouter()
const toast    = useToast()

const TABS = [
  { label: 'Personajes',     to: '/admin/personajes' },
  { label: 'Capítulos',      to: '/admin/capitulos' },
  { label: 'Naciones',       to: '/admin/naciones' },
  { label: 'Razas',          to: '/admin/razas' },
  { label: 'Organizaciones', to: '/admin/organizaciones' },
  { label: 'Familias',       to: '/admin/familias' },
  { label: 'Bestiario',      to: '/admin/bestiario' },
  { label: 'Lords Demonio',  to: '/admin/lord-demonio' },
  { label: 'Armas',          to: '/admin/armas' },
  { label: 'Magia',          to: '/admin/magia' },
  { label: 'Minerales',      to: '/admin/minerales' },
  { label: 'Misiones',       to: '/admin/misiones' },
  { label: 'Conceptos',      to: '/admin/conceptos' },
  { label: 'Lore',           to: '/admin/lore' },
  { label: 'Canciones',      to: '/admin/canciones' },
  { label: 'Monedas',        to: '/admin/monedas' },
  { label: 'Timeline',       to: '/admin/timeline' },
  { label: 'Notas',          to: '/admin/notas' },
  { label: 'Buscar',         to: '/admin/busqueda' },
]

async function logout() {
  await supabase.auth.signOut()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #0e0b07;
  color: #e8dfc8;
  font-family: 'Crimson Pro', Georgia, serif;
}

/* ── Navbar ── */
.admin-nav {
  background: #12100a;
  border-bottom: 1px solid #2a2010;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 200;
  height: 52px;
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-gem {
  font-size: 10px;
  color: #c8a84b;
}
.logo-text {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: #e8dfc8;
}
.logo-text em {
  font-style: normal;
  color: #c8a84b;
  margin-left: 6px;
}

.admin-nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-nav-link {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: #5a4a30;
  padding: 6px 12px;
  border: 1px solid #2a2010;
  border-radius: 2px;
  transition: color 0.2s, border-color 0.2s;
  text-decoration: none;
}
.admin-nav-link:hover { color: #a89070; border-color: #4a3a20; }

.btn-logout {
  background: transparent;
  border: 1px solid #3a1a10;
  color: #7a3030;
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  padding: 7px 14px;
  border-radius: 2px;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  cursor: pointer;
}
.btn-logout:hover { background: #e24b4a; color: #fff; border-color: #e24b4a; }

/* ── Tabs ── */
.admin-tabs {
  background: #12100a;
  border-bottom: 1px solid #1e1810;
  padding: 0 1.5rem;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  position: sticky;
  top: 52px;
  z-index: 100;
}
.admin-tabs::-webkit-scrollbar { display: none; }

.admin-tab {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 14px;
  color: #5a4a30;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  text-decoration: none;
  transition: color 0.2s, border-color 0.2s;
}
.admin-tab:hover { color: #a89070; }
.admin-tab.active { color: #c8a84b; border-bottom-color: #c8a84b; }

/* ── Main ── */
.admin-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 6rem;
}

/* ── Toast ── */
.admin-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 12px 20px;
  border-radius: 2px;
  border: 1px solid;
  pointer-events: none;
}
.admin-toast.ok  { background: #0e0b07; border-color: #c8a84b; color: #c8a84b; }
.admin-toast.err { background: #0e0b07; border-color: #e24b4a; color: #e24b4a; }

.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>