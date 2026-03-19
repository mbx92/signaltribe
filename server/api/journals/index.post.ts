import { prisma } from '../../utils/prisma'
import { requireRole } from '../../utils/auth'
import { logActivity, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'analyst')
  const body = await readBody(event)
  const { title, content, status } = body || {}

  if (!title || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Title and content are required' })
  }

  const journal = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      title,
      content,
      status: status || 'DRAFT',
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  })

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'JOURNAL_CREATE',
    entity: 'JournalEntry',
    entityId: journal.id,
    ip: getClientIp(event),
    meta: { title, status: status || 'DRAFT' },
  })

  return journal
})
