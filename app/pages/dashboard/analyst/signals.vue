<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Signal History</h1>
        <p class="text-sm text-base-content/50 mt-0.5">View and manage all signals you have published.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div class="relative w-full md:w-72">
        <IconSearch
          class="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        />
        <input
          type="text"
          placeholder="Search pair or note..."
          class="input input-bordered w-full pl-9 pr-3 input-sm"
        />
      </div>

      <div class="flex flex-wrap gap-2">
        <div class="join">
          <button class="btn btn-xs join-item btn-active">All</button>
          <button class="btn btn-xs join-item">Active</button>
          <button class="btn btn-xs join-item">Closed</button>
          <button class="btn btn-xs join-item">Draft</button>
        </div>
        <select class="select select-sm select-bordered w-full md:w-40">
          <option>Timeframe: Any</option>
          <option>15m</option>
          <option>1H</option>
          <option>4H</option>
          <option>1D</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table table-sm w-full">
            <thead>
              <tr class="bg-base-200/60 text-xs">
                <th>Pair</th>
                <th>Dir.</th>
                <th>Entry</th>
                <th>TP1</th>
                <th>SL</th>
                <th>Status</th>
                <th>Opened</th>
                <th>Closed</th>
                <th class="text-right">P/L (R)</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <!-- Active LONG -->
              <tr class="hover">
                <td class="font-mono font-semibold">BTC/USDT</td>
                <td><span class="badge badge-success badge-xs">LONG</span></td>
                <td class="font-mono">64,200</td>
                <td class="font-mono text-success">66,500</td>
                <td class="font-mono text-error">63,000</td>
                <td><span class="badge badge-warning badge-xs">Active</span></td>
                <td class="text-xs text-base-content/60">Today · 10:14</td>
                <td class="text-xs text-base-content/40">—</td>
                <td class="text-right font-mono text-success">+0.8R</td>
              </tr>

              <!-- Active SHORT -->
              <tr class="hover">
                <td class="font-mono font-semibold">ETH/USDT</td>
                <td><span class="badge badge-error badge-xs">SHORT</span></td>
                <td class="font-mono">3,450</td>
                <td class="font-mono text-success">3,300</td>
                <td class="font-mono text-error">3,520</td>
                <td><span class="badge badge-warning badge-xs">Active</span></td>
                <td class="text-xs text-base-content/60">Today · 09:02</td>
                <td class="text-xs text-base-content/40">—</td>
                <td class="text-right font-mono text-error">-0.3R</td>
              </tr>

              <!-- Closed TP -->
              <tr class="hover bg-base-200/40">
                <td class="font-mono font-semibold">SOL/USDT</td>
                <td><span class="badge badge-success badge-xs">LONG</span></td>
                <td class="font-mono">155.00</td>
                <td class="font-mono text-success">168.00</td>
                <td class="font-mono text-error">149.00</td>
                <td><span class="badge badge-success badge-xs">TP Hit</span></td>
                <td class="text-xs text-base-content/60">Yesterday · 11:30</td>
                <td class="text-xs text-base-content/60">Yesterday · 18:10</td>
                <td class="text-right font-mono text-success font-semibold">+2.3R</td>
              </tr>

              <!-- Closed SL -->
              <tr class="hover bg-base-200/40">
                <td class="font-mono font-semibold">AAPL</td>
                <td><span class="badge badge-error badge-xs">SHORT</span></td>
                <td class="font-mono">172.50</td>
                <td class="font-mono text-success">168.00</td>
                <td class="font-mono text-error">174.50</td>
                <td><span class="badge badge-ghost badge-xs text-error">SL Hit</span></td>
                <td class="text-xs text-base-content/60">3 days ago</td>
                <td class="text-xs text-base-content/60">2 days ago</td>
                <td class="text-right font-mono text-error font-semibold">-1.0R</td>
              </tr>

              <!-- Draft -->
              <tr class="hover opacity-70">
                <td class="font-mono font-semibold">EUR/USD</td>
                <td><span class="badge badge-neutral badge-xs">Draft</span></td>
                <td class="font-mono text-base-content/50">—</td>
                <td class="font-mono text-base-content/50">—</td>
                <td class="font-mono text-base-content/50">—</td>
                <td><span class="badge badge-ghost badge-xs">Draft</span></td>
                <td class="text-xs text-base-content/60">Saved 1 hr ago</td>
                <td class="text-xs text-base-content/40">—</td>
                <td class="text-right font-mono text-base-content/40">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 border-t border-base-200 flex items-center justify-between">
          <p class="text-xs text-base-content/50">Showing last 25 signals</p>
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
import { IconSearch } from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })
</script>
