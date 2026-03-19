import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))
  const status = query.status as string | undefined
  const direction = query.direction as string | undefined
  const analystId = query.analystId as string | undefined

  const where: any = {}
  if (status) where.status = status
  if (direction) where.direction = direction
  if (analystId) where.userId = analystId

  const [signals, total] = await Promise.all([
    prisma.signal.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.signal.count({ where }),
  ])

  return { signals, total, page, limit }
})
