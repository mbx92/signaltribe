<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Analyst Approvals</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Review new analyst applications and manage existing analysts.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 mb-1">Pending Applications</p>
        <p class="text-2xl font-bold text-warning">{{ pending.length }}</p>
        <p class="text-xs text-base-content/50 mt-1">
          {{ pending.length ? `Oldest: ${oldestPending}` : 'None pending' }}
        </p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 mb-1">Approved Analysts</p>
        <p class="text-2xl font-bold">{{ approved.length }}</p>
        <p class="text-xs text-base-content/50 mt-1">Active on platform</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 mb-1">Rejected</p>
        <p class="text-2xl font-bold text-error">{{ rejected.length }}</p>
        <p class="text-xs text-base-content/50 mt-1">Total rejected applications</p>
      </div>
    </div>

    <!-- Pending Applications -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-4 border-b border-base-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="flex items-center gap-2">
          <h2 class="font-semibold text-base">Pending Applications</h2>
          <span class="badge badge-warning badge-sm">{{ pending.length }}</span>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table table-sm w-full">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase">
                <th>Applicant</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Monthly Price</th>
                <th>Applied</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-if="loadingPending">
                <td colspan="6" class="text-center py-10 text-base-content/40">
                  <span class="loading loading-spinner loading-sm"></span>
                </td>
              </tr>
              <tr v-else-if="!pending.length">
                <td colspan="6" class="text-center py-10 text-base-content/40">
                  <IconCircleCheck class="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p class="text-sm">No pending applications. All clear!</p>
                </td>
              </tr>
              <tr v-for="a in pending" :key="a.id" class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {{ initials(a.user.name || a.user.email) }}
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">{{ a.user.name || '—' }}</p>
                      <p class="text-xs text-base-content/50">{{ a.user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="text-xs">{{ a.specialty || '—' }}</td>
                <td class="text-xs">{{ a.experience ? `${a.experience} yrs` : '—' }}</td>
                <td class="text-xs">${{ a.monthlyPrice.toFixed(2) }}/mo</td>
                <td class="text-xs text-base-content/60">{{ timeAgo(a.createdAt) }}</td>
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <button
                      class="btn btn-xs btn-ghost text-error"
                      :disabled="actionLoading === a.id"
                      @click="openReject(a)"
                    >Reject</button>
                    <button
                      class="btn btn-xs btn-primary"
                      :disabled="actionLoading === a.id"
                      @click="handleAction(a.id, 'APPROVED')"
                    >
                      <span v-if="actionLoading === a.id" class="loading loading-spinner loading-xs"></span>
                      Approve
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Approved Analysts -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-4 border-b border-base-200 flex items-center justify-between">
        <h2 class="font-semibold text-base">Approved Analysts</h2>
        <span class="text-xs text-base-content/50">{{ approved.length }} total</span>
      </div>
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table table-sm w-full">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase">
                <th>Analyst</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Monthly Price</th>
                <th>Subscribers</th>
                <th>Approved</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-if="loadingApproved">
                <td colspan="7" class="text-center py-8 text-base-content/40">
                  <span class="loading loading-spinner loading-sm"></span>
                </td>
              </tr>
              <tr v-else-if="!approved.length">
                <td colspan="7" class="text-center py-8 text-base-content/40">No approved analysts yet.</td>
              </tr>
              <tr v-for="a in approved" :key="a.id" class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold">
                        {{ initials(a.user.name || a.user.email) }}
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">{{ a.user.name || '—' }}</p>
                      <p class="text-xs text-base-content/50">{{ a.user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="text-xs">{{ a.specialty || '—' }}</td>
                <td class="text-xs">{{ a.experience ? `${a.experience} yrs` : '—' }}</td>
                <td class="text-xs">${{ a.monthlyPrice.toFixed(2) }}/mo</td>
                <td class="text-xs font-semibold">{{ a._count.subscriptions }}</td>
                <td class="text-xs text-base-content/60">{{ formatDate(a.updatedAt) }}</td>
                <td class="text-right">
                  <button
                    class="btn btn-xs btn-ghost text-error"
                    :disabled="actionLoading === a.id"
                    @click="openReject(a)"
                  >Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Reject confirmation modal -->
    <dialog :open="!!rejectTarget" class="modal">
      <div class="modal-box max-w-sm">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="rejectTarget = null">
          <IconX class="w-4 h-4" />
        </button>
        <h3 class="font-bold text-base mb-1">
          {{ rejectTarget?.status === 'APPROVED' ? 'Revoke Analyst' : 'Reject Application' }}
        </h3>
        <p class="text-sm text-base-content/60 mb-4">
          {{ rejectTarget?.status === 'APPROVED'
            ? `This will revoke approval for ${rejectTarget?.user?.name || rejectTarget?.user?.email}.`
            : `This will reject the application from ${rejectTarget?.user?.name || rejectTarget?.user?.email}.` }}
        </p>
        <p v-if="rejectError" class="text-sm text-error mb-3">{{ rejectError }}</p>
        <div class="flex justify-end gap-2">
          <button class="btn btn-ghost btn-sm" @click="rejectTarget = null">Cancel</button>
          <button
            class="btn btn-error btn-sm"
            :disabled="actionLoading === rejectTarget?.id"
            @click="confirmReject"
          >
            <span v-if="actionLoading === rejectTarget?.id" class="loading loading-spinner loading-xs"></span>
            {{ rejectTarget?.status === 'APPROVED' ? 'Revoke' : 'Reject' }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="rejectTarget = null">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { IconTrendingUp, IconCircleCheck, IconX } from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })

const pending = ref<any[]>([])
const approved = ref<any[]>([])
const rejected = ref<any[]>([])
const loadingPending = ref(false)
const loadingApproved = ref(false)
const actionLoading = ref<string | null>(null)
const rejectTarget = ref<any>(null)
const rejectError = ref('')

const loadPending = async () => {
  loadingPending.value = true
  try {
    pending.value = await $fetch<any[]>('/api/admin/analysts', { params: { status: 'PENDING' } })
  } finally {
    loadingPending.value = false
  }
}

const loadApproved = async () => {
  loadingApproved.value = true
  try {
    approved.value = await $fetch<any[]>('/api/admin/analysts', { params: { status: 'APPROVED' } })
  } finally {
    loadingApproved.value = false
  }
}

const loadRejected = async () => {
  rejected.value = await $fetch<any[]>('/api/admin/analysts', { params: { status: 'REJECTED' } })
}

const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
  actionLoading.value = id
  try {
    await $fetch(`/api/admin/analysts/${id}`, { method: 'PUT', body: { status } })
    await Promise.all([loadPending(), loadApproved(), loadRejected()])
  } finally {
    actionLoading.value = null
  }
}

const openReject = (analyst: any) => {
  rejectTarget.value = analyst
  rejectError.value = ''
}

const confirmReject = async () => {
  if (!rejectTarget.value) return
  actionLoading.value = rejectTarget.value.id
  try {
    await $fetch(`/api/admin/analysts/${rejectTarget.value.id}`, {
      method: 'PUT',
      body: { status: 'REJECTED' },
    })
    rejectTarget.value = null
    await Promise.all([loadPending(), loadApproved(), loadRejected()])
  } catch (err: any) {
    rejectError.value = err?.data?.statusMessage || 'Action failed'
  } finally {
    actionLoading.value = null
  }
}

const oldestPending = computed(() => {
  if (!pending.value.length) return ''
  const oldest = pending.value[0]
  return timeAgo(oldest.createdAt)
})

const initials = (str: string) =>
  str.split(/\s+/).map((w: string) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

onMounted(() => {
  loadPending()
  loadApproved()
  loadRejected()
})
</script>

