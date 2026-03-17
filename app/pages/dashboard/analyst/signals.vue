<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Signals</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Manage and monitor your active and historical trading alerts.</p>
      </div>
      <button class="btn btn-primary btn-sm gap-2" onclick="publish_modal.showModal()">
        <IconPlus class="w-4 h-4"/> Publish New Signal
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 font-medium mb-1">Active Signals</p>
        <p class="text-2xl font-bold font-mono">3</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 font-medium mb-1">Avg Win Rate</p>
        <p class="text-2xl font-bold text-success">68.5%</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 font-medium mb-1">Total Signals</p>
        <p class="text-2xl font-bold font-mono">142</p>
      </div>
      <div class="card bg-base-100 border border-base-300 p-4">
        <p class="text-xs text-base-content/60 font-medium mb-1">Subscribers Notified</p>
        <p class="text-2xl font-bold font-mono">1,240</p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col sm:flex-row gap-3">
      <label class="input input-bordered w-full sm:max-w-md flex items-center gap-2">
        <IconSearch class="w-4 h-4 text-base-content/50" />
        <input type="text" class="grow" placeholder="Search signals (e.g. BTC/USDT)..." />
      </label>
      <select class="select select-bordered w-full sm:w-auto">
        <option>All Status</option>
        <option>Active</option>
        <option>Won</option>
        <option>Lost</option>
        <option>Canceled</option>
      </select>
    </div>

    <!-- Signals List -->
    <div class="card bg-base-100 border border-base-300">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr class="bg-base-200/50">
              <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Asset</th>
              <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Direction/TF</th>
              <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Entry</th>
              <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Targets/SL</th>
              <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Status</th>
              <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Published</th>
              <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Signal 1 -->
            <tr class="hover">
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-bold text-xs">₿</div>
                  <div>
                    <p class="font-bold text-sm font-mono tracking-wide">BTC/USDT</p>
                    <p class="text-xs text-base-content/50">Crypto</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex flex-col gap-1">
                  <span class="badge badge-success badge-sm">LONG</span>
                  <span class="text-xs text-base-content/60 font-mono">4H</span>
                </div>
              </td>
              <td class="font-mono text-sm">64,200.00</td>
              <td>
                <div class="flex flex-col gap-1 text-xs">
                  <span class="text-success font-mono">TP: 66,500</span>
                  <span class="text-error font-mono">SL: 62,000</span>
                </div>
              </td>
              <td><span class="badge gap-1 border-warning/30 bg-warning/10 text-warning text-xs font-medium"><span class="w-1.5 h-1.5 rounded-full bg-warning"></span> Active</span></td>
              <td class="text-xs text-base-content/60">2h ago</td>
              <td class="text-right">
                <button class="btn btn-sm btn-ghost btn-square"><IconDotsVertical class="w-4 h-4"/></button>
              </td>
            </tr>

            <!-- Signal 2 -->
            <tr class="hover">
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-bold text-xs">$</div>
                  <div>
                    <p class="font-bold text-sm font-mono tracking-wide">AAPL</p>
                    <p class="text-xs text-base-content/50">Stocks</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex flex-col gap-1">
                  <span class="badge badge-success badge-sm">LONG</span>
                  <span class="text-xs text-base-content/60 font-mono">1D</span>
                </div>
              </td>
              <td class="font-mono text-sm">175.50</td>
              <td>
                <div class="flex flex-col gap-1 text-xs">
                  <span class="text-success font-mono">TP: 178.00</span>
                  <span class="text-error font-mono">SL: 172.00</span>
                </div>
              </td>
              <td><span class="badge gap-1 border-success/30 bg-success/10 text-success text-xs font-medium"><IconCheck class="w-3 h-3"/> Won</span></td>
              <td class="text-xs text-base-content/60">3d ago</td>
              <td class="text-right">
                <button class="btn btn-sm btn-ghost btn-square"><IconDotsVertical class="w-4 h-4"/></button>
              </td>
            </tr>
            
            <!-- Signal 3 -->
            <tr class="hover">
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-bold text-xs">Ξ</div>
                  <div>
                    <p class="font-bold text-sm font-mono tracking-wide">ETH/USDT</p>
                    <p class="text-xs text-base-content/50">Crypto</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex flex-col gap-1">
                  <span class="badge badge-error badge-sm">SHORT</span>
                  <span class="text-xs text-base-content/60 font-mono">1H</span>
                </div>
              </td>
              <td class="font-mono text-sm">3,450.00</td>
              <td>
                <div class="flex flex-col gap-1 text-xs">
                  <span class="text-success font-mono">TP: 3,300.00</span>
                  <span class="text-error font-mono">SL: 3,500.00</span>
                </div>
              </td>
              <td><span class="badge gap-1 border-error/30 bg-error/10 text-error text-xs font-medium"><IconX class="w-3 h-3"/> Lost</span></td>
              <td class="text-xs text-base-content/60">5d ago</td>
              <td class="text-right">
                <button class="btn btn-sm btn-ghost btn-square"><IconDotsVertical class="w-4 h-4"/></button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      
      <div class="p-4 border-t border-base-200 flex items-center justify-between">
        <p class="text-xs text-base-content/50">Showing 1 to 3 of 142 signals</p>
        <div class="join">
          <button class="join-item btn btn-xs">Prev</button>
          <button class="join-item btn btn-xs btn-active">1</button>
          <button class="join-item btn btn-xs">2</button>
          <button class="join-item btn btn-xs">Next</button>
        </div>
      </div>
    </div>


    <!-- Publish Signal Modal -->
    <dialog id="publish_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box w-11/12 max-w-4xl p-0 overflow-hidden">
        <div class="p-6 border-b border-base-200 flex items-center justify-between bg-base-200/30">
          <div>
            <h3 class="font-bold text-xl">Publish New Signal</h3>
            <p class="text-xs text-base-content/50 mt-1">Send a real-time trading alert to your subscribers.</p>
          </div>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>

        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <form class="space-y-6">
            
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="label"><span class="label-text font-medium">Asset Pair</span></label>
                  <input type="text" placeholder="e.g. BTC/USDT" class="input input-bordered w-full font-mono uppercase" />
                </div>
                <div>
                  <label class="label"><span class="label-text font-medium">Direction</span></label>
                  <div class="join w-full">
                    <input class="join-item btn flex-1" type="radio" name="direction" aria-label="LONG" checked />
                    <input class="join-item btn flex-1" type="radio" name="direction" aria-label="SHORT" />
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="label"><span class="label-text font-medium">Timeframe</span></label>
                  <select class="select select-bordered w-full">
                    <option disabled selected>Select timeframe</option>
                    <option>15m</option>
                    <option>1H</option>
                    <option>4H</option>
                    <option>1D</option>
                    <option>1W</option>
                  </select>
                </div>
                <div>
                  <label class="label"><span class="label-text font-medium">Risk Profile</span></label>
                  <select class="select select-bordered w-full">
                    <option disabled selected>Select risk level</option>
                    <option>Low (1-2%)</option>
                    <option>Medium (3-5%)</option>
                    <option>High (5%+)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="divider my-2"></div>

            <!-- Price Levels -->
            <div>
              <h3 class="font-bold text-base mb-4">Price Levels</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="label"><span class="label-text font-medium text-base-content/70">Entry Price</span></label>
                  <input type="number" step="any" placeholder="0.00" class="input input-bordered w-full font-mono" />
                </div>
                <div>
                  <label class="label"><span class="label-text font-medium text-success">Take Profit (TP1)</span></label>
                  <input type="number" step="any" placeholder="0.00" class="input input-bordered w-full font-mono border-success/30 focus:border-success" />
                </div>
                <div>
                  <label class="label"><span class="label-text font-medium text-error">Stop Loss (SL)</span></label>
                  <input type="number" step="any" placeholder="0.00" class="input input-bordered w-full font-mono border-error/30 focus:border-error" />
                </div>
              </div>
              
              <!-- Optional TP2/TP3 -->
              <div v-if="extraTargets > 0" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="label p-0"><span class="label-text font-medium text-success">Take Profit (TP2)</span></label>
                    <button type="button" class="btn btn-xs btn-ghost text-error px-1 min-h-0 h-auto" @click="extraTargets--"><IconX class="w-3 h-3"/></button>
                  </div>
                  <input type="number" step="any" placeholder="0.00" class="input input-bordered w-full font-mono border-success/30 focus:border-success" />
                </div>
                <div v-if="extraTargets > 1">
                  <div class="flex items-center justify-between mb-1">
                    <label class="label p-0"><span class="label-text font-medium text-success">Take Profit (TP3)</span></label>
                    <button type="button" class="btn btn-xs btn-ghost text-error px-1 min-h-0 h-auto" @click="extraTargets--"><IconX class="w-3 h-3"/></button>
                  </div>
                  <input type="number" step="any" placeholder="0.00" class="input input-bordered w-full font-mono border-success/30 focus:border-success" />
                </div>
              </div>
              
              <div class="mt-4" v-if="extraTargets < 2">
                <button type="button" class="btn btn-ghost btn-sm text-base-content/60 gap-2" @click="extraTargets++">
                  <IconPlus class="w-4 h-4"/> Add target (TP{{ extraTargets + 2 }})
                </button>
              </div>
            </div>

            <div class="divider my-2"></div>

            <!-- Rationale -->
            <div>
              <label class="label"><span class="label-text font-medium">Trade Rationale & Notes</span></label>
              <textarea class="textarea textarea-bordered w-full h-24 text-sm" placeholder="Explain your thesis, key levels, and invalidation points..."></textarea>
              <label class="label"><span class="label-text-alt text-base-content/50">Markdown is supported. You can attach charts in the journal entry later.</span></label>
            </div>
            
          </form>
        </div>
        
        <!-- Modal Actions -->
        <div class="p-6 bg-base-200/30 border-t border-base-200 flex items-center justify-between">
          <label class="cursor-pointer label gap-3 justify-start">
            <input type="checkbox" checked="checked" class="checkbox checkbox-sm checkbox-primary" />
            <span class="label-text text-xs">Also create a draft Journal</span>
          </label>
          
          <div class="flex gap-3">
            <form method="dialog">
              <button class="btn btn-ghost border border-base-300">Cancel</button>
            </form>
            <button type="button" class="btn btn-primary gap-2" onclick="publish_modal.close()">
              <IconSend class="w-4 h-4"/> Publish Now
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { IconPlus, IconSend, IconSearch, IconDotsVertical, IconCheck, IconX } from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })

const extraTargets = ref(0)
</script>
