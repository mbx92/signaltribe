import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

export const hashPassword = (raw: string): string =>
  createHash('sha256').update(raw).digest('hex')

const SESSION_COOKIE = 'st_session'

export const setSessionCookie = (event: H3Event, userId: string) => {
  setCookie(event, SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export const getSessionUserId = (event: H3Event): string | undefined => {
  return getCookie(event, SESSION_COOKIE)
}

export const clearSessionCookie = (event: H3Event) => {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export const requireAuth = async (event: H3Event) => {
  const userId = getSessionUserId(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { prisma } = await import('./prisma')
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  })

  if (!user) {
    clearSessionCookie(event)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return user
}

export const requireRole = async (event: H3Event, ...roles: string[]) => {
  const user = await requireAuth(event)
  if (!roles.includes(user.role.name)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user
}
