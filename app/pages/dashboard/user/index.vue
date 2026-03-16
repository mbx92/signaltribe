<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">Good morning, Budi 👋</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Here's what's happening with your subscriptions today.</p>
      </div>
      <NuxtLink to="/#analysts" class="btn btn-primary btn-sm gap-2">
        <IconSearch class="w-4 h-4"/> Find Analysts
      </NuxtLink>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Active Subs</p>
        <p class="text-2xl font-extrabold text-primary">3</p>
        <p class="text-xs text-base-content/40 mt-1">2 renewing soon</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">New Signals (24h)</p>
        <p class="text-2xl font-extrabold text-success">8</p>
        <p class="text-xs text-success/70 mt-1">↑ 3 vs yesterday</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Journal Updates</p>
        <p class="text-2xl font-extrabold">5</p>
        <p class="text-xs text-base-content/40 mt-1">Unread entries</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Win Rate (followed)</p>
        <p class="text-2xl font-extrabold text-secondary">69%</p>
        <p class="text-xs text-base-content/40 mt-1">Across all analysts</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Signal Feed -->
      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-base">Latest Signals</h2>
            <NuxtLink to="/dashboard/user/signals" class="btn btn-ghost btn-xs">View All →</NuxtLink>
          </div>

          <div class="space-y-3">
            <!-- Signal Item -->
            <div class="flex items-center gap-3 p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors cursor-pointer">
              <div class="avatar shrink-0">
                <div class="w-9 h-9 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" /></div>
              </div>
              <div class="grow min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm font-mono">BTC/USDT</span>
                  <span class="badge badge-success badge-xs font-bold">LONG</span>
                  <span class="badge badge-warning badge-xs">Active</span>
                </div>
                <p class="text-xs text-base-content/50 mt-0.5">Alex Crypto · 10 min ago</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-base-content/50">Entry</p>
                <p class="font-mono font-bold text-sm">64,200</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-success">TP1</p>
                <p class="font-mono font-bold text-sm text-success">66,500</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-error">SL</p>
                <p class="font-mono font-bold text-sm text-error">63,000</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors cursor-pointer">
              <div class="avatar shrink-0">
                <div class="w-9 h-9 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" /></div>
              </div>
              <div class="grow min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm font-mono">EUR/USD</span>
                  <span class="badge badge-error badge-xs font-bold">SHORT</span>
                  <span class="badge badge-warning badge-xs">Active</span>
                </div>
                <p class="text-xs text-base-content/50 mt-0.5">Sarah FX · 2 hrs ago</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-base-content/50">Entry</p>
                <p class="font-mono font-bold text-sm">1.0840</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-success">TP1</p>
                <p class="font-mono font-bold text-sm text-success">1.0780</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-error">SL</p>
                <p class="font-mono font-bold text-sm text-error">1.0890</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors cursor-pointer">
              <div class="avatar shrink-0">
                <div class="w-9 h-9 rounded-full"><img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" /></div>
              </div>
              <div class="grow min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm font-mono">AAPL</span>
                  <span class="badge badge-success badge-xs font-bold">LONG</span>
                  <span class="badge badge-ghost badge-xs">TP1 Hit ✓</span>
                </div>
                <p class="text-xs text-base-content/50 mt-0.5">Marcus Macro · Yesterday</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-base-content/50">Entry</p>
                <p class="font-mono font-bold text-sm">175.50</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-success">TP1 ✓</p>
                <p class="font-mono font-bold text-sm text-success">178.00</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-error">SL</p>
                <p class="font-mono font-bold text-sm text-error">173.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Subscriptions -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-base">My Subscriptions</h2>
            <NuxtLink to="/dashboard/user/subscriptions" class="btn btn-ghost btn-xs">Manage →</NuxtLink>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="avatar online shrink-0">
                <div class="w-10 h-10 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" /></div>
              </div>
              <div class="grow min-w-0">
                <p class="font-semibold text-sm">Alex Crypto</p>
                <p class="text-xs text-base-content/40">Renews Jun 18</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs font-bold text-success">72%</p>
                <p class="text-xs text-base-content/40">Win</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="avatar online shrink-0">
                <div class="w-10 h-10 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" /></div>
              </div>
              <div class="grow min-w-0">
                <p class="font-semibold text-sm">Sarah FX</p>
                <p class="text-xs text-warning">Renews Jun 16 ⚠</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs font-bold text-success">65%</p>
                <p class="text-xs text-base-content/40">Win</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="avatar shrink-0">
                <div class="w-10 h-10 rounded-full"><img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" /></div>
              </div>
              <div class="grow min-w-0">
                <p class="font-semibold text-sm">Marcus Macro</p>
                <p class="text-xs text-base-content/40">Renews Jul 2</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs font-bold text-warning">58%</p>
                <p class="text-xs text-base-content/40">Win</p>
              </div>
            </div>

            <div class="divider my-1"></div>
            <button class="btn btn-primary btn-sm w-full gap-2">
              <IconPlus class="w-4 h-4"/> Add Analyst
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconSearch, IconPlus } from '@tabler/icons-vue'
definePageMeta({ layout: 'dashboard' })
</script>
