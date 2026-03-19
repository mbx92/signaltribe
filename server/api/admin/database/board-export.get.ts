import { send } from 'h3'
import { existsSync, readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { requireRole } from '../../../utils/auth'
import { getDevelopmentBoardDbPath } from '../../../utils/development-board-db'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const dbPath = getDevelopmentBoardDbPath()

  if (!existsSync(dbPath)) {
    throw createError({ statusCode: 404, statusMessage: 'Board database file tidak ditemukan.' })
  }

  const fileContent = readFileSync(dbPath)
  const name = basename(dbPath).replace('.sqlite', '')
  const fileName = `${name}-backup-${new Date().toISOString().slice(0, 10)}.sqlite`

  setResponseHeaders(event, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Content-Length': String(fileContent.length),
    'Cache-Control': 'no-store',
  })

  return send(event, fileContent, 'application/octet-stream')
})
