<template>
  <div class="space-y-6 max-w-6xl">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Trading Journal</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Share market analysis and trade breakdowns with your subscribers.</p>
      </div>
      <button class="btn btn-primary btn-sm gap-2">
        <IconEdit class="w-4 h-4"/> Draft New Entry
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="join w-full sm:max-w-md">
        <div class="join-item flex items-center px-3 bg-base-100 border border-base-300 border-r-0">
          <IconSearch class="w-4 h-4 text-base-content/50"/>
        </div>
        <input type="text" placeholder="Search entries..." class="input input-bordered join-item w-full pl-0 focus:outline-none" />
      </div>
      <select class="select select-bordered w-full sm:w-auto">
        <option selected>All Tags</option>
        <option>Macro</option>
        <option>Setup</option>
        <option>Review</option>
        <option>Educational</option>
      </select>
    </div>

    <!-- Journal List -->
    <div class="grid grid-cols-1 gap-4">
      <!-- Entry 1 -->
      <div class="card bg-base-100 border border-base-300 shadow-sm hover:shadow transition-shadow">
        <div class="card-body p-5">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="grow">
              <div class="flex items-center gap-2 mb-2">
                <span class="badge badge-primary badge-sm">Macro</span>
                <span class="text-xs text-base-content/50">2 hours ago · 840 views</span>
                <span class="badge badge-success badge-sm badge-outline ml-auto md:ml-2">Published</span>
              </div>
              <h2 class="text-xl font-bold mb-2">FOMC Impact on Crypto Markets & Key Support Levels</h2>
              <p class="text-sm text-base-content/70 line-clamp-2 mb-4">
                Today's FOMC meeting came in exactly as expected with a 25bps hike, but the press conference leaned surprisingly dovish. Looking at the DXY, we're seeing a clear rejection at the 104 level which provides a strong tailwind for risk-on assets. Let's break down what this means for BTC and ETH over the next 48 hours...
              </p>
              <div class="flex gap-2 text-xs text-base-content/50">
                <span class="flex items-center gap-1"><IconMessage class="w-3 h-3"/> 24 Comments</span>
                <span class="flex items-center gap-1"><IconThumbUp class="w-3 h-3"/> 156 Likes</span>
              </div>
            </div>
            
            <!-- Linked Signal Snippet -->
            <div class="shrink-0 w-full md:w-64 bg-base-200/50 rounded-lg p-3 border border-base-300">
              <p class="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">Linked Signal</p>
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono font-bold text-sm">BTC/USDT</span>
                <span class="badge badge-success badge-xs">LONG</span>
              </div>
              <div class="flex justify-between text-xs">
                <span>Entry: <span class="font-mono">64,200</span></span>
                <span class="text-success">TP: <span class="font-mono">66,500</span></span>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2 mt-4 pt-4 border-t border-base-200">
            <button class="btn btn-sm btn-ghost">Edit</button>
            <button class="btn btn-sm btn-ghost">Unpublish</button>
            <button class="btn btn-sm btn-ghost text-error ml-auto">Delete</button>
          </div>
        </div>
      </div>

      <!-- Entry 2 (Draft) -->
      <div class="card bg-base-100 border border-base-300 border-dashed shadow-sm">
        <div class="card-body p-5 opacity-80">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="grow">
              <div class="flex items-center gap-2 mb-2">
                <span class="badge badge-neutral badge-sm">Setup</span>
                <span class="text-xs text-base-content/50">Last edited yesterday</span>
                <span class="badge badge-ghost badge-sm ml-auto md:ml-2">Draft</span>
              </div>
              <h2 class="text-xl font-bold mb-2">Solana Ecosystem Breakout Watch</h2>
              <p class="text-sm text-base-content/70 line-clamp-2 mb-4">
                Draft content... The DEX volume on Solana has been steadily climbing over the past week, diverging from price action. This usually precedes a strong move. I'm watching the 150 level closely for a daily close...
              </p>
            </div>
          </div>
          
          <div class="flex gap-2 mt-4 pt-4 border-t border-base-200">
            <button class="btn btn-sm btn-primary">Continue Editing</button>
            <button class="btn btn-sm btn-ghost text-error ml-auto">Delete</button>
          </div>
        </div>
      </div>

      <!-- Entry 3 -->
      <div class="card bg-base-100 border border-base-300 shadow-sm hover:shadow transition-shadow">
        <div class="card-body p-5">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="grow">
              <div class="flex items-center gap-2 mb-2">
                <span class="badge badge-accent badge-sm">Review</span>
                <span class="text-xs text-base-content/50">3 days ago · 1,240 views</span>
                <span class="badge badge-success badge-sm badge-outline ml-auto md:ml-2">Published</span>
              </div>
              <h2 class="text-xl font-bold mb-2">Trade Breakdown: AAPL Earnings Setup Thesis</h2>
              <p class="text-sm text-base-content/70 line-clamp-2 mb-4">
                A review of our successful AAPL long. The options chain showed heavy put writing at 170, essentially creating a floor. Combined with the anticipated hardware refresh cycle announcement, the R:R was skewed heavily to the upside. Here's exactly how we managed the position through the initial volatility spike...
              </p>
              <div class="flex gap-2 text-xs text-base-content/50">
                <span class="flex items-center gap-1"><IconMessage class="w-3 h-3"/> 42 Comments</span>
                <span class="flex items-center gap-1"><IconThumbUp class="w-3 h-3"/> 310 Likes</span>
              </div>
            </div>

            <!-- Linked Signal Snippet -->
            <div class="shrink-0 w-full md:w-64 bg-base-200/50 rounded-lg p-3 border border-base-300">
              <p class="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">Linked Signal</p>
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono font-bold text-sm">AAPL</span>
                <span class="badge badge-success badge-xs">LONG</span>
              </div>
              <div class="flex justify-between text-xs mb-1">
                <span>Entry: <span class="font-mono">175.50</span></span>
                <span class="text-success">TP: <span class="font-mono">178.00</span></span>
              </div>
              <div class="text-xs text-success font-medium">Closed in Profit ✓</div>
            </div>
          </div>
          
          <div class="flex gap-2 mt-4 pt-4 border-t border-base-200">
            <button class="btn btn-sm btn-ghost">Edit</button>
            <button class="btn btn-sm btn-ghost">Unpublish</button>
            <button class="btn btn-sm btn-ghost text-error ml-auto">Delete</button>
          </div>
        </div>
      </div>

    </div>
    
    <div class="flex justify-center mt-8">
      <div class="join">
        <button class="join-item btn btn-sm">«</button>
        <button class="join-item btn btn-sm btn-active">1</button>
        <button class="join-item btn btn-sm">2</button>
        <button class="join-item btn btn-sm">3</button>
        <button class="join-item btn btn-sm">»</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconEdit, IconSearch, IconMessage, IconThumbUp } from '@tabler/icons-vue'
definePageMeta({ layout: 'dashboard' })
</script>
