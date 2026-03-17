<template>
  <div class="min-h-screen bg-base-200 flex flex-col">

    <!-- Top Header -->
    <header class="h-14 bg-base-100 border-b border-base-300 flex items-center px-4 lg:px-6 sticky top-0 z-40 shrink-0">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 mr-6">
        <div class="w-7 h-7 bg-primary rounded flex items-center justify-center">
          <IconChartArrows class="w-4 h-4 text-primary-content"/>
        </div>
        <span class="font-bold text-primary text-base hidden lg:block">{{ appName }}</span>
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
            <NuxtLink to="/dashboard/user/pro-feed" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconChartLine class="w-4 h-4 shrink-0"/> Pro Feed
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
            <NuxtLink to="/dashboard/admin/settings" class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors" active-class="bg-primary/10 text-primary font-semibold">
              <IconAdjustments class="w-4 h-4 shrink-0"/> Platform Settings
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

    <!-- Mobile Bottom Nav (Custom Tailwind Implementation) -->
    <nav class="fixed bottom-0 left-0 right-0 z-[99] bg-base-100 flex justify-around items-center h-16 lg:hidden border-t border-base-300 pb-0">
      <!-- User View -->
      <template v-if="showUserNav && !showAnalystNav && !showAdminNav">
        <NuxtLink to="/dashboard/user" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconLayoutDashboard class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/user/pro-feed" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconChartLine class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Pro Feed</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/user/subscriptions" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconUsers class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Subs</span>
        </NuxtLink>
        <!-- Switch to Analyst/Admin if applicable -->
        <NuxtLink v-if="currentUser?.role === 'ANALYST'" to="/dashboard/analyst" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconSend class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Analyst</span>
        </NuxtLink>
        <NuxtLink v-if="currentUser?.role === 'ADMIN'" to="/dashboard/admin" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconShield class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Admin</span>
        </NuxtLink>
      </template>

      <!-- Analyst View -->
      <template v-else-if="showAnalystNav">
        <NuxtLink to="/dashboard/analyst" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconLayoutDashboard class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Overview</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/analyst/journal" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconBook class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Journal</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/analyst/signals" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconChartLine class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Signals</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/analyst/subscribers" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconUsersGroup class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Subs</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/user" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconUser class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">User</span>
        </NuxtLink>
      </template>

      <!-- Admin View -->
      <template v-else-if="showAdminNav">
        <NuxtLink to="/dashboard/admin" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconLayoutDashboard class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Admin</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/admin/users" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconUserCog class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Users</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/admin/analysts" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconCertificate class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">Analysts</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/admin/cms" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconSettings class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">CMS</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/user" class="flex flex-col items-center justify-center p-2 w-full h-full text-base-content/60" active-class="text-primary bg-primary/10">
          <IconUser class="w-5 h-5"/>
          <span class="text-[10px] mt-1 font-medium">User</span>
        </NuxtLink>
      </template>
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
  IconWorld,
  IconUsers,
  IconSend,
  IconBook,
  IconUsersGroup,
  IconUserCog,
  IconCertificate,
  IconArrowLeft,
  IconShield,
  IconAdjustments,
} from '@tabler/icons-vue'

const router = useRouter()
const { currentUser, logout, initFromStorage } = useAuth()

const { data: globalSettings } = await useAsyncData('settings', () => $fetch('/api/settings'))
const appName = computed(() => globalSettings.value?.appName || 'SignalTribe')

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
