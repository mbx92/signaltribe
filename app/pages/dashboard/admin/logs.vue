<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">System Logs</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Activity audit trail and system error logs.</p>
      </div>
    </div>

    <!-- Tab switcher -->
    <div class="tabs tabs-bordered">
      <button
        class="tab"
        :class="activeTab === 'activity' && 'tab-active font-semibold'"
        @click="switchTab('activity')"
      >
        <IconActivity class="w-4 h-4 mr-1.5" /> Activity
        <span class="badge badge-sm badge-soft badge-primary ml-2">{{ activityTotal }}</span>
      </button>
      <button
        class="tab"
        :class="activeTab === 'system' && 'tab-active font-semibold'"
        @click="switchTab('system')"
      >
        <IconAlertTriangle class="w-4 h-4 mr-1.5" /> System Errors
        <span class="badge badge-sm badge-soft badge-error ml-2">{{ systemTotal }}</span>
      </button>
    </div>

    <!-- ── Activity Logs ── -->
    <template v-if="activeTab === 'activity'">
      <div class="flex flex-col md:flex-row md:items-center gap-3">
        <select v-model="activityFilter" class="select select-sm select-bordered w-48" @change="loadActivity(1)">
          <option value="">All Actions</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
          <option value="USER_CREATE">USER_CREATE</option>
          <option value="USER_UPDATE">USER_UPDATE</option>
          <option value="USER_DELETE">USER_DELETE</option>
          <option value="SIGNAL_CREATE">SIGNAL_CREATE</option>
          <option value="SIGNAL_UPDATE">SIGNAL_UPDATE</option>
          <option value="SIGNAL_DELETE">SIGNAL_DELETE</option>
          <option value="JOURNAL_CREATE">JOURNAL_CREATE</option>
          <option value="JOURNAL_UPDATE">JOURNAL_UPDATE</option>
          <option value="JOURNAL_DELETE">JOURNAL_DELETE</option>
          <option value="SUBSCRIPTION_CREATE">SUBSCRIPTION_CREATE</option>
          <option value="SUBSCRIPTION_CANCEL">SUBSCRIPTION_CANCEL</option>
          <option value="ANALYST_APPROVE">ANALYST_APPROVE</option>
          <option value="ANALYST_REJECT">ANALYST_REJECT</option>
          <option value="SETTINGS_UPDATE">SETTINGS_UPDATE</option>
        </select>
        <button class="btn btn-sm btn-ghost" @click="loadActivity(1)">
          <IconRefresh class="w-4 h-4" /> Refresh
        </button>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table table-sm w-full">
              <thead>
                <tr class="bg-base-200/60 text-xs uppercase">
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>IP</th>
                  <th>Meta</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-if="activityPending">
                  <td colspan="6" class="text-center py-8 text-base-content/40">
                    <span class="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
                <tr v-else-if="!activityLogs.length">
                  <td colspan="6" class="text-center py-10 text-base-content/40">
                    <IconActivity class="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p class="text-sm">No activity logs found.</p>
                  </td>
                </tr>
                <tr v-for="log in activityLogs" :key="log.id" class="hover cursor-pointer" @click="selectedActivity = log">
                  <td class="text-xs text-base-content/60 whitespace-nowrap">
                    {{ formatDate(log.createdAt) }}
                  </td>
                  <td>
                    <p class="text-xs font-medium">{{ log.userEmail || '—' }}</p>
                    <p class="text-[10px] text-base-content/40 font-mono">{{ log.userId?.slice(0, 10) }}…</p>
                  </td>
                  <td>
                    <span class="badge badge-sm badge-soft" :class="actionBadgeClass(log.action)">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="text-xs text-base-content/60">
                    {{ log.entity || '—' }}
                    <span v-if="log.entityId" class="font-mono text-[10px] text-base-content/30 block">
                      {{ log.entityId.slice(0, 12) }}…
                    </span>
                  </td>
                  <td class="text-xs font-mono text-base-content/50">{{ log.ip || '—' }}</td>
                  <td class="text-xs text-base-content/50">
                    <span v-if="log.meta" class="truncate max-w-37.5 block">{{ log.meta }}</span>
                    <span v-else class="text-base-content/30">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="activityTotal > activityLimit" class="flex items-center justify-between text-sm">
        <p class="text-base-content/50">{{ activityTotal }} total records</p>
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :disabled="activityPage <= 1"
            @click="loadActivity(activityPage - 1)"
          >«</button>
          <button class="join-item btn btn-sm btn-active">{{ activityPage }}</button>
          <button
            class="join-item btn btn-sm"
            :disabled="activityPage * activityLimit >= activityTotal"
            @click="loadActivity(activityPage + 1)"
          >»</button>
        </div>
      </div>
    </template>

    <!-- ── System Error Logs ── -->
    <template v-if="activeTab === 'system'">
      <div class="flex flex-col md:flex-row md:items-center gap-3">
        <select v-model="systemFilter" class="select select-sm select-bordered w-36" @change="loadSystem(1)">
          <option value="">All Levels</option>
          <option value="error">Error</option>
          <option value="warn">Warning</option>
          <option value="info">Info</option>
        </select>
        <button class="btn btn-sm btn-ghost" @click="loadSystem(1)">
          <IconRefresh class="w-4 h-4" /> Refresh
        </button>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table table-sm w-full">
              <thead>
                <tr class="bg-base-200/60 text-xs uppercase">
                  <th>Time</th>
                  <th>Level</th>
                  <th>Path</th>
                  <th>Message</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-if="systemPending">
                  <td colspan="5" class="text-center py-8 text-base-content/40">
                    <span class="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
                <tr v-else-if="!systemLogs.length">
                  <td colspan="5" class="text-center py-10 text-base-content/40">
                    <IconCircleCheck class="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p class="text-sm">No system errors. All clear!</p>
                  </td>
                </tr>
                <tr
                  v-for="log in systemLogs"
                  :key="log.id"
                  class="hover cursor-pointer"
                  @click="selectedLog = log"
                >
                  <td class="text-xs text-base-content/60 whitespace-nowrap">
                    {{ formatDate(log.createdAt) }}
                  </td>
                  <td>
                    <span class="badge badge-sm badge-soft" :class="levelBadgeClass(log.level)">
                      {{ log.level.toUpperCase() }}
                    </span>
                  </td>
                  <td class="text-xs font-mono text-base-content/60">{{ log.path || '—' }}</td>
                  <td class="text-xs max-w-75 truncate">{{ log.message }}</td>
                  <td>
                    <p class="text-xs font-medium">{{ log.userName || log.userEmail || '—' }}</p>
                    <p v-if="log.userId" class="text-[10px] font-mono text-base-content/40">{{ log.userId.slice(0, 12) }}…</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="systemTotal > systemLimit" class="flex items-center justify-between text-sm">
        <p class="text-base-content/50">{{ systemTotal }} total records</p>
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :disabled="systemPage <= 1"
            @click="loadSystem(systemPage - 1)"
          >«</button>
          <button class="join-item btn btn-sm btn-active">{{ systemPage }}</button>
          <button
            class="join-item btn btn-sm"
            :disabled="systemPage * systemLimit >= systemTotal"
            @click="loadSystem(systemPage + 1)"
          >»</button>
        </div>
      </div>
    </template>

    <!-- ── Activity Log Detail Modal ── -->
    <dialog :open="!!selectedActivity" class="modal">
      <div class="modal-box max-w-2xl w-full">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          @click="selectedActivity = null"
        >
          <IconX class="w-4 h-4" />
        </button>

        <template v-if="selectedActivity">
          <div class="flex items-center gap-3 mb-5 pr-8">
            <span class="badge badge-soft text-sm" :class="actionBadgeClass(selectedActivity.action)">
              {{ selectedActivity.action }}
            </span>
            <h3 class="font-bold text-base">Activity Detail</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
            <div>
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">Timestamp</p>
              <p class="font-mono text-xs">{{ formatDate(selectedActivity.createdAt) }}</p>
            </div>
            <div>
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">IP Address</p>
              <p class="font-mono text-xs">{{ selectedActivity.ip || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">User Email</p>
              <p class="text-xs">{{ selectedActivity.userEmail || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">User ID</p>
              <p class="font-mono text-xs break-all">{{ selectedActivity.userId || '—' }}</p>
            </div>
            <div v-if="selectedActivity.entity">
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">Entity</p>
              <p class="text-xs">{{ selectedActivity.entity }}</p>
            </div>
            <div v-if="selectedActivity.entityId">
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">Entity ID</p>
              <p class="font-mono text-xs break-all">{{ selectedActivity.entityId }}</p>
            </div>
          </div>

          <div v-if="selectedActivity.meta">
            <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-1">Metadata</p>
            <pre class="text-xs bg-base-200 p-3 overflow-x-auto max-h-48 whitespace-pre-wrap break-all">{{ prettyMeta(selectedActivity.meta) }}</pre>
          </div>
        </template>
      </div>
      <form method="dialog" class="modal-backdrop" @click="selectedActivity = null">
        <button>close</button>
      </form>
    </dialog>

    <!-- ── System Log Detail Modal ── -->
    <dialog :open="!!selectedLog" class="modal">
      <div class="modal-box max-w-3xl w-full">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          @click="selectedLog = null"
        >
          <IconX class="w-4 h-4" />
        </button>

        <template v-if="selectedLog">
          <!-- Modal header -->
          <div class="flex items-center gap-3 mb-5 pr-8">
            <span class="badge badge-soft text-sm" :class="levelBadgeClass(selectedLog.level)">
              {{ selectedLog.level.toUpperCase() }}
            </span>
            <h3 class="font-bold text-base leading-snug">System Log Detail</h3>
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
            <div>
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">Timestamp</p>
              <p class="font-mono text-xs">{{ formatDate(selectedLog.createdAt) }}</p>
            </div>
            <div>
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">Path</p>
              <p class="font-mono text-xs break-all">{{ selectedLog.path || '—' }}</p>
            </div>
            <div v-if="selectedLog.userId" class="sm:col-span-2">
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-0.5">User</p>
              <p class="text-xs">{{ selectedLog.userName || selectedLog.userEmail || '—' }}</p>
              <p class="font-mono text-xs break-all mt-1">{{ selectedLog.userId }}</p>
            </div>
          </div>

          <!-- Message -->
          <div class="mb-4">
            <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-1">Message</p>
            <div class="bg-base-200 p-3 text-sm wrap-break-word">{{ selectedLog.message }}</div>
          </div>

          <!-- Stack trace -->
          <div v-if="selectedLog.stack" class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold">Stack Trace</p>
              <button
                class="btn btn-xs btn-ghost"
                @click="copyToClipboard(selectedLog.stack)"
              >
                <IconCopy class="w-3 h-3" />
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <pre class="text-xs bg-base-200 p-3 overflow-x-auto max-h-56 whitespace-pre-wrap break-all leading-relaxed">{{ selectedLog.stack }}</pre>
          </div>

          <!-- Meta -->
          <div v-if="selectedLog.meta">
            <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-1">Metadata</p>
            <pre class="text-xs bg-base-200 p-3 overflow-x-auto max-h-40 whitespace-pre-wrap break-all">{{ prettyMeta(selectedLog.meta) }}</pre>
          </div>
        </template>
      </div>
      <form method="dialog" class="modal-backdrop" @click="selectedLog = null">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {
  IconActivity,
  IconAlertTriangle,
  IconRefresh,
  IconX,
  IconCircleCheck,
  IconCopy,
} from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })

interface ActivityLogItem {
  id: string
  userId: string | null
  userEmail: string | null
  action: string
  entity: string | null
  entityId: string | null
  meta: string | null
  ip: string | null
  createdAt: string
}

interface SystemLogItem {
  id: string
  level: string
  message: string
  stack: string | null
  path: string | null
  userId: string | null
  userName?: string | null
  userEmail?: string | null
  meta: string | null
  createdAt: string
}

const activeTab = ref<'activity' | 'system'>('activity')

// ── Activity ──
const activityLogs = ref<ActivityLogItem[]>([])
const activityTotal = ref(0)
const activityPage = ref(1)
const activityLimit = 50
const activityFilter = ref('')
const activityPending = ref(false)

// ── System ──
const systemLogs = ref<SystemLogItem[]>([])
const systemTotal = ref(0)
const systemPage = ref(1)
const systemLimit = 50
const systemFilter = ref('')
const systemPending = ref(false)

const selectedLog = ref<SystemLogItem | null>(null)
const selectedActivity = ref<ActivityLogItem | null>(null)

const loadActivity = async (page = 1) => {
  activityPending.value = true
  activityPage.value = page
  const params: Record<string, string | number> = {
    type: 'activity',
    page,
    limit: activityLimit,
  }
  if (activityFilter.value) params.action = activityFilter.value
  try {
    const data = await $fetch<{ total: number; logs: ActivityLogItem[] }>('/api/admin/logs', { params })
    activityLogs.value = data.logs
    activityTotal.value = data.total
  } finally {
    activityPending.value = false
  }
}

const loadSystem = async (page = 1) => {
  systemPending.value = true
  systemPage.value = page
  const params: Record<string, string | number> = {
    type: 'system',
    page,
    limit: systemLimit,
  }
  if (systemFilter.value) params.level = systemFilter.value
  try {
    const data = await $fetch<{ total: number; logs: SystemLogItem[] }>('/api/admin/logs', { params })
    systemLogs.value = data.logs
    systemTotal.value = data.total
  } finally {
    systemPending.value = false
  }
}

const switchTab = (tab: 'activity' | 'system') => {
  activeTab.value = tab
  if (tab === 'activity' && !activityLogs.value.length) loadActivity()
  if (tab === 'system' && !systemLogs.value.length) loadSystem()
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

const actionBadgeClass = (action: string) => {
  if (action.includes('DELETE') || action.includes('CANCEL') || action.includes('REJECT'))
    return 'badge-error'
  if (action.includes('CREATE') || action.includes('APPROVE') || action === 'LOGIN')
    return 'badge-success'
  if (action.includes('UPDATE'))
    return 'badge-warning'
  return 'badge-ghost'
}

const levelBadgeClass = (level: string) => {
  if (level === 'error') return 'badge-error'
  if (level === 'warn') return 'badge-warning'
  return 'badge-info'
}

const copied = ref(false)
const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const prettyMeta = (meta: string) => {
  try { return JSON.stringify(JSON.parse(meta), null, 2) } catch { return meta }
}

onMounted(() => {
  loadActivity()
  loadSystem()
})
</script>
