import { createError, readBody } from 'h3'
import { requireRole } from '../../../utils/auth'
import { getDevelopmentBoardMeta, setDevelopmentBoardMeta } from '../../../utils/development-board-db'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  if (event.method === 'GET') {
    return { meta: getDevelopmentBoardMeta() }
  }

  const body = await readBody<{ phase?: string; phaseNote?: string }>(event)

  if (!body.phase?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Phase is required' })
  }

  const meta = setDevelopmentBoardMeta({
    phase: body.phase,
    phaseNote: body.phaseNote ?? '',
  })

  return { meta }
})