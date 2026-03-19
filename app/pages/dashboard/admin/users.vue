<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">User Management</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Overview of all traders, analysts, and admins on the platform.</p>
      </div>
      <button class="btn btn-primary btn-sm gap-2" @click="showCreate = true">
        <IconPlus class="w-4 h-4" /> Create User
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <label class="input input-sm input-bordered w-full md:w-80 flex items-center gap-2">
        <IconSearch class="w-4 h-4 text-base-content/50" />
        <input v-model="search" type="text" class="grow" placeholder="Search by name or email..." @input="debouncedLoad" />
      </label>
      <div class="flex flex-wrap gap-2">
        <select v-model="filterRole" class="select select-sm select-bordered w-32" @change="loadUsers(1)">
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="analyst">Analyst</option>
          <option value="trader">Trader</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table table-sm w-full">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase">
                <th>User</th>
                <th>Role</th>
                <th>Analyst Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-if="pending">
                <td colspan="4" class="text-center py-10 text-base-content/40">
                  <span class="loading loading-spinner loading-sm"></span>
                </td>
              </tr>
              <tr v-else-if="!users.length">
                <td colspan="4" class="text-center py-10 text-base-content/40">
                  <IconUsers class="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p class="text-sm">No users found.</p>
                </td>
              </tr>
              <tr v-for="user in users" :key="user.id" class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {{ initials(user.name || user.email) }}
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">{{ user.name || '—' }}</p>
                      <p class="text-xs text-base-content/50">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-sm badge-soft" :class="roleBadge(user.role.name)">
                    {{ user.role.name }}
                  </span>
                </td>
                <td>
                  <span v-if="user.analystProfile" class="badge badge-sm badge-soft" :class="analystBadge(user.analystProfile.status)">
                    {{ user.analystProfile.status }}
                  </span>
                  <span v-else class="text-xs text-base-content/30">—</span>
                </td>
                <td class="text-xs text-base-content/60">{{ formatDate(user.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="p-4 border-t border-base-200 flex items-center justify-between">
          <p class="text-xs text-base-content/50">
            Showing {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total) }} of {{ total }} users
          </p>
          <div class="join">
            <button class="join-item btn btn-xs" :disabled="page <= 1" @click="loadUsers(page - 1)">Prev</button>
            <button class="join-item btn btn-xs btn-active">{{ page }}</button>
            <button class="join-item btn btn-xs" :disabled="page * limit >= total" @click="loadUsers(page + 1)">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Create User Modal ── -->
    <dialog :open="showCreate" class="modal">
      <div class="modal-box max-w-md">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeCreate">
          <IconX class="w-4 h-4" />
        </button>
        <h3 class="font-bold text-base mb-5">Create New User</h3>

        <form @submit.prevent="submitCreate" class="space-y-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Account Info</legend>

            <label class="label text-sm font-medium mt-2">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              class="input input-sm input-bordered w-full"
              placeholder="e.g. John Doe"
            />

            <label class="label text-sm font-medium mt-2">Email <span class="text-error">*</span></label>
            <input
              v-model="form.email"
              type="email"
              class="input input-sm input-bordered w-full"
              :class="formError.email && 'input-error'"
              placeholder="user@example.com"
              required
            />
            <p v-if="formError.email" class="text-xs text-error mt-1">{{ formError.email }}</p>

            <label class="label text-sm font-medium mt-2">Password <span class="text-error">*</span></label>
            <input
              v-model="form.password"
              type="password"
              class="input input-sm input-bordered w-full"
              :class="formError.password && 'input-error'"
              placeholder="Min. 8 characters"
              required
            />
            <p v-if="formError.password" class="text-xs text-error mt-1">{{ formError.password }}</p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Role</legend>

            <select v-model="form.roleName" class="select select-sm select-bordered w-full mt-2" required>
              <option value="" disabled>Select a role</option>
              <option value="admin">Admin</option>
              <option value="analyst">Analyst</option>
              <option value="trader">Trader</option>
              <option value="viewer">Viewer</option>
            </select>
          </fieldset>

          <p v-if="createError" class="text-sm text-error">{{ createError }}</p>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="btn btn-ghost btn-sm" @click="closeCreate">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="creating">
              <span v-if="creating" class="loading loading-spinner loading-xs"></span>
              Create User
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeCreate">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconPlus, IconX, IconUsers } from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })

// ── State ──
const users = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const pending = ref(false)
const search = ref('')
const filterRole = ref('')

// ── Create modal ──
const showCreate = ref(false)
const creating = ref(false)
const createError = ref('')
const form = reactive({ name: '', email: '', password: '', roleName: '' })
const formError = reactive({ email: '', password: '' })

// ── Load users ──
const loadUsers = async (p = 1) => {
  pending.value = true
  page.value = p
  const params: Record<string, string | number> = { page: p, limit }
  if (search.value) params.search = search.value
  if (filterRole.value) params.role = filterRole.value
  try {
    const data = await $fetch<{ users: any[]; total: number }>('/api/admin/users', { params })
    users.value = data.users
    total.value = data.total
  } finally {
    pending.value = false
  }
}

// ── Debounce search ──
let searchTimer: ReturnType<typeof setTimeout>
const debouncedLoad = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadUsers(1), 350)
}

// ── Create user ──
const submitCreate = async () => {
  formError.email = ''
  formError.password = ''
  createError.value = ''

  if (form.password.length < 8) {
    formError.password = 'Password must be at least 8 characters'
    return
  }

  creating.value = true
  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: { name: form.name || undefined, email: form.email, password: form.password, roleName: form.roleName },
    })
    closeCreate()
    await loadUsers(1)
  } catch (err: any) {
    const msg = err?.data?.statusMessage || 'Failed to create user'
    if (msg.toLowerCase().includes('email')) formError.email = msg
    else createError.value = msg
  } finally {
    creating.value = false
  }
}

const closeCreate = () => {
  showCreate.value = false
  form.name = ''
  form.email = ''
  form.password = ''
  form.roleName = ''
  formError.email = ''
  formError.password = ''
  createError.value = ''
}

// ── Helpers ──
const initials = (str: string) =>
  str.split(/\s+/).map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const roleBadge = (role: string) => ({
  'badge-error': role === 'admin',
  'badge-secondary': role === 'analyst',
  'badge-primary': role === 'trader',
  'badge-ghost': role === 'viewer',
})

const analystBadge = (status: string) => ({
  'badge-success': status === 'APPROVED',
  'badge-warning': status === 'PENDING',
  'badge-error': status === 'REJECTED',
})

onMounted(() => loadUsers())
</script>

