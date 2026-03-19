export default defineNuxtRouteMiddleware(async (to) => {
  const { currentUser, fetchUser } = useAuth()

  // Public routes that don't require auth
  const publicRoutes = ['/login', '/', '/public-feed', '/api-docs']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // If no user loaded yet, try fetching from session cookie
  if (!currentUser.value) {
    await fetchUser()
  }

  // If still no user, redirect to login
  if (!currentUser.value) {
    return navigateTo('/login')
  }
})
