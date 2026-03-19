import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))

  const [analysts, total] = await Promise.all([
    prisma.analystProfile.findMany({
      where: { status: 'APPROVED' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        _count: { select: { subscriptions: true } },
      },
      orderBy: { subscriptions: { _count: 'desc' } },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.analystProfile.count({ where: { status: 'APPROVED' } }),
  ])

  // For each analyst, compute their signal stats
  const analyticsWithStats = await Promise.all(
    analysts.map(async (analyst) => {
      const [winCount, lossCount, totalSignals] = await Promise.all([
        prisma.signal.count({ where: { userId: analyst.userId, status: 'TP_HIT' } }),
        prisma.signal.count({ where: { userId: analyst.userId, status: 'SL_HIT' } }),
        prisma.signal.count({ where: { userId: analyst.userId } }),
      ])
      const decided = winCount + lossCount
      const winRate = decided > 0 ? Math.round((winCount / decided) * 1000) / 10 : 0
      return {
        ...analyst,
        winRate,
        totalSignals,
        subscriberCount: analyst._count.subscriptions,
      }
    })
  )

  return { analysts: analyticsWithStats, total, page, limit }
})
