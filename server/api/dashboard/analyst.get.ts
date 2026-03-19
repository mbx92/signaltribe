import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'analyst')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    subscriberCount,
    activeSignals,
    recentSignals,
    winCount,
    lossCount,
    revenue,
    recentJournals,
  ] = await Promise.all([
    prisma.subscription.count({
      where: {
        analyst: { userId: user.id },
        status: 'ACTIVE',
      },
    }),
    prisma.signal.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.signal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.signal.count({
      where: { userId: user.id, status: 'TP_HIT', closedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.signal.count({
      where: { userId: user.id, status: 'SL_HIT', closedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.payment.aggregate({
      where: {
        subscription: { analyst: { userId: user.id } },
        status: 'PAID',
      },
      _sum: { amount: true },
    }),
    prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const totalDecided = winCount + lossCount
  const winRate = totalDecided > 0 ? (winCount / totalDecided) * 100 : 0

  return {
    subscriberCount,
    winRate: Math.round(winRate * 10) / 10,
    winCount,
    lossCount,
    revenue: revenue._sum.amount || 0,
    activeSignals,
    recentSignals,
    recentJournals,
  }
})
