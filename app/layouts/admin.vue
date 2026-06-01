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
  background: var(--bg);
  color: var(--t1);
  font-family: 'Crimson Pro', Georgia, serif;
  color-scheme: dark;
}

/* ── Navbar ── */
.admin-nav {
  background: rgba(6, 4, 15, 0.90);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--bd);
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
  color: var(--accent);
}
.logo-text {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--t1);
}
.logo-text em {
  font-style: normal;
  color: var(--accent);
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
  color: var(--t3);
  padding: 6px 12px;
  border: 1px solid var(--bd);
  border-radius: 2px;
  transition: color 180ms var(--ease-out), border-color 180ms var(--ease-out);
  text-decoration: none;
  text-transform: uppercase;
}
.admin-nav-link:hover { color: var(--t2); border-color: var(--bd-strong); }

.btn-logout {
  background: transparent;
  border: 1px solid var(--bd);
  color: var(--t3);
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  padding: 7px 14px;
  border-radius: 2px;
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
  cursor: pointer;
  text-transform: uppercase;
}
.btn-logout:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

/* ── Tabs ── */
.admin-tabs {
  background: var(--s1);
  border-bottom: 1px solid var(--bd);
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
  color: var(--t3);
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  text-decoration: none;
  transition: color 180ms var(--ease-out), border-color 180ms var(--ease-out);
}
.admin-tab:hover { color: var(--t2); }
.admin-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

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
.admin-toast.ok  { background: var(--s1); border-color: #4a9e40; color: #4a9e40; }
.admin-toast.err { background: var(--s1); border-color: var(--accent); color: var(--accent); }

.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>