<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <!-- Navbar -->
    <header class="navbar bg-base-100/95 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4 lg:px-12 h-16">
      <div class="flex-1 flex items-center gap-8">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <IconChartArrows class="w-5 h-5 text-primary-content"/>
          </div>
          <span class="text-xl font-bold text-primary tracking-tight">{{ appName }}</span>
        </NuxtLink>
        <nav class="hidden md:flex gap-1">
          <NuxtLink to="/public-feed" class="btn btn-ghost btn-sm font-medium text-primary">Live Signals</NuxtLink>
          <NuxtLink to="/#analysts" class="btn btn-ghost btn-sm font-medium">Analysts</NuxtLink>
          <NuxtLink to="/#how-it-works" class="btn btn-ghost btn-sm font-medium">How it Works</NuxtLink>
          <NuxtLink to="/#pricing" class="btn btn-ghost btn-sm font-medium">Pricing</NuxtLink>
        </nav>
      </div>
      <div class="flex-none flex items-center gap-2">
        <NuxtLink to="/login" class="hidden md:flex btn btn-ghost btn-sm">Log In</NuxtLink>
        <NuxtLink to="/login" class="btn btn-primary btn-sm font-semibold">Get Started Free</NuxtLink>
        <!-- Mobile menu -->
        <div class="dropdown dropdown-end md:hidden">
          <label tabindex="0" class="btn btn-ghost btn-square btn-sm">
            <IconMenu2 class="w-5 h-5"/>
          </label>
          <ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-200 mt-2">
            <li><NuxtLink to="/public-feed" class="text-primary font-medium">Live Signals</NuxtLink></li>
            <li><a href="/#analysts">Analysts</a></li>
            <li><a>How it Works</a></li>
            <li><a>Pricing</a></li>
            <li class="divider my-1"></li>
            <li><NuxtLink to="/login">Log In</NuxtLink></li>
          </ul>
        </div>
      </div>
    </header>

    <main class="grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-neutral text-neutral-content mt-24">
      <div class="max-w-7xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <IconChartArrows class="w-5 h-5 text-primary-content"/>
            </div>
            <span class="text-xl font-bold">{{ appName }}</span>
          </div>
          <p class="text-sm opacity-60 leading-relaxed">Professional trading signals from vetted market analysts. Trade with confidence.</p>
          <div class="flex gap-3 mt-6">
            <a class="btn btn-ghost btn-square btn-sm opacity-60 hover:opacity-100"><IconBrandTwitter class="w-4 h-4"/></a>
            <a class="btn btn-ghost btn-square btn-sm opacity-60 hover:opacity-100"><IconBrandTelegram class="w-4 h-4"/></a>
            <a class="btn btn-ghost btn-square btn-sm opacity-60 hover:opacity-100"><IconBrandDiscord class="w-4 h-4"/></a>
          </div>
        </div>
        <nav>
          <p class="footer-title opacity-50 text-xs uppercase tracking-widest mb-3">Platform</p>
          <ul class="space-y-2 text-sm opacity-70">
            <li><NuxtLink to="/public-feed" class="hover:opacity-100 cursor-pointer">Live Signal Feed</NuxtLink></li>
            <li><a class="hover:opacity-100 cursor-pointer">Find Analysts</a></li>
            <li><a class="hover:opacity-100 cursor-pointer">Trading Journal</a></li>
            <li><a class="hover:opacity-100 cursor-pointer">Performance Stats</a></li>
          </ul>
        </nav>
        <nav>
          <p class="footer-title opacity-50 text-xs uppercase tracking-widest mb-3">Company</p>
          <ul class="space-y-2 text-sm opacity-70">
            <li><a class="hover:opacity-100 cursor-pointer">About Us</a></li>
            <li><a class="hover:opacity-100 cursor-pointer">Blog</a></li>
            <li><a class="hover:opacity-100 cursor-pointer">Careers</a></li>
            <li><a class="hover:opacity-100 cursor-pointer">Contact</a></li>
          </ul>
        </nav>
        <nav>
          <p class="footer-title opacity-50 text-xs uppercase tracking-widest mb-3">Legal</p>
          <ul class="space-y-2 text-sm opacity-70">
            <li><a class="hover:opacity-100 cursor-pointer">Terms of Use</a></li>
            <li><a class="hover:opacity-100 cursor-pointer">Privacy Policy</a></li>
            <li><a class="hover:opacity-100 cursor-pointer">Risk Warning</a></li>
          </ul>
        </nav>
      </div>
      <div class="border-t border-white/10 py-6 text-center text-xs opacity-40 max-w-7xl mx-auto px-4">
        © {{ new Date().getFullYear() }} {{ appName }}. Trading signals are for informational purposes only. Past performance does not guarantee future results.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { IconChartArrows, IconMenu2, IconBrandTwitter, IconBrandTelegram, IconBrandDiscord } from '@tabler/icons-vue'

const { data: globalSettings } = await useAsyncData('settings', () => $fetch('/api/settings'))
const appName = computed(() => globalSettings.value?.appName || 'SignalTribe')
</script>
