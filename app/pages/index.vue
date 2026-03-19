<template>
  <div>
    <!-- Render loop: render specific section based on block.type -->
    <template v-for="block in blocks" :key="block.id">

      <!-- Hero Block -->
      <section v-if="block.type === 'Hero'" class="relative overflow-hidden bg-base-100 pt-16 pb-24">
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px);background-size:48px 48px"></div>
        <div class="relative max-w-7xl mx-auto px-4 text-center">
          <div v-if="block.data.badge" class="inline-flex items-center gap-2 badge badge-outline badge-lg mb-8 text-primary border-primary/40 px-4 py-3">
            <IconSparkles class="w-4 h-4"/>
            <span class="text-sm font-medium">{{ block.data.badge }}</span>
          </div>
          <h1 class="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 max-w-4xl mx-auto" v-html="block.data.title"></h1>
          <p class="text-xl text-base-content/60 max-w-2xl mx-auto mb-10 leading-relaxed" v-html="block.data.subtitle"></p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <NuxtLink v-if="block.data.ctaPrimaryText" :to="block.data.ctaPrimaryLink || '#'" class="btn btn-primary btn-lg px-8 font-semibold">{{ block.data.ctaPrimaryText }}</NuxtLink>
            <NuxtLink v-if="block.data.ctaSecondaryText" :to="block.data.ctaSecondaryLink || '#'" class="btn btn-outline btn-lg px-8">{{ block.data.ctaSecondaryText }}</NuxtLink>
          </div>
        </div>
      </section>

      <!-- Stats Block -->
      <section v-if="block.type === 'Stats'" class="relative -mt-20 mb-20">
         <!-- Placed overlapping the hero or floating below it depending on order -->
         <div class="relative max-w-7xl mx-auto px-4 text-center">
           <div class="grid grid-cols-3 max-w-lg mx-auto divide-x divide-base-300 bg-base-100 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl shadow-xl shadow-base-300/20 border border-base-200 py-6">
            <div v-for="(stat, idx) in block.data.items" :key="idx" class="px-6">
              <p class="text-3xl font-extrabold text-primary">{{ stat.value }}</p>
              <p class="text-sm text-base-content/50 mt-1">{{ stat.label }}</p>
            </div>
          </div>
         </div>
      </section>

      <!-- How It Works Block -->
      <section v-if="block.type === 'HowItWorks'" id="how-it-works" class="py-24 bg-base-200">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-16">
            <p v-if="block.data.preTitle" class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">{{ block.data.preTitle }}</p>
            <h2 class="text-4xl font-bold mb-4">{{ block.data.title }}</h2>
            <p v-if="block.data.subtitle" class="text-base-content/60 max-w-xl mx-auto" v-html="block.data.subtitle"></p>
          </div>
          <!-- Hardcoded 3 step process content for simplicity -->
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
      <section v-if="block.type === 'Analysts'" id="analysts" class="py-24 max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p v-if="block.data.preTitle" class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">{{ block.data.preTitle }}</p>
            <h2 class="text-4xl font-bold">{{ block.data.title }}</h2>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button class="btn btn-sm btn-primary">All</button>
            <button class="btn btn-sm btn-outline">Crypto</button>
            <button class="btn btn-sm btn-outline">Forex</button>
            <button class="btn btn-sm btn-outline">Stocks</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Card: Dynamic Analyst -->
          <div v-for="(analyst, idx) in block.data.analysts" :key="idx" class="card bg-base-100 border border-base-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div class="card-body p-6 gap-0">
              <div class="flex items-start justify-between mb-5">
                <div class="flex items-center gap-3">
                  <div class="avatar online">
                    <div class="w-14 h-14 rounded-full"><img :src="analyst.avatar || 'https://i.pravatar.cc/150'" :alt="analyst.name"/></div>
                  </div>
                  <div>
                    <div class="flex items-center gap-1">
                      <span class="font-bold text-base">{{ analyst.name }}</span>
                      <IconDiscountCheckFilled class="w-4 h-4 text-info"/>
                    </div>
                    <p class="text-xs text-base-content/50">{{ analyst.subtitle }}</p>
                  </div>
                </div>
                <div class="badge badge-success text-xs font-semibold">{{ analyst.winRate }}</div>
              </div>
              <div class="flex gap-2 mb-4 flex-wrap">
                <span v-for="(tag, tidx) in (analyst.tags || '').split(',').map(t => t.trim()).filter(Boolean)" :key="tidx" class="badge badge-sm badge-ghost">{{ tag }}</span>
              </div>
              <p class="text-sm text-base-content/60 leading-relaxed mb-5">{{ analyst.description }}</p>
              <div class="grid grid-cols-3 gap-2 mb-5">
                <div class="bg-base-200 rounded p-2 text-center">
                  <p class="text-xs text-base-content/50">{{ analyst.stat1Label }}</p>
                  <p class="font-bold text-sm">{{ analyst.stat1Value }}</p>
                </div>
                <div class="bg-base-200 rounded p-2 text-center">
                  <p class="text-xs text-base-content/50">{{ analyst.stat2Label }}</p>
                  <p class="font-bold text-sm">{{ analyst.stat2Value }}</p>
                </div>
                <div class="bg-base-200 rounded p-2 text-center">
                  <p class="text-xs text-base-content/50">{{ analyst.stat3Label }}</p>
                  <p class="font-bold text-sm">{{ analyst.stat3Value }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
                <div>
                   <span class="text-2xl font-extrabold">{{ analyst.price }}</span>
                   <span class="text-sm text-base-content/40">{{ analyst.priceSuffix }}</span>
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
          <button class="btn btn-outline btn-wide">View All Analysts →</button>
        </div>
      </section>

      <!-- Features Block -->
      <section v-if="block.type === 'Features'" class="py-24 bg-base-200 w-full">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-16">
            <p v-if="block.data.preTitle" class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">{{ block.data.preTitle }}</p>
            <h2 class="text-4xl font-bold mb-4">{{ block.data.title }}</h2>
            <p v-if="block.data.subtitle" class="text-base-content/60 max-w-xl mx-auto" v-html="block.data.subtitle"></p>
          </div>
          <!-- Hardcoded features for brevity -->
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

      <!-- Testimonials Block -->
      <section v-if="block.type === 'Testimonials'" class="py-24 max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <p v-if="block.data.preTitle" class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">{{ block.data.preTitle }}</p>
          <h2 class="text-4xl font-bold">{{ block.data.title }}</h2>
          <p v-if="block.data.subtitle" class="text-base-content/60 max-w-xl mx-auto mt-4" v-html="block.data.subtitle"></p>
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

      <!-- Pricing Block -->
      <section v-if="block.type === 'Pricing'" class="py-24 bg-base-100 w-full border-t border-base-200">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-16">
            <p v-if="block.data.preTitle" class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">{{ block.data.preTitle }}</p>
            <h2 class="text-4xl font-bold mb-4">{{ block.data.title }}</h2>
            <p v-if="block.data.subtitle" class="text-base-content/60 max-w-xl mx-auto" v-html="block.data.subtitle"></p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-5xl mx-auto">
            <div v-for="(plan, idx) in block.data.plans" :key="idx" class="card bg-base-100 border border-base-300 relative" :class="{'shadow-xl ring-2 ring-primary border-primary': plan.isPopular}">
              <div v-if="plan.isPopular" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 badge badge-primary font-bold px-4 py-3">Most Popular</div>
              <div class="card-body p-8">
                <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
                <p class="text-base-content/60 text-sm mb-6">{{ plan.description }}</p>
                <div class="flex items-baseline gap-1 mb-8">
                  <span class="text-5xl font-extrabold">{{ plan.price }}</span>
                  <span class="text-base-content/50 font-medium">{{ plan.period }}</span>
                </div>
                <button class="btn w-full mb-8 font-bold" :class="plan.isPopular ? 'btn-primary' : 'btn-outline'">{{ plan.cta }}</button>
                <div class="space-y-4">
                  <div v-for="(feat, fidx) in (plan.features || '').split(',').map(t=>t.trim()).filter(Boolean)" :key="fidx" class="flex items-center gap-3 text-sm">
                    <IconShieldCheck class="w-5 h-5 text-success shrink-0"/>
                    <span>{{ feat }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Block -->
      <section v-if="block.type === 'FAQ'" class="py-24 bg-base-200 w-full">
        <div class="max-w-4xl mx-auto px-4">
           <div class="text-center mb-16">
            <p v-if="block.data.preTitle" class="text-sm font-semibold text-primary uppercase tracking-widest mb-3">{{ block.data.preTitle }}</p>
            <h2 class="text-4xl font-bold mb-4">{{ block.data.title }}</h2>
            <p v-if="block.data.subtitle" class="text-base-content/60 max-w-xl mx-auto" v-html="block.data.subtitle"></p>
          </div>
          <div class="space-y-4">
            <div v-for="(faq, idx) in block.data.faqs" :key="idx" class="collapse collapse-arrow bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-faq" :checked="idx === 0" /> 
              <div class="collapse-title text-lg font-semibold pr-12">
                {{ faq.question }}
              </div>
              <div class="collapse-content text-base-content/70">
                <p class="leading-relaxed whitespace-pre-line">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter Block -->
      <section v-if="block.type === 'Newsletter'" class="py-24 bg-base-100 w-full border-t border-base-200">
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-primary/5 rounded-3xl p-10 md:p-16 border border-primary/20 text-center relative overflow-hidden">
             <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px);background-size:24px 24px"></div>
             <div class="relative z-10">
               <p v-if="block.data.preTitle" class="text-sm font-bold text-primary uppercase tracking-widest mb-3">{{ block.data.preTitle }}</p>
               <h2 class="text-3xl md:text-5xl font-extrabold mb-6">{{ block.data.title }}</h2>
               <p class="text-base-content/70 text-lg mb-8 max-w-2xl mx-auto">{{ block.data.subtitle }}</p>
               <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" @submit.prevent>
                 <input type="email" placeholder="Enter your email address" class="input input-lg input-bordered w-full" required />
                 <button type="submit" class="btn btn-primary btn-lg shrink-0">Subscribe</button>
               </form>
             </div>
          </div>
        </div>
      </section>

      <!-- CTA Banner Block -->
      <section v-if="block.type === 'CTA'" class="bg-primary text-primary-content py-20 w-full">
        <div class="max-w-3xl mx-auto px-4 text-center">
          <h2 class="text-4xl font-extrabold mb-4">{{ block.data.title }}</h2>
          <p class="opacity-70 text-lg mb-10" v-html="block.data.subtitle"></p>
          <NuxtLink v-if="block.data.ctaText" :to="block.data.ctaLink || '/login'" class="btn btn-secondary btn-lg px-10 font-bold">{{ block.data.ctaText }}</NuxtLink>
        </div>
      </section>

    </template>
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

const { data: cmsPage } = await useAsyncData('landing-cms', () => $fetch('/api/cms/landing'))

const blocks = computed(() => cmsPage.value?.blocks || [])

</script>
