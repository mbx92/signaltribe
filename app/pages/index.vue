<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-base-100 pt-16 pb-24">
      <!-- subtle grid bg -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px);background-size:48px 48px"></div>

      <div class="relative max-w-7xl mx-auto px-4 text-center">
        <div class="inline-flex items-center gap-2 badge badge-outline badge-lg mb-8 text-primary border-primary/40 px-4 py-3">
          <IconSparkles class="w-4 h-4"/>
          <span class="text-sm font-medium">100% Platform-Verified Signal Statistics</span>
        </div>
        <h1 class="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 max-w-4xl mx-auto">
          Trade with the<br/>
          <span class="text-primary">Best Analysts</span> in the Market
        </h1>
        <p class="text-xl text-base-content/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Subscribe to vetted market analysts, receive real-time trading signals, and study their thinking through detailed journals. Elevate your trading game.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <NuxtLink to="/#analysts" class="btn btn-primary btn-lg px-8 font-semibold">Explore Analysts</NuxtLink>
          <NuxtLink to="/#how-it-works" class="btn btn-outline btn-lg px-8">How It Works</NuxtLink>
        </div>

        <!-- Social Proof Numbers -->
        <div class="grid grid-cols-3 max-w-lg mx-auto divide-x divide-base-300">
          <div class="px-6">
            <p class="text-3xl font-extrabold text-primary">12K+</p>
            <p class="text-sm text-base-content/50 mt-1">Active Traders</p>
          </div>
          <div class="px-6">
            <p class="text-3xl font-extrabold text-primary">42</p>
            <p class="text-sm text-base-content/50 mt-1">Pro Analysts</p>
          </div>
          <div class="px-6">
            <p class="text-3xl font-extrabold text-primary">68%</p>
            <p class="text-sm text-base-content/50 mt-1">Avg Win Rate</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-24 bg-base-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <p class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Simple Process</p>
          <h2 class="text-4xl font-bold mb-4">Start trading smarter in 3 steps</h2>
          <p class="text-base-content/60 max-w-xl mx-auto">No complicated setup. Subscribe, receive signals, and trade.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body gap-4">
              <div class="w-12 h-12 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-lg">1</div>
              <h3 class="text-xl font-bold">Browse & Compare</h3>
              <p class="text-base-content/60 text-sm leading-relaxed">Explore analyst profiles with platform-verified win rates, total signals, average R:R, and subscriber reviews.</p>
            </div>
          </div>
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body gap-4">
              <div class="w-12 h-12 rounded-xl bg-secondary text-secondary-content flex items-center justify-center font-bold text-lg">2</div>
              <h3 class="text-xl font-bold">Subscribe Monthly</h3>
              <p class="text-base-content/60 text-sm leading-relaxed">Pick the analyst that fits your trading style and subscribe with a simple monthly plan. Cancel anytime.</p>
            </div>
          </div>
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body gap-4">
              <div class="w-12 h-12 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-lg">3</div>
              <h3 class="text-xl font-bold">Get Signals & Journals</h3>
              <p class="text-base-content/60 text-sm leading-relaxed">Receive instant alerts for new setups. Read in-depth journal entries to understand the thesis behind every trade.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Analysts Section -->
    <section id="analysts" class="py-24 max-w-7xl mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Our Analysts</p>
          <h2 class="text-4xl font-bold">Top Performing Analysts</h2>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button class="btn btn-sm btn-primary">All</button>
          <button class="btn btn-sm btn-outline">Crypto</button>
          <button class="btn btn-sm btn-outline">Forex</button>
          <button class="btn btn-sm btn-outline">Stocks</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card: Alex Crypto -->
        <div class="card bg-base-100 border border-base-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <div class="card-body p-6 gap-0">
            <div class="flex items-start justify-between mb-5">
              <div class="flex items-center gap-3">
                <div class="avatar online">
                  <div class="w-14 h-14 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Alex"/></div>
                </div>
                <div>
                  <div class="flex items-center gap-1">
                    <span class="font-bold text-base">Alex Crypto</span>
                    <IconDiscountCheckFilled class="w-4 h-4 text-info"/>
                  </div>
                  <p class="text-xs text-base-content/50">Crypto · Day Trader · 5 yrs</p>
                </div>
              </div>
              <div class="badge badge-success text-xs font-semibold">72% Win</div>
            </div>
            <div class="flex gap-2 mb-4 flex-wrap">
              <span class="badge badge-sm badge-ghost">BTC/USDT</span>
              <span class="badge badge-sm badge-ghost">ETH/USDT</span>
              <span class="badge badge-sm badge-ghost">Scalping</span>
            </div>
            <p class="text-sm text-base-content/60 leading-relaxed mb-5">High-frequency scalping with clear entry, TP and SL. 3-5 quality setups daily with strict risk rules — never more than 1% per trade.</p>
            <div class="grid grid-cols-3 gap-2 mb-5">
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Signals/mo</p>
                <p class="font-bold text-sm">85</p>
              </div>
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Avg R:R</p>
                <p class="font-bold text-sm">1:2.4</p>
              </div>
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Subs</p>
                <p class="font-bold text-sm">1.2K</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
              <div>
                <span class="text-2xl font-extrabold">$49</span>
                <span class="text-sm text-base-content/40">/month</span>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-outline">View Profile</button>
                <button class="btn btn-sm btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card: Sarah FX -->
        <div class="card bg-base-100 border border-base-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <div class="card-body p-6 gap-0">
            <div class="flex items-start justify-between mb-5">
              <div class="flex items-center gap-3">
                <div class="avatar online">
                  <div class="w-14 h-14 rounded-full"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Sarah"/></div>
                </div>
                <div>
                  <div class="flex items-center gap-1">
                    <span class="font-bold text-base">Sarah FX</span>
                    <IconDiscountCheckFilled class="w-4 h-4 text-info"/>
                  </div>
                  <p class="text-xs text-base-content/50">Forex · Swing Trader · 8 yrs</p>
                </div>
              </div>
              <div class="badge badge-success text-xs font-semibold">65% Win</div>
            </div>
            <div class="flex gap-2 mb-4 flex-wrap">
              <span class="badge badge-sm badge-ghost">EUR/USD</span>
              <span class="badge badge-sm badge-ghost">GBP/USD</span>
              <span class="badge badge-sm badge-ghost">Swing</span>
            </div>
            <p class="text-sm text-base-content/60 leading-relaxed mb-5">Pure price action on major pairs. I look for institutional-level zones and multi-day swing opportunities with well-defined risk.</p>
            <div class="grid grid-cols-3 gap-2 mb-5">
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Signals/mo</p>
                <p class="font-bold text-sm">22</p>
              </div>
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Avg R:R</p>
                <p class="font-bold text-sm">1:3.1</p>
              </div>
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Subs</p>
                <p class="font-bold text-sm">850</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
              <div>
                <span class="text-2xl font-extrabold">$35</span>
                <span class="text-sm text-base-content/40">/month</span>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-outline">View Profile</button>
                <button class="btn btn-sm btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card: Marcus Trader -->
        <div class="card bg-base-100 border border-base-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <div class="card-body p-6 gap-0">
            <div class="flex items-start justify-between mb-5">
              <div class="flex items-center gap-3">
                <div class="avatar">
                  <div class="w-14 h-14 rounded-full"><img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" alt="Marcus"/></div>
                </div>
                <div>
                  <div class="flex items-center gap-1">
                    <span class="font-bold text-base">Marcus Macro</span>
                    <IconDiscountCheckFilled class="w-4 h-4 text-info"/>
                  </div>
                  <p class="text-xs text-base-content/50">Equities · Position · 12 yrs</p>
                </div>
              </div>
              <div class="badge badge-warning text-xs font-semibold">58% Win</div>
            </div>
            <div class="flex gap-2 mb-4 flex-wrap">
              <span class="badge badge-sm badge-ghost">US Equities</span>
              <span class="badge badge-sm badge-ghost">Options</span>
              <span class="badge badge-sm badge-ghost">Macro</span>
            </div>
            <p class="text-sm text-base-content/60 leading-relaxed mb-5">1-2 deep research trades per week. Full macro thesis, earnings plays, and options flow analysis for every position trade.</p>
            <div class="grid grid-cols-3 gap-2 mb-5">
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Signals/mo</p>
                <p class="font-bold text-sm">8</p>
              </div>
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Avg R:R</p>
                <p class="font-bold text-sm">1:4.2</p>
              </div>
              <div class="bg-base-200 rounded p-2 text-center">
                <p class="text-xs text-base-content/50">Subs</p>
                <p class="font-bold text-sm">2.1K</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
              <div>
                <span class="text-2xl font-extrabold">$79</span>
                <span class="text-sm text-base-content/40">/month</span>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-outline">View Profile</button>
                <button class="btn btn-sm btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-10">
        <button class="btn btn-outline btn-wide">View All 42 Analysts →</button>
      </div>
    </section>

    <!-- Features -->
    <section class="py-24 bg-base-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <p class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why SignalTribe</p>
          <h2 class="text-4xl font-bold mb-4">Built for serious traders</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card bg-base-100 border border-base-300 p-6">
            <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
              <IconBellRinging class="w-6 h-6"/>
            </div>
            <h3 class="font-bold text-lg mb-2">Real-Time Alerts</h3>
            <p class="text-sm text-base-content/60 leading-relaxed">Receive signals instantly via our platform, Telegram, and email. Never miss a trade setup.</p>
          </div>
          <div class="card bg-base-100 border border-base-300 p-6">
            <div class="w-12 h-12 bg-secondary/20 text-secondary rounded-xl flex items-center justify-center mb-5">
              <IconBook class="w-6 h-6"/>
            </div>
            <h3 class="font-bold text-lg mb-2">Trading Journals</h3>
            <p class="text-sm text-base-content/60 leading-relaxed">Learn the why behind every trade. Analysts share detailed market analysis and journal entries.</p>
          </div>
          <div class="card bg-base-100 border border-base-300 p-6">
            <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
              <IconShieldCheck class="w-6 h-6"/>
            </div>
            <h3 class="font-bold text-lg mb-2">Verified Performance</h3>
            <p class="text-sm text-base-content/60 leading-relaxed">Every signal is tracked automatically. Win rates and stats are calculated by our system — not self-reported.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-24 max-w-7xl mx-auto px-4">
      <div class="text-center mb-16">
        <p class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
        <h2 class="text-4xl font-bold">What traders say about us</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-base-100 border border-base-300 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="avatar"><div class="w-10 rounded-full"><img src="https://i.pravatar.cc/150?u=user1" /></div></div>
            <div>
              <p class="font-semibold text-sm">Budi S.</p>
              <div class="flex text-warning text-xs">★★★★★</div>
            </div>
          </div>
          <p class="text-sm text-base-content/60 leading-relaxed">"Alex's crypto signals have been incredible. Consistent setups with clear entries. My win rate jumped from 40% to 65% in two months."</p>
        </div>
        <div class="card bg-base-100 border border-base-300 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="avatar"><div class="w-10 rounded-full"><img src="https://i.pravatar.cc/150?u=user2" /></div></div>
            <div>
              <p class="font-semibold text-sm">Rani P.</p>
              <div class="flex text-warning text-xs">★★★★★</div>
            </div>
          </div>
          <p class="text-sm text-base-content/60 leading-relaxed">"What I love most is Sarah's journal. I finally understand WHY signals are taken, not just copying blind trades."</p>
        </div>
        <div class="card bg-base-100 border border-base-300 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="avatar"><div class="w-10 rounded-full"><img src="https://i.pravatar.cc/150?u=user3" /></div></div>
            <div>
              <p class="font-semibold text-sm">Kevin M.</p>
              <div class="flex text-warning text-xs">★★★★☆</div>
            </div>
          </div>
          <p class="text-sm text-base-content/60 leading-relaxed">"Verified stats are a game changer. I can actually compare analysts objectively instead of trusting screenshots."</p>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section id="pricing" class="bg-primary text-primary-content py-20">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-extrabold mb-4">Ready to trade with an edge?</h2>
        <p class="opacity-70 text-lg mb-10">Join 12,000+ traders already using SignalTribe to follow the best analysts in the market.</p>
        <NuxtLink to="/login" class="btn btn-secondary btn-lg px-10 font-bold">Get Started — It's Free</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  IconSparkles,
  IconDiscountCheckFilled,
  IconBellRinging,
  IconBook,
  IconShieldCheck
} from '@tabler/icons-vue'

definePageMeta({ layout: 'default' })
</script>
