import { requireRole } from '../../../utils/auth'
import { getDevelopmentBoardDbPath, getDevelopmentBoardMeta, listDevelopmentBoardItems } from '../../../utils/development-board-db'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  return {
    dbPath: getDevelopmentBoardDbPath(),
    meta: getDevelopmentBoardMeta(),
    items: listDevelopmentBoardItems(),
  }
})