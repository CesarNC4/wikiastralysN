<template>
  <div class="login-page">
    <div class="login-card">

      <div class="login-header">
        <span class="login-gem">◆</span>
        <h1 class="login-title">Astralys</h1>
        <p class="login-sub">Panel de administración</p>
        <div class="divider">
          <div class="line"></div>
          <div class="gem"></div>
          <div class="line right"></div>
        </div>
      </div>

      <div class="login-form">
        <div class="field">
          <label class="field-label">Correo</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            autocomplete="email"
            placeholder="tu@correo.com"
            @keyup.enter="login"
          />
        </div>
        <div class="field">
          <label class="field-label">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="field-input"
            autocomplete="current-password"
            placeholder="••••••••"
            @keyup.enter="login"
          />
        </div>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button class="btn-login" :disabled="loading" @click="login">
          {{ loading ? 'Verificando...' : 'Entrar' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const route    = useRoute()
const router   = useRouter()

const email    = ref('')
const password = ref('')
const loading  = ref(false)
const error    = ref('')

// Si ya está autenticado, redirigir directo
const user = useSupabaseUser()
if (user.value) {
  await navigateTo(route.query.redirect || '/admin')
}

async function login() {
  if (!email.value || !password.value) return
  loading.value = true
  error.value   = ''

  const { error: authError } = await supabase.auth.signInWithPassword({
    email:    email.value,
    password: password.value,
  })

  if (authError) {
    error.value   = 'Correo o contraseña incorrectos.'
    loading.value = false
    return
  }

  // Esperar a que @nuxtjs/supabase sincronice la sesión antes de navegar
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      subscription.unsubscribe()
      navigateTo(route.query.redirect?.toString() || '/admin')
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #0e0b07;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Crimson Pro', Georgia, serif;
}

.login-card {
  background: #12100a;
  border: 1px solid #2a2010;
  border-radius: 4px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
}

.login-header { text-align: center; margin-bottom: 2rem; }

.login-gem {
  font-size: 10px;
  color: #c8a84b;
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 0.75rem;
}

.login-title {
  font-family: 'Cinzel', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #f0e4c0;
  letter-spacing: 0.12em;
  margin-bottom: 0.25rem;
}

.login-sub {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.3em;
  color: #4a3a20;
  text-transform: uppercase;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1.25rem;
}
.line { height: 1px; width: 50px; background: linear-gradient(90deg, transparent, #2a2010); }
.line.right { background: linear-gradient(90deg, #2a2010, transparent); }
.gem { width: 5px; height: 5px; background: #2a2010; transform: rotate(45deg); }

.login-form { display: flex; flex-direction: column; gap: 1rem; }

.field { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: #5a4a30;
  text-transform: uppercase;
}

.field-input {
  background: #0e0b07;
  border: 1px solid #2a2010;
  border-radius: 2px;
  padding: 10px 14px;
  color: #e8dfc8;
  font-family: 'Crimson Pro', serif;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
.field-input::placeholder { color: #2a2010; }
.field-input:focus { border-color: #c8a84b; }

.login-error {
  font-size: 0.9rem;
  color: #e24b4a;
  font-style: italic;
  text-align: center;
}

.btn-login {
  margin-top: 0.5rem;
  background: #c8a84b;
  border: none;
  border-radius: 2px;
  color: #0e0b07;
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 13px;
  transition: background 0.2s, opacity 0.2s;
  cursor: pointer;
}
.btn-login:hover:not(:disabled) { background: #e0c060; }
.btn-login:disabled { opacity: 0.4; cursor: not-allowed; }
</style>