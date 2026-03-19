import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const [
    totalUsers,
    activeAnalysts,
    pendingAnalysts,
    activeSignals,
    totalPayments,
    recentPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.analystProfile.count({ where: { status: 'APPROVED' } }),
    prisma.analystProfile.count({ where: { status: 'PENDING' } }),
    prisma.signal.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        subscription: {
          include: {
            analyst: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    }),
  ])

  // Top analysts by subscriber count
  const topAnalysts = await prisma.analystProfile.findMany({
    where: { status: 'APPROVED' },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      _count: { select: { subscriptions: true } },
    },
    orderBy: { subscriptions: { _count: 'desc' } },
    take: 5,
  })

  return {
    totalUsers,
    activeAnalysts,
    pendingAnalysts,
    activeSignals,
    mrr: totalPayments._sum.amount || 0,
    recentPayments,
    topAnalysts,
  }
})
