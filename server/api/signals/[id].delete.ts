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

  await prisma.signal.delete({ where: { id } })

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'SIGNAL_DELETE',
    entity: 'Signal',
    entityId: id,
    ip: getClientIp(event),
    meta: { pair: signal.pair, direction: signal.direction },
  })

  return { success: true }
})
