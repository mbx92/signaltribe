import { createError } from 'h3'
import { requireRole } from '../../../utils/auth'
import { deleteDevelopmentBoardItem } from '../../../utils/development-board-db'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Item ID is required' })
  }

  const deleted = deleteDevelopmentBoardItem(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Development board item not found' })
  }

  return { success: true }
})