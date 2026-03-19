export const DEMO_ACCOUNTS = {
  admin: {
    role: 'admin',
    name: 'Admin Master',
    email: 'admin@saastrader.local',
    password: 'admin123',
    avatar: 'https://i.pravatar.cc/150?u=admin_st1',
    redirect: '/dashboard/admin',
    badge: 'Administrator',
  },
  analyst: {
    role: 'analyst',
    name: 'Alex Crypto',
    email: 'alex@saastrader.local',
    password: 'analyst123',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    redirect: '/dashboard/analyst',
    badge: 'Analyst',
  },
  user: {
    role: 'user',
    name: 'Active Trader',
    email: 'trader@saastrader.local',
    password: 'trader123',
    avatar: 'https://i.pravatar.cc/150?u=user1',
    redirect: '/dashboard/user',
    badge: 'Trader',
  },
}

const ROLE_REDIRECTS = {
  admin: '/dashboard/admin',
  analyst: '/dashboard/analyst',
  trader: '/dashboard/user',
  viewer: '/dashboard/user',
  user: '/dashboard/user',
}

export const useAuth = () => {
  const currentUser = useState('auth_user', () => null)

  const fetchUser = async () => {
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      const data = await $fetch('/api/auth/me', { headers })
      if (data) {
        currentUser.value = data
      } else {
        currentUser.value = null
      }
    } catch {
      currentUser.value = null
    }
    return currentUser.value
  }

  const loginByCredentials = async (email, password) => {
    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      currentUser.value = data
      return ROLE_REDIRECTS[data.role] || '/dashboard/user'
    } catch (err) {
      return null
    }
  }

  const loginByRole = async (role) => {
    const account = DEMO_ACCOUNTS[role]
    if (!account) return null
    return loginByCredentials(account.email, account.password)
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    currentUser.value = null
  }

  const isLoggedIn = computed(() => !!currentUser.value)

  return { currentUser, loginByRole, loginByCredentials, logout, fetchUser, isLoggedIn, DEMO_ACCOUNTS }
}
