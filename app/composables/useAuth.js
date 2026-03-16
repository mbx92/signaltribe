export const DEMO_ACCOUNTS = {
  admin: {
    role: 'admin',
    name: 'Admin Master',
    email: 'admin@signaltribe.com',
    password: 'admin123',
    avatar: 'https://i.pravatar.cc/150?u=admin_st1',
    redirect: '/dashboard/admin',
    badge: 'Administrator',
  },
  analyst: {
    role: 'analyst',
    name: 'Alex Crypto',
    email: 'alex@signaltribe.com',
    password: 'analyst123',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    redirect: '/dashboard/analyst',
    badge: 'Analyst',
  },
  user: {
    role: 'user',
    name: 'Budi S.',
    email: 'budi@signaltribe.com',
    password: 'user123',
    avatar: 'https://i.pravatar.cc/150?u=user1',
    redirect: '/dashboard/user',
    badge: 'Trader',
  },
}

export const useAuth = () => {
  const currentUser = useState('auth_user', () => null)

  const initFromStorage = () => {
    if (process.client && !currentUser.value) {
      try {
        const stored = localStorage.getItem('st_auth')
        if (stored) currentUser.value = JSON.parse(stored)
      } catch {}
    }
  }

  const loginByRole = (role) => {
    const user = DEMO_ACCOUNTS[role]
    currentUser.value = user
    if (process.client) localStorage.setItem('st_auth', JSON.stringify(user))
    return user.redirect
  }

  const loginByCredentials = (email, password) => {
    const match = Object.values(DEMO_ACCOUNTS).find(
      (u) => u.email === email && u.password === password
    )
    if (!match) return null
    currentUser.value = match
    if (process.client) localStorage.setItem('st_auth', JSON.stringify(match))
    return match.redirect
  }

  const logout = () => {
    currentUser.value = null
    if (process.client) localStorage.removeItem('st_auth')
  }

  return { currentUser, loginByRole, loginByCredentials, logout, initFromStorage, DEMO_ACCOUNTS }
}
