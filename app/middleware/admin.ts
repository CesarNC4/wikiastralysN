export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Si ya está en login, no hacer nada
  if (to.path === '/admin/login') return

  // Si no hay sesión, redirigir al login guardando destino
  if (!user.value) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})