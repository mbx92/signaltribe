import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  // Get subscriber list for the current analyst
  const profile = await prisma.analystProfile.findUnique({
    where: { userId: user.id },
  })

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Analyst profile not found' })
  }

  const subscribers = await prisma.subscription.findMany({
    where: { analystId: profile.id },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      payments: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  })

  return subscribers
})
