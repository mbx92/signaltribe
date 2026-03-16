<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">Platform Overview</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Sunday, June 15 — 5 items need your attention.</p>
      </div>
      <button class="btn btn-outline btn-sm gap-2">
        <IconReportAnalytics class="w-4 h-4"/> Export Report
      </button>
    </div>

    <!-- Alert Banner -->
    <div role="alert" class="alert border border-warning/30 bg-warning/10 py-3">
      <IconAlertTriangle class="w-5 h-5 text-warning shrink-0"/>
      <div>
        <p class="font-semibold text-sm">5 pending analyst applications</p>
        <p class="text-xs text-base-content/60">Applications are awaiting review. Oldest is 4 days old.</p>
      </div>
      <NuxtLink to="/dashboard/admin/analysts" class="btn btn-warning btn-xs ml-auto shrink-0">Review Now</NuxtLink>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Total Users</p>
        <p class="text-2xl font-extrabold text-primary">12,540</p>
        <p class="text-xs text-success/80 mt-1">↑ +8% this month</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Active Analysts</p>
        <p class="text-2xl font-extrabold">42</p>
        <p class="text-xs text-warning mt-1">5 awaiting approval</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Platform MRR</p>
        <p class="text-2xl font-extrabold text-secondary">$85K</p>
        <p class="text-xs text-success/80 mt-1">↑ +12% this month</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Active Signals</p>
        <p class="text-2xl font-extrabold">128</p>
        <p class="text-xs text-base-content/40 mt-1">Platform-wide today</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Pending Analyst Approvals -->
      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-base">Pending Analyst Applications</h2>
            <NuxtLink to="/dashboard/admin/analysts" class="btn btn-ghost btn-xs">View All →</NuxtLink>
          </div>
          <div class="space-y-3">

            <div class="flex items-center gap-3 p-3 rounded-lg border border-base-300 hover:bg-base-200/60 transition-colors">
              <div class="avatar shrink-0">
                <div class="w-10 h-10 rounded-full"><img src="https://i.pravatar.cc/150?u=david_chen" /></div>
              </div>
              <div class="grow min-w-0">
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-sm">David Chen</p>
                  <span class="badge badge-ghost badge-xs">Crypto / DeFi</span>
                </div>
                <p class="text-xs text-base-content/50">Applied 2 days ago · 7 yrs experience</p>
              </div>
              <div class="flex gap-2 shrink-0">
                <button class="btn btn-xs btn-ghost text-error">Reject</button>
                <button class="btn btn-xs btn-primary">Review</button>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-lg border border-base-300 hover:bg-base-200/60 transition-colors">
              <div class="avatar shrink-0">
                <div class="w-10 h-10 rounded-full"><img src="https://i.pravatar.cc/150?u=elena_r" /></div>
              </div>
              <div class="grow min-w-0">
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-sm">Elena Rodriguez</p>
                  <span class="badge badge-ghost badge-xs">Commodities</span>
                </div>
                <p class="text-xs text-base-content/50">Applied 3 days ago · 10 yrs experience</p>
              </div>
              <div class="flex gap-2 shrink-0">
                <button class="btn btn-xs btn-ghost text-error">Reject</button>
                <button class="btn btn-xs btn-primary">Review</button>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-lg border border-base-300 hover:bg-base-200/60 transition-colors">
              <div class="avatar shrink-0">
                <div class="w-10 h-10 rounded-full"><img src="https://i.pravatar.cc/150?u=tommy_fx" /></div>
              </div>
              <div class="grow min-w-0">
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-sm">Tommy Hartono</p>
                  <span class="badge badge-ghost badge-xs">Forex / Indices</span>
                </div>
                <p class="text-xs text-base-content/50">Applied 4 days ago · 5 yrs experience</p>
              </div>
              <div class="flex gap-2 shrink-0">
                <button class="btn btn-xs btn-ghost text-error">Reject</button>
                <button class="btn btn-xs btn-primary">Review</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Right column: top analysts + recent subs -->
      <div class="space-y-5">
        <!-- Top Analysts by Revenue -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <h2 class="font-bold text-base mb-3">Top Analysts by Revenue</h2>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-5 text-center text-xs font-bold text-base-content/40">1</div>
                <div class="avatar shrink-0"><div class="w-8 h-8 rounded-full"><img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" /></div></div>
                <div class="grow min-w-0">
                  <p class="text-sm font-semibold">Marcus Macro</p>
                  <p class="text-xs text-base-content/40">2,100 subs</p>
                </div>
                <p class="text-sm font-bold text-secondary shrink-0">$165K</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-5 text-center text-xs font-bold text-base-content/40">2</div>
                <div class="avatar shrink-0"><div class="w-8 h-8 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" /></div></div>
                <div class="grow min-w-0">
                  <p class="text-sm font-semibold">Alex Crypto</p>
                  <p class="text-xs text-base-content/40">1,240 subs</p>
                </div>
                <p class="text-sm font-bold text-secondary shrink-0">$60K</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-5 text-center text-xs font-bold text-base-content/40">3</div>
                <div class="avatar shrink-0"><div class="w-8 h-8 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" /></div></div>
                <div class="grow min-w-0">
                  <p class="text-sm font-semibold">Sarah FX</p>
                  <p class="text-xs text-base-content/40">850 subs</p>
                </div>
                <p class="text-sm font-bold text-secondary shrink-0">$29K</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <h2 class="font-bold text-base mb-3">Recent Transactions</h2>
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <div>
                  <p class="font-medium">user_8492 → Alex Crypto</p>
                  <p class="text-xs text-base-content/40">2 min ago</p>
                </div>
                <div class="text-right">
                  <p class="font-mono font-bold">$49</p>
                  <span class="badge badge-success badge-xs">Paid</span>
                </div>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between items-center text-sm">
                <div>
                  <p class="font-medium">trader_pro → Sarah FX</p>
                  <p class="text-xs text-base-content/40">18 min ago</p>
                </div>
                <div class="text-right">
                  <p class="font-mono font-bold">$35</p>
                  <span class="badge badge-success badge-xs">Paid</span>
                </div>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between items-center text-sm">
                <div>
                  <p class="font-medium">new_guy99 → Marcus Macro</p>
                  <p class="text-xs text-base-content/40">1 hr ago</p>
                </div>
                <div class="text-right">
                  <p class="font-mono font-bold">$79</p>
                  <span class="badge badge-warning badge-xs">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconAlertTriangle, IconReportAnalytics } from '@tabler/icons-vue'
definePageMeta({ layout: 'dashboard' })
</script>
