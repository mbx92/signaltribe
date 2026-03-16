<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">My Subscriptions</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Manage your active analysts and billing.</p>
      </div>
      <NuxtLink to="/#analysts" class="btn btn-primary btn-sm gap-2">
        <IconPlus class="w-4 h-4"/> Add Analyst
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Active Sub: Alex -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-5 flex flex-col h-full">
          <div class="flex justify-between items-start w-full mb-6 gap-2">
            <div class="flex items-center gap-3">
              <div class="avatar online shrink-0">
                <div class="w-12 h-12 rounded-full bg-base-200">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                </div>
              </div>
              <div class="flex flex-col items-start">
                <p class="font-bold text-base leading-tight">Alex Crypto</p>
                <div class="badge badge-success badge-sm badge-outline mt-1.5">Active</div>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="font-bold text-lg leading-tight">$49<span class="text-xs text-base-content/50 font-normal">/mo</span></p>
            </div>
          </div>
          
          <div class="space-y-3 mb-6 grow">
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Subscribed on</span>
              <span class="font-medium text-base-content">Jan 18, 2025</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Next billing</span>
              <span class="font-medium text-base-content">Jun 18, 2025</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Signals received</span>
              <span class="font-medium text-base-content">342</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Win rate (your sub)</span>
              <span class="font-medium text-success">71.5%</span>
            </div>
          </div>

          <div class="flex gap-2 mt-auto pt-2 border-t border-base-200/50">
            <button class="btn btn-sm btn-outline grow">View Profile</button>
            <button class="btn btn-sm btn-ghost text-error">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Active Sub: Sarah -->
      <div class="card bg-base-100 border border-warning/50 shadow-md">
        <div class="card-body p-5 flex flex-col h-full">
          <div class="flex justify-between items-start w-full mb-6 gap-2">
            <div class="flex items-center gap-3">
              <div class="avatar online shrink-0">
                <div class="w-12 h-12 rounded-full bg-base-200">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                </div>
              </div>
              <div class="flex flex-col items-start">
                <p class="font-bold text-base leading-tight">Sarah FX</p>
                <div class="badge badge-warning badge-sm badge-outline mt-1.5">Renews Tomorrow</div>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="font-bold text-lg leading-tight">$35<span class="text-xs text-base-content/50 font-normal">/mo</span></p>
            </div>
          </div>
          
          <div class="space-y-3 mb-6 grow">
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Subscribed on</span>
              <span class="font-medium text-base-content">Mar 16, 2025</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Next billing</span>
              <span class="font-bold text-warning">Jun 16, 2025</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Signals received</span>
              <span class="font-medium text-base-content">68</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Win rate (your sub)</span>
              <span class="font-medium text-success">64.0%</span>
            </div>
          </div>

          <div class="flex gap-2 mt-auto pt-2 border-t border-base-200/50">
            <button class="btn btn-sm btn-outline grow">View Profile</button>
            <button class="btn btn-sm btn-ghost text-error">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Active Sub: Marcus -->
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-5 flex flex-col h-full">
          <div class="flex justify-between items-start w-full mb-6 gap-2">
            <div class="flex items-center gap-3">
              <div class="avatar shrink-0">
                <div class="w-12 h-12 rounded-full bg-base-200">
                  <img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                </div>
              </div>
              <div class="flex flex-col items-start">
                <p class="font-bold text-base leading-tight">Marcus Macro</p>
                <div class="badge badge-success badge-sm badge-outline mt-1.5">Active</div>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="font-bold text-lg leading-tight">$79<span class="text-xs text-base-content/50 font-normal">/mo</span></p>
            </div>
          </div>
          
          <div class="space-y-3 mb-6 grow">
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Subscribed on</span>
              <span class="font-medium text-base-content">May 02, 2025</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Next billing</span>
              <span class="font-medium text-base-content">Jul 02, 2025</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Signals received</span>
              <span class="font-medium text-base-content">12</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-base-content/60">Win rate (your sub)</span>
              <span class="font-medium text-warning">55.5%</span>
            </div>
          </div>

          <div class="flex gap-2 mt-auto pt-2 border-t border-base-200/50">
            <button class="btn btn-sm btn-outline grow">View Profile</button>
            <button class="btn btn-sm btn-ghost text-error">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Canceled Sub -->
      <div class="card bg-base-200/50 border border-base-300">
        <div class="card-body p-5 flex flex-col h-full opacity-70">
          <div class="flex justify-between items-start w-full mb-6 gap-2">
            <div class="flex items-center gap-3">
              <div class="avatar grayscale shrink-0">
                <div class="w-12 h-12 rounded-full bg-base-300">
                  <img src="https://i.pravatar.cc/150?u=some_old_analyst" />
                </div>
              </div>
              <div class="flex flex-col items-start">
                <p class="font-bold text-base leading-tight">Jimmy Daytrade</p>
                <div class="badge badge-ghost badge-sm mt-1.5">Canceled</div>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="font-bold text-lg leading-tight text-base-content/50">$25<span class="text-xs font-normal">/mo</span></p>
            </div>
          </div>
          
          <div class="space-y-3 mb-6 grow text-base-content/70">
            <div class="flex justify-between items-center text-sm">
              <span>Subscribed on</span>
              <span>Feb 10, 2025</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span>Ended on</span>
              <span>Apr 10, 2025</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span>Signals received</span>
              <span>145</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span>Win rate</span>
              <span class="text-error font-medium">42.0%</span>
            </div>
          </div>

          <div class="flex gap-2 mt-auto pt-2 border-t border-base-300">
            <button class="btn btn-sm btn-ghost bg-base-200 grow">Resubscribe</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconPlus } from '@tabler/icons-vue'
definePageMeta({ layout: 'dashboard' })
</script>
