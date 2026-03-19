import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const twentyFourHoursAgo = new Date()
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

  // Get user's subscribed analysts
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id, status: 'ACTIVE' },
    include: {
      analyst: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  })

  const analystUserIds = subscriptions.map((s) => s.analyst.userId)

  const [
    signalsLast24h,
    unreadNotifications,
    recentSignals,
  ] = await Promise.all([
    prisma.signal.count({
      where: {
        userId: { in: analystUserIds },
        createdAt: { gte: twentyFourHoursAgo },
      },
    }),
    prisma.notification.count({
      where: { userId: user.id, read: false },
    }),
    prisma.signal.findMany({
      where: { userId: { in: analystUserIds } },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  return {
    activeSubscriptions: subscriptions.length,
    signalsLast24h,
    unreadNotifications,
    subscriptions,
    recentSignals,
  }
})
