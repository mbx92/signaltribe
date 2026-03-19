import { prisma } from '../../../utils/prisma'
import { requireRole } from '../../../utils/auth'
import { TEST_MANAGER_LOG_PATH } from '../../../utils/test-manager'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const query = getQuery(event)
  const limit = Math.min(30, parseInt(query.limit as string) || 10)

  const logs = await prisma.systemLog.findMany({
    where: { path: TEST_MANAGER_LOG_PATH },
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

  return {
    logs: logs.map((log) => ({
      ...log,
      meta: log.meta ? JSON.parse(log.meta) : null,
    })),
  }
})