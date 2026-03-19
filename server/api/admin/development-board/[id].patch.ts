import { createError, readBody } from 'h3'
import { requireRole } from '../../../utils/auth'
import { updateDevelopmentBoardItem, updateDevelopmentBoardItemStatus, type DevelopmentBoardItemInput, type DevelopmentBoardPriority, type DevelopmentBoardSection, type DevelopmentBoardStatus } from '../../../utils/development-board-db'

const VALID_STATUSES = new Set<DevelopmentBoardStatus>([
  'not-started',
  'in-progress',
  'done',
  'blocked',
  'needs-work',
  'open',
  'fixed',
])
const VALID_SECTIONS = new Set<DevelopmentBoardSection>(['checklist', 'active', 'backlog', 'bug'])
const VALID_PRIORITIES = new Set<DevelopmentBoardPriority>(['high', 'medium', 'low', null])

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Item ID is required' })
  }

  const body = await readBody<Partial<DevelopmentBoardItemInput> & { status?: DevelopmentBoardStatus }>(event)

  if (body.title || body.description || body.section || typeof body.priority !== 'undefined' || typeof body.helperText !== 'undefined' || typeof body.module !== 'undefined' || typeof body.tracer !== 'undefined') {
    if (!body.section || !VALID_SECTIONS.has(body.section)) {
      throw createError({ statusCode: 400, statusMessage: 'Valid section is required' })
    }

    if (!body.title?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Title is required' })
    }

    if (!body.description?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Description is required' })
    }

    if (typeof body.priority === 'undefined' || !VALID_PRIORITIES.has(body.priority)) {
      throw createError({ statusCode: 400, statusMessage: 'Valid priority is required' })
    }

    if (!body.status || !VALID_STATUSES.has(body.status)) {
      throw createError({ statusCode: 400, statusMessage: 'Valid status is required' })
    }

    const item = updateDevelopmentBoardItem(id, {
      section: body.section,
      title: body.title.trim(),
      description: body.description.trim(),
      module: body.module?.trim() || 'General',
      tracer: body.tracer?.trim() || null,
      priority: body.priority,
      status: body.status,
      helperText: body.helperText?.trim() || null,
    })

    if (!item) {
      throw createError({ statusCode: 404, statusMessage: 'Development board item not found' })
    }

    return { item }
  }

  if (!body.status || !VALID_STATUSES.has(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid status is required' })
  }

  const item = updateDevelopmentBoardItemStatus(id, body.status)
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Development board item not found' })
  }

  return { item }
})