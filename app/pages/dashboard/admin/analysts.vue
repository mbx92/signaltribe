<template>
  <div class="space-y-6">
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
        <p class="text-2xl font-bold text-warning">5</p>
        <p class="text-xs text-base-content/50 mt-1">Oldest: 4 days ago</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 mb-1">Approved Analysts</p>
        <p class="text-2xl font-bold">42</p>
        <p class="text-xs text-base-content/50 mt-1">Avg win rate: 63%</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 mb-1">Applications This Month</p>
        <p class="text-2xl font-bold text-primary">12</p>
        <p class="text-xs text-success mt-1 flex items-center gap-1">
          <IconTrendingUp class="w-3 h-3" /> +4 vs last month
        </p>
      </div>
    </div>

    <!-- Pending list -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-4 border-b border-base-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="flex items-center gap-2">
          <h2 class="font-semibold text-base">Pending Applications</h2>
          <span class="badge badge-warning badge-sm">5</span>
        </div>
        <div class="flex flex-wrap gap-2 md:justify-end">
          <select class="select select-sm select-bordered w-40">
            <option>All niches</option>
            <option>Crypto</option>
            <option>Forex</option>
            <option>Stocks</option>
            <option>Commodities</option>
          </select>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table table-sm w-full">
            <thead>
              <tr class="bg-base-200/60 text-xs">
                <th>Applicant</th>
                <th>Niche</th>
                <th>Experience</th>
                <th>Metrics (self-reported)</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-8 h-8 rounded-full bg-base-300">
                        <img src="https://i.pravatar.cc/150?u=david_chen" />
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">David Chen</p>
                      <p class="text-xs text-base-content/50">Applied 2 days ago</p>
                    </div>
                  </div>
                </td>
                <td>Crypto / DeFi</td>
                <td>7 years</td>
                <td>
                  <p class="text-xs">Win rate: <span class="text-success font-semibold">68%</span></p>
                  <p class="text-xs">Avg R:R: 1:2.4</p>
                </td>
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <button class="btn btn-xs btn-ghost text-error">Reject</button>
                    <button class="btn btn-xs btn-primary">Approve</button>
                  </div>
                </td>
              </tr>

              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-8 h-8 rounded-full bg-base-300">
                        <img src="https://i.pravatar.cc/150?u=elena_r" />
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">Elena Rodriguez</p>
                      <p class="text-xs text-base-content/50">Applied 3 days ago</p>
                    </div>
                  </div>
                </td>
                <td>Commodities</td>
                <td>10 years</td>
                <td>
                  <p class="text-xs">Win rate: <span class="text-success font-semibold">61%</span></p>
                  <p class="text-xs">Avg R:R: 1:3.0</p>
                </td>
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <button class="btn btn-xs btn-ghost text-error">Reject</button>
                    <button class="btn btn-xs btn-primary">Approve</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Existing analysts (compact) -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-4 border-b border-base-200 flex items-center justify-between">
        <h2 class="font-semibold text-base">Existing Analysts</h2>
        <span class="text-xs text-base-content/50">Top 5 by subscribers</span>
      </div>
      <div class="card-body p-4">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
              </div>
            </div>
            <div class="grow min-w-0">
              <p class="text-sm font-semibold">Marcus Macro</p>
              <p class="text-xs text-base-content/50">2,100 subs · 58% win · 1:4.2 R:R</p>
            </div>
            <button class="btn btn-xs btn-ghost">View</button>
          </div>

          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              </div>
            </div>
            <div class="grow min-w-0">
              <p class="text-sm font-semibold">Alex Crypto</p>
              <p class="text-xs text-base-content/50">1,240 subs · 72% win · 1:2.4 R:R</p>
            </div>
            <button class="btn btn-xs btn-ghost">View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconTrendingUp } from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })
</script>
