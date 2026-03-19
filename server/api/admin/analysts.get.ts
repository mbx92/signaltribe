import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')
  const query = getQuery(event)
  const status = (query.status as string) || 'PENDING'

  const analysts = await prisma.analystProfile.findMany({
    where: { status: status as any },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true, createdAt: true },
      },
      _count: { select: { subscriptions: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return analysts
})
