import { prisma } from '../../../utils/prisma'
import { requireRole } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const query = getQuery(event)
  const limit = Math.min(50, parseInt(query.limit as string) || 20)

  const logs = await prisma.systemLog.findMany({
    where: { path: '/internal/qa-monitor' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      level: true,
      message: true,
      meta: true,
      createdAt: true,
    },
  })

  return { logs }
})