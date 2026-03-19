import { prisma } from '../../utils/prisma'
import { hashPassword, setSessionCookie } from '../../utils/auth'
import { logActivity, logSystem, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body || {}
  const ip = getClientIp(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true, analystProfile: true },
  })

  if (!user || user.password !== hashPassword(password)) {
    await logSystem({
      level: 'warn',
      message: `Failed login attempt for email: ${email}`,
      path: '/api/auth/login',
      meta: { ip },
    })
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  setSessionCookie(event, user.id)

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'LOGIN',
    ip,
    meta: { role: user.role.name },
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role.name,
    analystStatus: user.analystProfile?.status ?? null,
  }
})
