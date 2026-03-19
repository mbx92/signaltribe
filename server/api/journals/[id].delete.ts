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

  await prisma.journalEntry.delete({ where: { id } })

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: 'JOURNAL_DELETE',
    entity: 'JournalEntry',
    entityId: id,
    ip: getClientIp(event),
    meta: { title: journal.title },
  })

  return { success: true }
})
