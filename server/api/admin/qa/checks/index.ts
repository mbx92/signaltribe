import { createError, readBody } from 'h3'
import { requireRole } from '../../../../utils/auth'
import { createQaMonitorCheck, listQaMonitorChecks, type QaCheckType, type QaMonitorCheckInput } from '../../../../utils/development-board-db'

const VALID_TYPES = new Set<QaCheckType>(['page', 'api'])
const SOURCE_FILE_TARGET_PATTERN = /(\.(ts|js|vue)$)|(\/(index|\[[^/]+\])\.(get|post|put|patch|delete)\.(ts|js)$)/i

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  if (event.method === 'POST') {
    const body = await readBody<Partial<QaMonitorCheckInput>>(event)

    if (!body.name?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Check name is required' })
    }

    if (!body.type || !VALID_TYPES.has(body.type)) {
      throw createError({ statusCode: 400, statusMessage: 'Valid check type is required' })
    }

    if (!body.target?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Check target is required' })
    }

    const target = body.target.trim()

    if (!target.startsWith('/')) {
      throw createError({ statusCode: 400, statusMessage: 'Check target must start with /' })
    }

    if (SOURCE_FILE_TARGET_PATTERN.test(target)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Check target must use app route or API route, not source file path. Contoh: /api/settings atau /dashboard/admin/settings',
      })
    }

    const item = createQaMonitorCheck({
      name: body.name.trim(),
      type: body.type,
      target,
      requiresAuth: Boolean(body.requiresAuth),
    })

    return { item }
  }

  return {
    items: listQaMonitorChecks(),
  }
})