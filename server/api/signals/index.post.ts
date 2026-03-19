import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'
import { logActivity, logSystem, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'analyst')
  const body = await readBody(event)
  const { pair, direction, entry, tp, sl, notes, timeframe, risk } = body || {}

  if (!pair || !direction || entry == null || tp == null || sl == null) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields: pair, direction, entry, tp, sl' })
  }

  const signal = await prisma.signal.create({
    data: {
      userId: user.id,
      pair,
      direction,
      entry: parseFloat(entry),
      tp: parseFloat(tp),
      sl: parseFloat(sl),
      notes: notes || null,
      timeframe: timeframe || 'H4',
      risk: risk || 'MEDIUM',
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  })

  // Notify all subscribers
  const analystProfile = await prisma.analystProfile.findUnique({
    where: { userId: user.id },
    include: { subscriptions: { where: { status: 'ACTIVE' }, select: { userId: true } } },
  })

  if (analystProfile?.subscriptions.length) {
    await prisma.notification.createMany({
      data: analystProfile.subscriptions.map((sub) => ({
        userId: sub.userId,
        title: `New Signal: ${pair} ${direction}`,
        message: `${user.name} published a new ${direction} signal for ${pair}`,
        link: `/dashboard/user/pro-feed`,
      })),
    })
  }

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'SIGNAL_CREATE',
    entity: 'Signal',
    entityId: signal.id,
    ip: getClientIp(event),
    meta: { pair, direction, entry, tp, sl },
  })

  return signal
})
