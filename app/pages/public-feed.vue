<template>
  <div class="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- LEFT SIDEBAR -->
      <div class="lg:col-span-3 space-y-6 order-2 lg:order-1">
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-4">
          <h3 class="font-bold text-sm mb-3">My Subscriptions</h3>
          <ul class="space-y-3">
            <li>
              <a href="#" class="flex items-center gap-3 hover:bg-base-200 p-2 rounded-lg transition-colors">
                <div class="avatar"><div class="w-8 h-8 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" /></div></div>
                <div class="flex-1"><p class="text-sm font-semibold">Alex Crypto</p></div>
                <IconChevronRight class="w-4 h-4 text-base-content/30"/>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center gap-3 hover:bg-base-200 p-2 rounded-lg transition-colors">
                <div class="avatar"><div class="w-8 h-8 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" /></div></div>
                <div class="flex-1"><p class="text-sm font-semibold">Sarah FX</p></div>
                <IconChevronRight class="w-4 h-4 text-base-content/30"/>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center gap-3 hover:bg-base-200 p-2 rounded-lg transition-colors">
                <div class="avatar"><div class="w-8 h-8 rounded-full"><img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" /></div></div>
                <div class="flex-1"><p class="text-sm font-semibold">Marcus Macro</p></div>
                <IconChevronRight class="w-4 h-4 text-base-content/30"/>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-4">
          <h3 class="font-bold text-sm mb-3">Quick Filters</h3>
          <div class="flex flex-wrap gap-2">
            <span class="badge badge-primary badge-outline badge-sm cursor-pointer hover:bg-primary hover:text-primary-content">Crypto</span>
            <span class="badge badge-primary badge-outline badge-sm cursor-pointer hover:bg-primary hover:text-primary-content">Forex</span>
            <span class="badge badge-primary badge-outline badge-sm cursor-pointer hover:bg-primary hover:text-primary-content">Stocks</span>
            <span class="badge badge-primary badge-outline badge-sm cursor-pointer hover:bg-primary hover:text-primary-content">High Risk</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN FEED COLUMN -->
    <div class="lg:col-span-6 space-y-6 order-1 lg:order-2">
    <!-- Header & Filters -->
    <div class="flex flex-col gap-4">
      <div>
        <h1 class="text-2xl font-bold">Signal Feed</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Real-time trading signals from your subscribed analysts.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <label class="input input-sm input-bordered flex items-center gap-2 grow min-w-[200px]">
          <IconSearch class="w-4 h-4 text-base-content/50" />
          <input type="text" class="grow" placeholder="Search asset..." />
        </label>
        <select class="select select-bordered select-sm">
          <option>All Analysts</option>
          <option>Alex Crypto</option>
          <option>Sarah FX</option>
          <option>Marcus Macro</option>
        </select>
        <select class="select select-bordered select-sm">
          <option>Status: All</option>
          <option>Active</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
      </div>
    </div>

    <!-- Signal Cards Feed (Facebook Style) -->
    <div class="flex flex-col gap-6">
      
      <!-- Card 1: Active LONG -->
      <div class="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
        <div class="card-body p-0">
          <!-- Analyst Header -->
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 h-10 rounded-full cursor-pointer hover:ring ring-primary/30 transition-all">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                </div>
              </div>
              <div class="leading-tight">
                <p class="font-bold text-sm hover:underline cursor-pointer">Alex Crypto</p>
                <div class="flex items-center gap-1 text-xs text-base-content/60 mt-0.5">
                  10 min ago <span class="mx-1">•</span> <IconUsers class="w-3 h-3"/> Subscribers only
                </div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm btn-circle"><IconDots class="w-5 h-5"/></button>
          </div>

          <!-- Notes / Post Content -->
          <div class="px-5 pb-3">
            <p class="text-sm text-base-content/90 leading-relaxed">
              Rejection at key daily support block. Anticipating a bounce back to the local range high before FOMC tomorrow. Risk-to-reward is excellent here. Look for 5m confirmation. 📈🔥
            </p>
          </div>

          <!-- Signal Info Box -->
          <div class="mx-5 mb-5 rounded-xl border border-base-200 overflow-hidden bg-base-200/20">
            <!-- Header -->
            <div class="p-4 border-b border-base-200 bg-base-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-lg">
                  ₿
                </div>
                <div>
                  <h2 class="text-xl font-bold tracking-tight font-mono">BTC/USDT</h2>
                  <p class="text-xs text-base-content/50 font-medium tracking-wider uppercase">Crypto • 4H</p>
                </div>
              </div>
              <div class="text-right flex flex-col items-end gap-1">
                <span class="inline-block px-3 py-1 bg-success/10 text-success rounded font-bold tracking-widest text-xs">
                  LONG
                </span>
                <span class="badge gap-1 border-warning/30 bg-warning/10 text-warning text-[10px] font-medium px-1.5 py-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span> Active
                </span>
              </div>
            </div>

            <!-- Price Targets -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 p-4 relative">
              <div class="absolute top-0 left-0 w-1 h-full bg-success"></div>
              <div class="pl-2">
                <p class="text-[10px] text-base-content/50 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTarget class="w-3 h-3"/> Entry</p>
                <p class="font-mono font-bold text-lg">64,200</p>
              </div>
              <div class="sm:border-l border-base-300 sm:pl-4">
                <p class="text-[10px] text-success font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTrendingUp class="w-3 h-3"/> Take Profit</p>
                <p class="font-mono font-bold text-lg text-success">66,500</p>
              </div>
              <div class="sm:border-l border-base-300 sm:pl-4">
                <p class="text-[10px] text-error font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTrendingDown class="w-3 h-3"/> Stop Loss</p>
                <p class="font-mono font-bold text-lg text-error">63,000</p>
              </div>
            </div>
          </div>

          <!-- Social Actions (Like, Comment, Execute) -->
          <div class="px-5 py-3 border-t border-base-200 flex items-center justify-between">
            <div class="flex items-center gap-1">
              <button class="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content px-2"><IconThumbUp class="w-4 h-4"/> 124</button>
              <button class="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content px-2"><IconMessageCircle class="w-4 h-4"/> 18</button>
            </div>
            <button class="btn btn-primary btn-sm gap-2 font-medium px-4 rounded-full">
              <IconBolt class="w-4 h-4"/> Execute Trade
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: Active SHORT -->
      <div class="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
        <div class="card-body p-0">
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 h-10 rounded-full cursor-pointer hover:ring ring-primary/30 transition-all">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                </div>
              </div>
              <div class="leading-tight">
                <p class="font-bold text-sm hover:underline cursor-pointer">Sarah FX</p>
                <div class="flex items-center gap-1 text-xs text-base-content/60 mt-0.5">
                  2 hrs ago <span class="mx-1">•</span> <IconUsers class="w-3 h-3"/> Subscribers only
                </div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm btn-circle"><IconDots class="w-5 h-5"/></button>
          </div>

          <div class="px-5 pb-3">
            <p class="text-sm text-base-content/90 leading-relaxed">
              Bearish divergence on the hourly RSI combined with a MACD crossover. The dollar index (DXY) is showing unexpected strength following the jobs report. Entering carefully here.
            </p>
          </div>

          <div class="mx-5 mb-5 rounded-xl border border-base-200 overflow-hidden bg-base-200/20">
            <div class="p-4 border-b border-base-200 bg-base-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg">
                  €
                </div>
                <div>
                  <h2 class="text-xl font-bold tracking-tight font-mono">EUR/USD</h2>
                  <p class="text-xs text-base-content/50 font-medium tracking-wider uppercase">Forex • 15m</p>
                </div>
              </div>
              <div class="text-right flex flex-col items-end gap-1">
                <span class="inline-block px-3 py-1 bg-error/10 text-error rounded font-bold tracking-widest text-xs">
                  SHORT
                </span>
                <span class="badge gap-1 border-warning/30 bg-warning/10 text-warning text-[10px] font-medium px-1.5 py-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span> Active
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 p-4 relative">
              <div class="absolute top-0 left-0 w-1 h-full bg-error"></div>
              <div class="pl-2">
                <p class="text-[10px] text-base-content/50 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTarget class="w-3 h-3"/> Entry</p>
                <p class="font-mono font-bold text-lg">1.0840</p>
              </div>
              <div class="sm:border-l border-base-300 sm:pl-4">
                <p class="text-[10px] text-success font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTrendingUp class="w-3 h-3"/> Take Profit</p>
                <p class="font-mono font-bold text-lg text-success">1.0780</p>
              </div>
              <div class="sm:border-l border-base-300 sm:pl-4">
                <p class="text-[10px] text-error font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTrendingDown class="w-3 h-3"/> Stop Loss</p>
                <p class="font-mono font-bold text-lg text-error">1.0890</p>
              </div>
            </div>
          </div>

          <div class="px-5 py-3 border-t border-base-200 flex items-center justify-between">
            <div class="flex items-center gap-1">
              <button class="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content px-2"><IconThumbUp class="w-4 h-4"/> 89</button>
              <button class="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content px-2"><IconMessageCircle class="w-4 h-4"/> 4</button>
            </div>
            <button class="btn btn-primary btn-sm gap-2 font-medium px-4 rounded-full">
              <IconBolt class="w-4 h-4"/> Execute Trade
            </button>
          </div>
        </div>
      </div>

      <!-- Card 3: Closed Won -->
      <div class="card bg-base-100 border border-base-300 shadow-sm opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all">
        <div class="card-body p-0">
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 h-10 rounded-full cursor-pointer">
                  <img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                </div>
              </div>
              <div class="leading-tight">
                <p class="font-bold text-sm">Marcus Macro</p>
                <div class="flex items-center gap-1 text-xs text-base-content/60 mt-0.5">
                  Yesterday <span class="mx-1">•</span> <IconUsers class="w-3 h-3"/> Subscribers only
                </div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm btn-circle"><IconDots class="w-5 h-5"/></button>
          </div>

          <div class="px-5 pb-3">
            <p class="text-sm text-base-content/90 leading-relaxed">
               A classic breakout play on earnings momentum. Volume confirms the move up.
            </p>
          </div>

          <div class="mx-5 mb-5 rounded-xl border border-base-200 overflow-hidden bg-base-200/20">
            <div class="bg-success/5 p-3 border-b border-success/20 flex justify-center">
              <p class="text-xs text-success font-bold flex items-center gap-2 tracking-wide uppercase">
                <IconTrophy class="w-4 h-4"/> Trade Closed • Target 1 Hit
              </p>
            </div>
            <div class="p-4 border-b border-base-200 bg-base-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-base-200 text-base-content/70 flex items-center justify-center font-bold text-lg">
                  $
                </div>
                <div>
                  <h2 class="text-xl font-bold tracking-tight font-mono text-base-content/80">AAPL</h2>
                  <p class="text-xs text-base-content/50 font-medium tracking-wider uppercase">Stocks • 1D</p>
                </div>
              </div>
              <div class="text-right flex flex-col items-end gap-1">
                <span class="inline-block px-3 py-1 bg-success/10 text-success rounded font-bold tracking-widest text-xs opacity-70">
                  LONG
                </span>
                <span class="badge gap-1 border-success/30 bg-success/10 text-success text-[10px] font-bold px-1.5 py-2">
                  <IconCheck class="w-3 h-3 text-success"/> Won
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 p-4 relative opacity-60">
              <div class="absolute top-0 left-0 w-1 h-full bg-success"></div>
              <div class="pl-2">
                <p class="text-[10px] text-base-content/50 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTarget class="w-3 h-3"/> Entry</p>
                <p class="font-mono font-bold text-lg line-through text-base-content/50">175.50</p>
              </div>
              <div class="sm:border-l border-base-300 sm:pl-4">
                <p class="text-[10px] text-success font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTrendingUp class="w-3 h-3"/> Closed At</p>
                <p class="font-mono font-bold text-lg text-success">178.00</p>
              </div>
              <div class="sm:border-l border-base-300 sm:pl-4">
                <p class="text-[10px] text-error font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><IconTrendingDown class="w-3 h-3"/> Stop Loss</p>
                <p class="font-mono font-bold text-lg text-error">173.00</p>
              </div>
            </div>
          </div>

          <div class="px-5 py-3 border-t border-base-200 flex items-center justify-between">
            <div class="flex items-center gap-1">
              <button class="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content px-2"><IconThumbUp class="w-4 h-4 text-primary"/> 312</button>
              <button class="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content px-2"><IconMessageCircle class="w-4 h-4"/> 45</button>
            </div>
            <button class="btn btn-outline btn-sm gap-2 font-medium px-4 rounded-full opacity-50 cursor-not-allowed">
              <IconCheck class="w-4 h-4"/> Completed
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR -->
    <div class="lg:col-span-3 space-y-6 order-3">
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-4 space-y-4">
          <h3 class="font-bold text-sm">Market Pulse</h3>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-base-content/60">BTC Dominance</span>
            <span class="text-sm font-mono font-bold">54.2%</span>
          </div>
          <progress class="progress progress-warning w-full" value="54" max="100"></progress>
          
          <div class="flex items-center justify-between pt-2">
            <span class="text-xs font-semibold text-base-content/60">Fear & Greed</span>
            <span class="badge badge-sm badge-success badge-outline">Greed (72)</span>
          </div>
        </div>
      </div>

      <div class="card bg-primary text-primary-content shadow-sm">
        <div class="card-body p-5">
          <h3 class="font-bold text-lg leading-tight">Upgrade to Pro</h3>
          <p class="text-xs text-primary-content/80 mt-1 mb-3">Get real-time SMS alerts and auto-trading integration.</p>
          <button class="btn btn-sm btn-active btn-primary glass">View Plans</button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  IconSearch, 
  IconUsers,
  IconDots,
  IconMessageCircle,
  IconThumbUp,
  IconBolt,
  IconTarget,
  IconTrendingDown,
  IconTrendingUp,
  IconCheck, 
  IconTrophy,
  IconChevronRight
} from '@tabler/icons-vue'
</script>
