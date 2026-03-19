import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'
import { hashPassword } from '../../utils/auth'
import { logActivity, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const admin = await requireRole(event, 'admin')
  const body = await readBody(event)
  const { name, email, password, roleName } = body || {}

  if (!email || !password || !roleName) {
    throw createError({ statusCode: 400, statusMessage: 'Email, password, and role are required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email format' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
  }

  const role = await prisma.role.findUnique({ where: { name: roleName } })
  if (!role) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid role' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already in use' })
  }

  const user = await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: hashPassword(password),
      roleId: role.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: { select: { name: true } },
      createdAt: true,
    },
  })

  await logActivity({
    userId: admin.id,
    userEmail: admin.email,
    action: 'USER_CREATE',
    entity: 'User',
    entityId: user.id,
    ip: getClientIp(event),
    meta: { createdEmail: email, role: roleName, createdBy: admin.email },
  })

  return user
})
