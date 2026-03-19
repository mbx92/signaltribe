import { createError } from 'h3'
import { requireRole } from '../../../../utils/auth'
import { deleteQaMonitorCheck } from '../../../../utils/development-board-db'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Check ID is required' })
  }

  const deleted = deleteQaMonitorCheck(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'QA check not found' })
  }

  return { success: true }
})