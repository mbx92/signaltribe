import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'
import { logActivity, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'analyst')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Journal ID is required' })
  }

  const journal = await prisma.journalEntry.findUnique({ where: { id } })
  if (!journal || journal.userId !== user.id) {
    throw createError({ statusCode: 404, statusMessage: 'Journal entry not found' })
  }

  const body = await readBody(event)
  const { title, content, status } = body || {}

  const data: any = {}
  if (title) data.title = title
  if (content) data.content = content
  if (status) data.status = status

  const updated = await prisma.journalEntry.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  })

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'JOURNAL_UPDATE',
    entity: 'JournalEntry',
    entityId: id,
    ip: getClientIp(event),
    meta: data,
  })

  return updated
})
