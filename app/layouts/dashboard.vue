<template>
  <div class="min-h-screen bg-base-200 flex flex-col">

    <!-- Top Header -->
    <header class="h-14 bg-base-100 border-b border-base-300 flex items-center px-4 lg:px-6 sticky top-0 z-40 shrink-0">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 mr-6">
        <div class="w-7 h-7 bg-primary rounded flex items-center justify-center">
          <IconChartArrows class="w-4 h-4 text-primary-content"/>
        </div>
        <span class="font-bold text-primary text-base hidden lg:block">SignalTribe</span>
      </NuxtLink>

      <div class="grow"/>

      <!-- Notification + Avatar -->
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost btn-sm btn-square relative">
          <IconBell class="w-5 h-5"/>
          <span class="badge badge-xs badge-primary absolute top-1 right-1"></span>
        </button>

        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm flex items-center gap-2 px-2 cursor-pointer">
            <div class="avatar">
              <div class="w-7 h-7 rounded-full">
                <img :src="currentUser?.avatar ?? 'https://i.pravatar.cc/150?u=guest'" />
              </div>
            </div>
            <span class="hidden md:block text-sm font-medium">{{ currentUser?.name ?? 'Guest' }}</span>
            <IconChevronDown class="w-4 h-4 opacity-50"/>
          </label>
          <ul tabindex="0" class="dropdown-content menu menu-sm z-50 mt-1 w-52 bg-base-100 shadow-xl border border-base-200 rounded-box p-1">
            <li class="menu-title px-3 pt-2 pb-1">
              <span class="text-xs">Signed in as <strong>{{ currentUser?.name ?? 'Guest' }}</strong></span>
            </li>
            <li class="px-3 pb-1">
              <span :class="roleBadgeClass" class="badge badge-sm w-full justify-center">{{ currentUser?.badge ?? 'Guest' }}</span>
            </li>
            <li><a class="gap-2"><IconUser class="w-4 h-4"/> My Profile</a></li>
            <li><a class="gap-2"><IconSettings class="w-4 h-4"/> Settings</a></li>
            <div class="divider my-0.5"></div>
            <li><a class="gap-2 text-error" @click="handleLogout"><IconLogout class="w-4 h-4"/> Log Out</a></li>
          </ul>
        </div>
      </div>
    </header>

    <div class="flex grow overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-56 bg-base-100 border-r border-base-300 shrink-0 hidden lg:flex flex-col overflow-y-auto">
        <nav class="flex flex-col gap-0.5 p-3 grow">

          <!-- User Section (visible to: user, analyst) -->
          <template v-if="showUserNav">
            <p class="text-xs font-semibold text-base-content/40 uppercase tracking-widest px-3 pt-3 pb-1">My Account</p>
            <NuxtLink to="/dashboard/user" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconLayoutDashboard class="w-4 h-4 shrink-0"/> Dashboard
            </NuxtLink>
            <NuxtLink to="/dashboard/user/signals" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconChartLine class="w-4 h-4 shrink-0"/> Signal Feed
            </NuxtLink>
            <NuxtLink to="/dashboard/user/subscriptions" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconUsers class="w-4 h-4 shrink-0"/> My Subscriptions
            </NuxtLink>
            <div class="divider my-1"></div>
          </template>

          <!-- Analyst Section (visible to: analyst) -->
          <template v-if="showAnalystNav">
            <p class="text-xs font-semibold text-base-content/40 uppercase tracking-widest px-3 pb-1">Analyst</p>
            <NuxtLink to="/dashboard/analyst" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconLayoutDashboard class="w-4 h-4 shrink-0"/> Overview
            </NuxtLink>
            <NuxtLink to="/dashboard/analyst/publish" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconSend class="w-4 h-4 shrink-0"/> Publish Signal
            </NuxtLink>
            <NuxtLink to="/dashboard/analyst/journal" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconBook class="w-4 h-4 shrink-0"/> Trading Journal
            </NuxtLink>
            <NuxtLink to="/dashboard/analyst/signals" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconChartLine class="w-4 h-4 shrink-0"/> My Signals
            </NuxtLink>
            <NuxtLink to="/dashboard/analyst/subscribers" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconUsersGroup class="w-4 h-4 shrink-0"/> Subscribers
            </NuxtLink>
            <div class="divider my-1"></div>
          </template>

          <!-- Admin Section (visible to: admin) -->
          <template v-if="showAdminNav">
            <p class="text-xs font-semibold text-base-content/40 uppercase tracking-widest px-3 pb-1">Admin</p>
            <NuxtLink to="/dashboard/admin" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconLayoutDashboard class="w-4 h-4 shrink-0"/> Platform Overview
            </NuxtLink>
            <NuxtLink to="/dashboard/admin/users" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconUserCog class="w-4 h-4 shrink-0"/> Manage Users
            </NuxtLink>
            <NuxtLink to="/dashboard/admin/analysts" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconCertificate class="w-4 h-4 shrink-0"/> Approve Analysts
            </NuxtLink>
            <NuxtLink to="/dashboard/admin/cms" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconSettings class="w-4 h-4 shrink-0"/> Landing CMS
            </NuxtLink>
          </template>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-3 border-t border-base-300">
          <NuxtLink to="/" class="flex items-center gap-2 px-3 py-2 rounded text-sm text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors">
            <IconArrowLeft class="w-4 h-4"/> Back to Site
          </NuxtLink>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="grow overflow-y-auto p-5 lg:p-8 pb-24 lg:pb-8">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Nav -->
    <nav class="btm-nav lg:hidden z-50 border-t border-base-300">
      <NuxtLink to="/dashboard/user" active-class="active text-primary">
        <IconLayoutDashboard class="w-5 h-5"/>
        <span class="btm-nav-label text-xs">Home</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/user/signals" active-class="active text-primary">
        <IconChartLine class="w-5 h-5"/>
        <span class="btm-nav-label text-xs">Signals</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/analyst" active-class="active text-primary">
        <IconSend class="w-5 h-5"/>
        <span class="btm-nav-label text-xs">Analyst</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/admin" active-class="active text-primary">
        <IconShield class="w-5 h-5"/>
        <span class="btm-nav-label text-xs">Admin</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
import {
  IconChartArrows,
  IconBell,
  IconChevronDown,
  IconUser,
  IconSettings,
  IconLogout,
  IconLayoutDashboard,
  IconChartLine,
  IconUsers,
  IconSend,
  IconBook,
  IconUsersGroup,
  IconUserCog,
  IconCertificate,
  IconArrowLeft,
  IconShield,
} from '@tabler/icons-vue'

const router = useRouter()
const { currentUser, logout, initFromStorage } = useAuth()

onMounted(() => initFromStorage())

const role = computed(() => currentUser.value?.role ?? 'user')

const showUserNav    = computed(() => role.value === 'user')
const showAnalystNav = computed(() => role.value === 'analyst')
const showAdminNav   = computed(() => role.value === 'admin')

const roleBadgeClass = computed(() => ({
  admin:   'badge-error',
  analyst: 'badge-warning',
  user:    'badge-info',
}[role.value] ?? 'badge-ghost'))

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>
