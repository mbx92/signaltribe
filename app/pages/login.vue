<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 mb-3">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <IconChartArrows class="w-6 h-6 text-primary-content" />
          </div>
          <span class="text-2xl font-extrabold text-primary tracking-tight">SignalTribe</span>
        </NuxtLink>
        <p class="text-base-content/50 text-sm">Sign in to your account</p>
      </div>

      <!-- Login Card -->
      <div class="card bg-base-100 border border-base-300 shadow-xl">
        <div class="card-body gap-5 p-7">

          <!-- Error message -->
          <div v-if="error" class="alert alert-error py-2 text-sm">
            <IconAlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ error }}</span>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-base-content/60 mb-1.5 uppercase tracking-wide">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="input input-bordered w-full"
              placeholder="you@example.com"
              @keydown.enter="submit"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-base-content/60 mb-1.5 uppercase tracking-wide">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="input input-bordered w-full"
              placeholder="••••••••"
              @keydown.enter="submit"
            />
          </div>

          <!-- Submit -->
          <button class="btn btn-primary w-full" @click="submit">
            Sign In
          </button>

          <!-- Divider -->
          <div class="divider text-xs text-base-content/40 my-0">DEMO ACCOUNTS</div>

          <!-- Demo role cards -->
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="(account, key) in DEMO_ACCOUNTS"
              :key="key"
              class="flex flex-col items-center gap-2 p-3 rounded-xl border border-base-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer text-center group"
              @click="quickLogin(key)"
            >
              <div class="avatar">
                <div class="w-10 h-10 rounded-full ring-2 ring-base-300 group-hover:ring-primary transition-all">
                  <img :src="account.avatar" :alt="account.name" />
                </div>
              </div>
              <div>
                <p class="text-xs font-semibold leading-tight">{{ account.name }}</p>
                <span :class="roleBadgeClass(key)" class="badge badge-xs mt-0.5">{{ account.badge }}</span>
              </div>
            </button>
          </div>

          <p class="text-center text-xs text-base-content/40">
            Click any demo card to sign in instantly
          </p>

        </div>
      </div>

      <p class="text-center text-xs text-base-content/30 mt-6">
        © 2025 SignalTribe · This is a UI mockup
      </p>

    </div>
  </div>
</template>

<script setup>
import { IconChartArrows, IconAlertCircle } from '@tabler/icons-vue'

definePageMeta({ layout: false })

const { loginByRole, loginByCredentials, DEMO_ACCOUNTS } = useAuth()

const router = useRouter()

const form = reactive({ email: '', password: '' })
const error = ref('')

const roleBadgeClass = (role) => ({
  admin:   'badge-error',
  analyst: 'badge-warning',
  user:    'badge-info',
}[role] ?? 'badge-ghost')

const submit = () => {
  error.value = ''
  const redirect = loginByCredentials(form.email, form.password)
  if (!redirect) {
    error.value = 'Invalid email or password. Try a demo account below.'
    return
  }
  router.push(redirect)
}

const quickLogin = (role) => {
  const redirect = loginByRole(role)
  router.push(redirect)
}
</script>
