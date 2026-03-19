import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { logActivity, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const { analystProfileId } = body || {}

  if (!analystProfileId) {
    throw createError({ statusCode: 400, statusMessage: 'analystProfileId is required' })
  }

  const analystProfile = await prisma.analystProfile.findUnique({
    where: { id: analystProfileId },
  })
  if (!analystProfile || analystProfile.status !== 'APPROVED') {
    throw createError({ statusCode: 404, statusMessage: 'Analyst not found or not approved' })
  }

  // Check if already subscribed
  const existing = await prisma.subscription.findUnique({
    where: { userId_analystId: { userId: user.id, analystId: analystProfileId } },
  })
  if (existing && existing.status === 'ACTIVE') {
    throw createError({ statusCode: 409, statusMessage: 'Already subscribed to this analyst' })
  }

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 30)

  const subscription = await prisma.subscription.upsert({
    where: { userId_analystId: { userId: user.id, analystId: analystProfileId } },
    update: {
      status: 'ACTIVE',
      priceAtPurchase: analystProfile.monthlyPrice,
      startDate: new Date(),
      endDate,
    },
    create: {
      userId: user.id,
      analystId: analystProfileId,
      priceAtPurchase: analystProfile.monthlyPrice,
      startDate: new Date(),
      endDate,
    },
    include: {
      analyst: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  })

  // Create payment record
  await prisma.payment.create({
    data: {
      userId: user.id,
      subscriptionId: subscription.id,
      amount: analystProfile.monthlyPrice,
      status: 'PAID',
    },
  })

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'SUBSCRIPTION_CREATE',
    entity: 'Subscription',
    entityId: subscription.id,
    ip: getClientIp(event),
    meta: { analystProfileId, price: analystProfile.monthlyPrice },
  })

  return subscription
})
