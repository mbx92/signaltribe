<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">User Management</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Overview of all traders, analysts, and admins on the platform.</p>
      </div>
    </div>

    <!-- Filters & actions -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div class="relative w-full md:w-80">
        <IconSearch
          class="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        />
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          class="input input-bordered w-full pl-9 pr-3 input-sm"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <select class="select select-sm select-bordered w-32">
          <option>All roles</option>
          <option>Trader</option>
          <option>Analyst</option>
          <option>Admin</option>
        </select>
        <select class="select select-sm select-bordered w-32">
          <option>All status</option>
          <option>Active</option>
          <option>Suspended</option>
          <option>Pending</option>
        </select>
      </div>
    </div>

    <!-- Users table -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table table-sm w-full">
            <thead>
              <tr class="bg-base-200/60 text-xs">
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last login</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <!-- Trader -->
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        BS
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">budi_scalper</p>
                      <p class="text-xs text-base-content/50">budi@example.com</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-sm badge-outline">Trader</span>
                </td>
                <td>
                  <span class="badge badge-sm badge-success badge-outline">Active</span>
                </td>
                <td class="text-xs text-base-content/60">Jan 05, 2024</td>
                <td class="text-xs text-base-content/60">Today · 09:34</td>
                <td class="text-right">
                  <div class="join justify-end">
                    <button class="btn btn-xs btn-ghost join-item">Details</button>
                    <button class="btn btn-xs btn-ghost join-item">
                      <IconDotsVertical class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Analyst -->
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold">
                        AC
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">Alex Crypto</p>
                      <p class="text-xs text-base-content/50">alex@signals.io</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-sm badge-secondary badge-outline">Analyst</span>
                </td>
                <td>
                  <span class="badge badge-sm badge-success badge-outline">Active</span>
                </td>
                <td class="text-xs text-base-content/60">Aug 12, 2023</td>
                <td class="text-xs text-base-content/60">Yesterday · 22:11</td>
                <td class="text-right">
                  <div class="join justify-end">
                    <button class="btn btn-xs btn-ghost join-item">Details</button>
                    <button class="btn btn-xs btn-ghost join-item text-warning">Suspend</button>
                  </div>
                </td>
              </tr>

              <!-- Suspended user -->
              <tr class="hover bg-base-200/40">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center text-xs font-bold">
                        MB
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">moonboy_42</p>
                      <p class="text-xs text-base-content/50">hidden</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-sm badge-outline">Trader</span>
                </td>
                <td>
                  <span class="badge badge-sm badge-error badge-outline">Suspended</span>
                </td>
                <td class="text-xs text-base-content/60">Nov 22, 2023</td>
                <td class="text-xs text-base-content/60">May 22, 2025</td>
                <td class="text-right">
                  <div class="join justify-end">
                    <button class="btn btn-xs btn-ghost join-item text-success">Reinstate</button>
                    <button class="btn btn-xs btn-ghost join-item text-error">Ban</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 border-t border-base-200 flex items-center justify-between">
          <p class="text-xs text-base-content/50">Showing 1–25 of 12,540 users</p>
          <div class="join">
            <button class="join-item btn btn-xs">Prev</button>
            <button class="join-item btn btn-xs btn-active">1</button>
            <button class="join-item btn btn-xs">2</button>
            <button class="join-item btn btn-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconSearch, IconDotsVertical } from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })
</script>
