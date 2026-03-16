<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">Analyst Dashboard</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Manage your signals, journal, and subscriber base.</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="/dashboard/analyst/journal" class="btn btn-outline btn-sm gap-2">
          <IconBook class="w-4 h-4"/> New Journal Entry
        </NuxtLink>
        <NuxtLink to="/dashboard/analyst/publish" class="btn btn-primary btn-sm gap-2">
          <IconSend class="w-4 h-4"/> Publish Signal
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Subscribers</p>
        <p class="text-2xl font-extrabold text-primary">1,240</p>
        <p class="text-xs text-success/80 mt-1">↑ +400 this month</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Win Rate (30d)</p>
        <p class="text-2xl font-extrabold text-success">72.4%</p>
        <p class="text-xs text-base-content/40 mt-1">42W / 16L</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Est. Revenue</p>
        <p class="text-2xl font-extrabold text-secondary">$42.8K</p>
        <p class="text-xs text-base-content/40 mt-1">This billing cycle</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/50 mb-1">Active Signals</p>
        <p class="text-2xl font-extrabold">3</p>
        <p class="text-xs text-base-content/40 mt-1">Pending targets</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Publish Signal Form -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5">
          <h2 class="font-bold text-base mb-4">Quick Publish Signal</h2>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="label py-0.5"><span class="label-text text-xs">Asset Pair</span></label>
                <input type="text" placeholder="BTC/USDT" class="input input-bordered input-sm w-full font-mono"/>
              </div>
              <div>
                <label class="label py-0.5"><span class="label-text text-xs">Direction</span></label>
                <select class="select select-bordered select-sm w-full">
                  <option>LONG</option>
                  <option>SHORT</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="label py-0.5"><span class="label-text text-xs">Entry</span></label>
                <input type="text" placeholder="64,200" class="input input-bordered input-sm w-full font-mono"/>
              </div>
              <div>
                <label class="label py-0.5"><span class="label-text text-xs text-success">Take Profit</span></label>
                <input type="text" placeholder="66,500" class="input input-bordered input-sm w-full font-mono"/>
              </div>
              <div>
                <label class="label py-0.5"><span class="label-text text-xs text-error">Stop Loss</span></label>
                <input type="text" placeholder="63,000" class="input input-bordered input-sm w-full font-mono"/>
              </div>
            </div>
            <div>
              <label class="label py-0.5"><span class="label-text text-xs">Notes / Rationale</span></label>
              <textarea class="textarea textarea-bordered w-full text-sm h-20 resize-none" placeholder="Briefly explain the setup..."></textarea>
            </div>
            <div class="flex gap-2">
              <select class="select select-bordered select-sm grow">
                <option>Timeframe: 4H</option>
                <option>Timeframe: 1D</option>
                <option>Timeframe: 15M</option>
              </select>
              <select class="select select-bordered select-sm grow">
                <option>Risk: Medium</option>
                <option>Risk: Low</option>
                <option>Risk: High</option>
              </select>
            </div>
            <button class="btn btn-primary btn-sm w-full gap-2">
              <IconSend class="w-4 h-4"/> Publish to 1,240 Subscribers
            </button>
          </div>
        </div>
      </div>

      <!-- Active Signals + Journal combined -->
      <div class="lg:col-span-2 space-y-5">
        <!-- Active Signals -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <div class="flex items-center justify-between mb-3">
              <h2 class="font-bold text-base">Active Signals</h2>
              <NuxtLink to="/dashboard/analyst/signals" class="btn btn-ghost btn-xs">History →</NuxtLink>
            </div>
            <div class="overflow-x-auto">
              <table class="table table-sm w-full">
                <thead>
                  <tr class="text-xs">
                    <th>Pair</th>
                    <th>Dir.</th>
                    <th>Entry</th>
                    <th>TP1</th>
                    <th>SL</th>
                    <th>Current</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr class="hover">
                    <td class="font-mono font-bold">BTC/USDT</td>
                    <td><span class="badge badge-success badge-xs">LONG</span></td>
                    <td class="font-mono">64,200</td>
                    <td class="font-mono text-success">66,500</td>
                    <td class="font-mono text-error">63,000</td>
                    <td class="font-mono text-success font-bold">65,100 ↑</td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-xs btn-ghost">Update</button>
                        <button class="btn btn-xs btn-ghost text-error">Close</button>
                      </div>
                    </td>
                  </tr>
                  <tr class="hover">
                    <td class="font-mono font-bold">ETH/USDT</td>
                    <td><span class="badge badge-error badge-xs">SHORT</span></td>
                    <td class="font-mono">3,450</td>
                    <td class="font-mono text-success">3,300</td>
                    <td class="font-mono text-error">3,520</td>
                    <td class="font-mono text-error font-bold">3,510 ↑</td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-xs btn-ghost">Update</button>
                        <button class="btn btn-xs btn-ghost text-error">Close</button>
                      </div>
                    </td>
                  </tr>
                  <tr class="hover">
                    <td class="font-mono font-bold">SOL/USDT</td>
                    <td><span class="badge badge-success badge-xs">LONG</span></td>
                    <td class="font-mono">155.00</td>
                    <td class="font-mono text-success">168.00</td>
                    <td class="font-mono text-error">149.00</td>
                    <td class="font-mono text-success font-bold">159.20 ↑</td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-xs btn-ghost">Update</button>
                        <button class="btn btn-xs btn-ghost text-error">Close</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Journal Entries -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <div class="flex items-center justify-between mb-3">
              <h2 class="font-bold text-base">Recent Journal Entries</h2>
              <NuxtLink to="/dashboard/analyst/journal" class="btn btn-ghost btn-xs">View All →</NuxtLink>
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-3 p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors cursor-pointer">
                <div class="w-1 self-stretch bg-primary rounded-full shrink-0"></div>
                <div class="grow min-w-0">
                  <p class="font-semibold text-sm">Macro Review: FOMC Impact on Crypto Markets</p>
                  <p class="text-xs text-base-content/50 mt-0.5">2 hours ago · 840 views</p>
                </div>
                <div class="flex gap-1 shrink-0">
                  <button class="btn btn-ghost btn-xs">Edit</button>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors cursor-pointer">
                <div class="w-1 self-stretch bg-base-300 rounded-full shrink-0"></div>
                <div class="grow min-w-0">
                  <p class="font-semibold text-sm">Trade Breakdown: AAPL Earnings Setup Thesis</p>
                  <p class="text-xs text-base-content/50 mt-0.5">Yesterday · 1,240 views</p>
                </div>
                <div class="flex gap-1 shrink-0">
                  <button class="btn btn-ghost btn-xs">Edit</button>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors cursor-pointer">
                <div class="w-1 self-stretch bg-base-300 rounded-full shrink-0"></div>
                <div class="grow min-w-0">
                  <p class="font-semibold text-sm">Weekly Outlook: Key Levels to Watch — BTC, ETH, SOL</p>
                  <p class="text-xs text-base-content/50 mt-0.5">3 days ago · 2,100 views</p>
                </div>
                <div class="flex gap-1 shrink-0">
                  <button class="btn btn-ghost btn-xs">Edit</button>
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
import { IconBook, IconSend } from '@tabler/icons-vue'
definePageMeta({ layout: 'dashboard' })
</script>
