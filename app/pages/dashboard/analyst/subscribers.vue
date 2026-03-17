<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">My Subscribers</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Manage your 1,240 active followers.</p>
      </div>
      <button class="btn btn-outline btn-sm gap-2">
        <IconDownload class="w-4 h-4"/> Export CSV
      </button>
    </div>

    <!-- Subscriber Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card bg-base-100 border border-base-300 p-5">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-base-content/60 font-medium mb-1">Active Subscribers</p>
            <p class="text-3xl font-bold">1,240</p>
          </div>
          <div class="p-2 bg-primary/10 rounded-lg text-primary">
            <IconUsersGroup class="w-6 h-6"/>
          </div>
        </div>
        <p class="text-xs text-success font-medium mt-3 flex items-center gap-1">
          <IconTrendingUp class="w-3 h-3"/> +12% vs last month
        </p>
      </div>

      <div class="card bg-base-100 border border-base-300 p-5">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-base-content/60 font-medium mb-1">Monthly Retention</p>
            <p class="text-3xl font-bold">94.2%</p>
          </div>
          <div class="p-2 bg-secondary/10 rounded-lg text-secondary">
            <IconUserCheck class="w-6 h-6"/>
          </div>
        </div>
        <p class="text-xs text-success font-medium mt-3 flex items-center gap-1">
          <IconTrendingUp class="w-3 h-3"/> +2.1% vs last month
        </p>
      </div>

      <div class="card bg-base-100 border border-base-300 p-5">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-base-content/60 font-medium mb-1">Est. Monthly Revenue</p>
            <p class="text-3xl font-bold">$42.8K</p>
          </div>
          <div class="p-2 bg-success/10 rounded-lg text-success">
            <IconCash class="w-6 h-6"/>
          </div>
        </div>
        <p class="text-xs text-base-content/50 font-medium mt-3">
          Before platform fees
        </p>
      </div>
    </div>

    <!-- Subscribers Table -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <div class="p-4 border-b border-base-200 flex flex-col sm:flex-row justify-between gap-4">
          <label class="input input-sm input-bordered w-64 flex items-center gap-2">
            <IconSearch class="w-4 h-4 text-base-content/50" />
            <input type="text" class="grow" placeholder="Search subscribers..." />
          </label>
          <select class="select select-sm select-bordered w-full sm:w-auto">
            <option>All Status</option>
            <option>Active</option>
            <option>Canceled</option>
            <option>Past Due</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr class="bg-base-200/50">
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">User</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Status</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Subscribed Since</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Next Billing</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <!-- User 1 -->
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar"><div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">TR</div></div>
                    <div>
                      <p class="font-semibold text-sm">trader_rick</p>
                      <p class="text-xs text-base-content/50">rick@example.com</p>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-success badge-sm badge-outline">Active</span></td>
                <td class="text-sm">Jan 12, 2024</td>
                <td class="text-sm">Jul 12, 2025</td>
                <td class="text-right font-mono text-sm">$49.00</td>
              </tr>
              <!-- User 2 -->
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar"><div class="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">JS</div></div>
                    <div>
                      <p class="font-semibold text-sm">j_smith99</p>
                      <p class="text-xs text-base-content/50">jsmith@example.com</p>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-success badge-sm badge-outline">Active</span></td>
                <td class="text-sm">Mar 05, 2025</td>
                <td class="text-sm">Jun 05, 2025</td>
                <td class="text-right font-mono text-sm">$49.00</td>
              </tr>
              <!-- User 3 -->
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar"><div class="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center font-bold text-xs">MB</div></div>
                    <div>
                      <p class="font-semibold text-sm">moonboy_42</p>
                      <p class="text-xs text-base-content/50">hidden</p>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-warning badge-sm badge-outline">Past Due</span></td>
                <td class="text-sm">Nov 22, 2024</td>
                <td class="text-sm text-error font-medium">May 22, 2025 (Failed)</td>
                <td class="text-right font-mono text-sm">$49.00</td>
              </tr>
              <!-- User 4 -->
              <tr class="hover bg-base-200/30 opacity-70">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar grayscale"><div class="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center font-bold text-xs">AL</div></div>
                    <div>
                      <p class="font-semibold text-sm">alice_trades</p>
                      <p class="text-xs text-base-content/50">alice@example.com</p>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-ghost badge-sm">Canceled</span></td>
                <td class="text-sm">Jan 01, 2025</td>
                <td class="text-sm">-</td>
                <td class="text-right font-mono text-sm">$49.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="p-4 border-t border-base-200 flex items-center justify-between">
          <p class="text-xs text-base-content/50">Showing 1 to 10 of 1,240 subscribers</p>
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
import { 
  IconDownload, 
  IconUsersGroup, 
  IconUserCheck, 
  IconCash,
  IconTrendingUp,
  IconSearch
} from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })
</script>
