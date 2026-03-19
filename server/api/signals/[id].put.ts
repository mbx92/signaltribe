import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'
import { logActivity, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'analyst')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Signal ID is required' })
  }

  const signal = await prisma.signal.findUnique({ where: { id } })
  if (!signal || signal.userId !== user.id) {
    throw createError({ statusCode: 404, statusMessage: 'Signal not found' })
  }

  const body = await readBody(event)
  const { current, status, notes } = body || {}

  const data: any = {}
  if (current != null) data.current = parseFloat(current)
  if (status) data.status = status
  if (notes !== undefined) data.notes = notes
  if (status && status !== 'ACTIVE') data.closedAt = new Date()

  const updated = await prisma.signal.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  })

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'SIGNAL_UPDATE',
    entity: 'Signal',
    entityId: id,
    ip: getClientIp(event),
    meta: data,
  })

  return updated
})
