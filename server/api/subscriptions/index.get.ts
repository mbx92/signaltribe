import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id },
    include: {
      analyst: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return subscriptions
})
