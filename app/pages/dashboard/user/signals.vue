<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Signal Feed</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Real-time trading signals from your subscribed analysts.</p>
      </div>
      <div class="flex gap-2">
        <select class="select select-bordered select-sm">
          <option>All Analysts</option>
          <option>Alex Crypto</option>
          <option>Sarah FX</option>
          <option>Marcus Macro</option>
        </select>
        <select class="select select-bordered select-sm">
          <option>Status: All</option>
          <option>Status: Active</option>
          <option>Status: Closed</option>
        </select>
      </div>
    </div>

    <!-- Active Signals Panel -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr class="bg-base-200/50">
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Analyst</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Asset & Dir</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Entry</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Targets</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60">Status</th>
                <th class="font-semibold text-xs uppercase tracking-wider text-base-content/60 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              <!-- Row 1 -->
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar"><div class="w-8 h-8 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" /></div></div>
                    <div>
                      <p class="font-semibold text-sm">Alex Crypto</p>
                      <p class="text-xs text-base-content/50">Scalp · High Risk</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="font-mono font-bold">BTC/USDT</p>
                  <span class="badge badge-success badge-xs font-bold mt-1">LONG</span>
                </td>
                <td class="font-mono text-sm">64,200</td>
                <td>
                  <div class="text-xs space-y-1">
                    <div class="flex gap-2"><span class="text-success w-6">TP1</span> <span class="font-mono">66,500</span></div>
                    <div class="flex gap-2"><span class="text-error w-6">SL</span> <span class="font-mono">63,000</span></div>
                  </div>
                </td>
                <td><span class="badge badge-warning badge-sm">Active</span></td>
                <td class="text-right text-xs text-base-content/50">10 min ago</td>
              </tr>
              <!-- Row 2 -->
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar"><div class="w-8 h-8 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" /></div></div>
                    <div>
                      <p class="font-semibold text-sm">Sarah FX</p>
                      <p class="text-xs text-base-content/50">Swing · Med Risk</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="font-mono font-bold">EUR/USD</p>
                  <span class="badge badge-error badge-xs font-bold mt-1">SHORT</span>
                </td>
                <td class="font-mono text-sm">1.0840</td>
                <td>
                  <div class="text-xs space-y-1">
                    <div class="flex gap-2"><span class="text-success w-6">TP1</span> <span class="font-mono">1.0780</span></div>
                    <div class="flex gap-2"><span class="text-error w-6">SL</span> <span class="font-mono">1.0890</span></div>
                  </div>
                </td>
                <td><span class="badge badge-warning badge-sm">Active</span></td>
                <td class="text-right text-xs text-base-content/50">2 hrs ago</td>
              </tr>
              <!-- Row 3 -->
              <tr class="hover bg-base-200/30">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar"><div class="w-8 h-8 rounded-full opacity-60"><img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" /></div></div>
                    <div>
                      <p class="font-semibold text-sm opacity-60">Marcus Macro</p>
                      <p class="text-xs text-base-content/50">Position · Low Risk</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="font-mono font-bold opacity-60">AAPL</p>
                  <span class="badge badge-success badge-xs font-bold mt-1 opacity-60">LONG</span>
                </td>
                <td class="font-mono text-sm opacity-60">175.50</td>
                <td>
                  <div class="text-xs space-y-1 opacity-60">
                    <div class="flex gap-2"><span class="text-success w-6">TP1</span> <span class="font-mono">178.00</span></div>
                    <div class="flex gap-2"><span class="text-error w-6">SL</span> <span class="font-mono">173.00</span></div>
                  </div>
                </td>
                <td><span class="badge badge-ghost badge-sm text-success">TP1 Hit ✓</span></td>
                <td class="text-right text-xs text-base-content/50">Yesterday</td>
              </tr>
              <!-- Row 4 -->
              <tr class="hover bg-base-200/30">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar"><div class="w-8 h-8 rounded-full opacity-60"><img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" /></div></div>
                    <div>
                      <p class="font-semibold text-sm opacity-60">Alex Crypto</p>
                      <p class="text-xs text-base-content/50">Scalp · High Risk</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="font-mono font-bold opacity-60">ETH/USDT</p>
                  <span class="badge badge-success badge-xs font-bold mt-1 opacity-60">LONG</span>
                </td>
                <td class="font-mono text-sm opacity-60">3,450</td>
                <td>
                  <div class="text-xs space-y-1 opacity-60">
                    <div class="flex gap-2"><span class="text-success w-6">TP1</span> <span class="font-mono">3,550</span></div>
                    <div class="flex gap-2"><span class="text-error w-6">SL</span> <span class="font-mono">3,400</span></div>
                  </div>
                </td>
                <td><span class="badge badge-ghost badge-sm text-error">Stopped Out ✗</span></td>
                <td class="text-right text-xs text-base-content/50">2 days ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })
</script>
