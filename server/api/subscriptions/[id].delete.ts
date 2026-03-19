import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { logActivity, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Subscription ID is required' })
  }

  const subscription = await prisma.subscription.findUnique({ where: { id } })
  if (!subscription || subscription.userId !== user.id) {
    throw createError({ statusCode: 404, statusMessage: 'Subscription not found' })
  }

  const updated = await prisma.subscription.update({
    where: { id },
    data: { status: 'CANCELLED' },
  })

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'SUBSCRIPTION_CANCEL',
    entity: 'Subscription',
    entityId: id,
    ip: getClientIp(event),
  })

  return updated
})
