<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Publish New Signal</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Send a real-time trading alert to your 1,240 subscribers.</p>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300 shadow-sm">
      <div class="card-body p-6">
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
            <h3 class="font-bold text-lg mb-4">Price Levels</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="label"><span class="label-text font-medium">Entry Price</span></label>
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
            <div class="mt-4">
              <button type="button" class="btn btn-ghost btn-sm text-base-content/60 gap-2">
                <IconPlus class="w-4 h-4"/> Add multiple targets (TP2, TP3)
              </button>
            </div>
          </div>

          <div class="divider my-2"></div>

          <!-- Rationale -->
          <div>
            <label class="label"><span class="label-text font-medium">Trade Rationale & Notes</span></label>
            <textarea class="textarea textarea-bordered w-full h-32 text-sm" placeholder="Explain your thesis, key levels, and invalidation points..."></textarea>
            <label class="label"><span class="label-text-alt text-base-content/50">Markdown is supported. You can attach charts in the journal entry later.</span></label>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-4 border-t border-base-200">
            <label class="cursor-pointer label gap-3 justify-start">
              <input type="checkbox" checked="checked" class="checkbox checkbox-sm checkbox-primary" />
              <span class="label-text">Also create a draft Journal Entry for this signal</span>
            </label>
            
            <div class="flex gap-3">
              <button type="button" class="btn btn-ghost">Cancel</button>
              <button type="button" class="btn btn-primary gap-2">
                <IconSend class="w-4 h-4"/> Publish Signal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconPlus, IconSend } from '@tabler/icons-vue'
definePageMeta({ layout: 'dashboard' })
</script>
