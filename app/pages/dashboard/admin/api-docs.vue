<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">API Documentation</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Interactive OpenAPI 3.0 reference for all SignalTribe endpoints.</p>
      </div>
      <div class="flex gap-2">
        <a href="/openapi.json" download="openapi.json" class="btn btn-ghost btn-sm gap-2">
          <IconDownload class="w-4 h-4" /> Download Spec
        </a>
        <a href="/api-docs" target="_blank" class="btn btn-outline btn-sm gap-2">
          <IconExternalLink class="w-4 h-4" /> Open Full Page
        </a>
      </div>
    </div>

    <!-- Info cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Total Endpoints</p>
        <p class="text-2xl font-bold text-primary">27</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Auth Scheme</p>
        <p class="text-sm font-bold">Cookie (st_session)</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Spec Version</p>
        <p class="text-sm font-bold">OpenAPI 3.0.3</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Base URL</p>
        <p class="text-sm font-bold font-mono">/api</p>
      </div>
    </div>

    <!-- Endpoint groups quick reference -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-4 border-b border-base-200">
        <h2 class="font-semibold text-base">Endpoint Groups</h2>
      </div>
      <div class="card-body p-4">
        <div class="overflow-x-auto">
          <table class="table table-sm w-full">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase">
                <th>Group</th>
                <th>Endpoints</th>
                <th>Auth Required</th>
                <th>Min Role</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="g in groups" :key="g.name" class="hover">
                <td class="font-medium">{{ g.name }}</td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <code v-for="ep in g.endpoints" :key="ep" class="text-[11px] bg-base-200 px-1.5 py-0.5 rounded font-mono">{{ ep }}</code>
                  </div>
                </td>
                <td>
                  <span v-if="g.auth" class="badge badge-sm badge-soft badge-warning">Yes</span>
                  <span v-else class="badge badge-sm badge-soft badge-ghost">Public</span>
                </td>
                <td>
                  <span class="badge badge-sm badge-soft" :class="roleBadge(g.role)">{{ g.role }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Embedded Swagger UI -->
    <div class="card bg-base-100 border border-base-300 overflow-hidden">
      <div class="card-body p-4 border-b border-base-200 flex flex-row items-center justify-between">
        <h2 class="font-semibold text-base">Interactive Explorer</h2>
        <span class="badge badge-soft badge-success badge-sm">Live</span>
      </div>
      <div class="p-0">
        <iframe
          src="/api-docs"
          class="w-full border-0"
          :style="{ height: iframeHeight }"
          title="Swagger UI"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconDownload, IconExternalLink } from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })

const iframeHeight = ref('820px')

onMounted(() => {
  // Adjust iframe height based on viewport
  const h = Math.max(820, window.innerHeight - 260)
  iframeHeight.value = `${h}px`
})

const groups = [
  { name: 'Auth', endpoints: ['POST /auth/login', 'POST /auth/logout', 'GET /auth/me'], auth: false, role: 'Public' },
  { name: 'Signals', endpoints: ['GET /signals', 'POST /signals', 'PUT /signals/:id', 'DELETE /signals/:id'], auth: true, role: 'analyst (write)' },
  { name: 'Journals', endpoints: ['GET /journals', 'POST /journals', 'PUT /journals/:id', 'DELETE /journals/:id'], auth: true, role: 'analyst (write)' },
  { name: 'Subscriptions', endpoints: ['GET /subscriptions', 'POST /subscriptions', 'DELETE /subscriptions/:id'], auth: true, role: 'any' },
  { name: 'Notifications', endpoints: ['GET /notifications', 'POST /notifications/read-all'], auth: true, role: 'any' },
  { name: 'Settings', endpoints: ['GET /settings', 'PUT /settings'], auth: false, role: 'admin (write)' },
  { name: 'Analysts', endpoints: ['GET /analysts', 'GET /analysts/subscribers', 'GET /users/analysts'], auth: false, role: 'analyst (subscribers)' },
  { name: 'Dashboard', endpoints: ['GET /dashboard/admin', 'GET /dashboard/analyst', 'GET /dashboard/user'], auth: true, role: 'role-specific' },
  { name: 'Admin — Users', endpoints: ['GET /admin/users', 'POST /admin/users'], auth: true, role: 'admin' },
  { name: 'Admin — Analysts', endpoints: ['GET /admin/analysts', 'PUT /admin/analysts/:id'], auth: true, role: 'admin' },
  { name: 'Admin — Logs', endpoints: ['GET /admin/logs'], auth: true, role: 'admin' },
]

const roleBadge = (role: string) => {
  if (role === 'admin') return 'badge-error'
  if (role.startsWith('analyst')) return 'badge-secondary'
  if (role === 'Public') return 'badge-ghost'
  return 'badge-primary'
}
</script>
