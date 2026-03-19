import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const query = getQuery(event)
  const type = (query.type as string) || 'activity' // 'activity' | 'system'
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(100, parseInt(query.limit as string) || 50)
  const skip = (page - 1) * limit
  const action = query.action as string | undefined
  const level = query.level as string | undefined

  if (type === 'system') {
    const where = level ? { level } : {}
    const [total, logs] = await Promise.all([
      prisma.systemLog.count({ where }),
      prisma.systemLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          level: true,
          message: true,
          stack: true,
          path: true,
          userId: true,
          meta: true,
          createdAt: true,
        },
      }),
    ])

    const userIds = [...new Set(logs.map((log) => log.userId).filter(Boolean))] as string[]
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true },
        })
      : []

    const userMap = new Map(users.map((user) => [user.id, user]))
    const enrichedLogs = logs.map((log) => ({
      ...log,
      userName: log.userId ? userMap.get(log.userId)?.name ?? null : null,
      userEmail: log.userId ? userMap.get(log.userId)?.email ?? null : null,
    }))

    return { total, page, limit, logs: enrichedLogs }
  }

  // Activity logs
  const where = action ? { action: action as any } : {}
  const [total, logs] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        userId: true,
        userEmail: true,
        action: true,
        entity: true,
        entityId: true,
        meta: true,
        ip: true,
        createdAt: true,
      },
    }),
  ])
  return { total, page, limit, logs }
})
