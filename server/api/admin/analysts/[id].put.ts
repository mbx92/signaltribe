import { prisma } from '../../../utils/prisma'
import { requireRole } from '../../../utils/auth'
import { logActivity, getClientIp } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  const admin = await requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { status } = body || {}

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Analyst profile ID is required' })
  }
  if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status must be APPROVED or REJECTED' })
  }

  const profile = await prisma.analystProfile.findUnique({ where: { id } })
  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Analyst profile not found' })
  }

  const updated = await prisma.analystProfile.update({
    where: { id },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  })

  // Notify the analyst
  await prisma.notification.create({
    data: {
      userId: profile.userId,
      title: status === 'APPROVED' ? 'Application Approved!' : 'Application Rejected',
      message: status === 'APPROVED'
        ? 'Your analyst application has been approved. You can now publish signals.'
        : 'Your analyst application has been rejected. Contact support for details.',
      link: '/dashboard/analyst',
    },
  })

  await logActivity({
    userId: admin.id,
    userEmail: admin.email,
    action: status === 'APPROVED' ? 'ANALYST_APPROVE' : 'ANALYST_REJECT',
    entity: 'AnalystProfile',
    entityId: id,
    ip: getClientIp(event),
    meta: { analystUserId: profile.userId, status },
  })

  return updated
})
